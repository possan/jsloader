//
// JS LOADER 0.1
//

/** @define {boolean} DEBUG */
var DEBUG = true;

/** @constructor */
function Loader(opts) {
    var scope = this.callee;

    /** @private */
    var p = {
        scope: scope,
        loading: [],
        modulecache: {},
        nocache: DEBUG
    }

    p.root = (opts["root"] || './');
    p.prefix = (opts["prefix"] || '');
    p.ext = (opts["extension"] || '.js');
    p.nocache = (opts["nocache"] || false);

    //
    // LOGGING
    //

    p.log = function (var_args) {
        if (DEBUG) {
            var console_ok = false;
            if (typeof (console) != 'undefined') {
                try {
                    console.log.apply(console, arguments);
                    console_ok = true;
                } catch (e) {
                }
            }
            if (!console_ok) {
                var el = document.getElementById('legacydebug');
                if (typeof (el) != 'undefined' && el) {
                    var el2 = document.createElement('div');
                    var str = '';
                    for (var k = 0; k < arguments.length; k++)
                        str += arguments[k] + ' ';
                    // alert(str);
                    el2.innerHTML = str;
                    el.appendChild(el2);
                }
            }
        }
    };

    //
    // Internal jobqueue
    //

    p._jobQueue = [];

    p.queueJob = function (job) {
        if (DEBUG) {
            job.toString = function () {
                var ret = "";
                if (typeof (this.deps) != 'undefined' && this.deps.length > 0)
                    ret += "deps=" + this.deps;
                if (typeof (this.provides) != 'undefined') {
                    if (ret != "")
                        ret += ", ";
                    ret += "provides=" + this.provides;
                }
                ret = "[" + ret + "]";
                return ret;
            }
        }
        p._jobQueue.push(job);
        if (DEBUG) {
            p.log('queueJob: queueing ', job);
            // for (var k = 0; k < p._jobQueue.length; k++)
            //     p.log('queueJob: new queue #' + k + ': ' + p._jobQueue[k]);
        }
    }

    if (DEBUG)
        p.tickCounter = 0;

    p.combTick = function () {
        if (DEBUG)
            p.tickCounter++;

        if (p._jobQueue.length < 1) {
            DEBUG && p.log('combTick #' + p.tickCounter + '; queue empty.');
            return;
        }

        if (DEBUG) {
            p.log('--------------------------------------------------------------------------');
            p.log('BEFORE JOB');
            p.log('--------------------------------------------------------------------------');
            p.log('modulecache', p.modulecache);
            p.log('loading', p.loading);
            p.log('--------------------------------------------------------------------------');
        }

        var job = p._jobQueue.splice(0, 1)[0];
        job.handler(job);

        if (DEBUG) {
            p.log('--------------------------------------------------------------------------');
            p.log('AFTER JOB');
            p.log('--------------------------------------------------------------------------');
            p.log('modulecache', p.modulecache);
            p.log('loading', p.loading);
            p.log('--------------------------------------------------------------------------');
        }
    }

    p.lastCombTick = -1;

    p.queueTick = function (delay) {
        if (p.lastCombTick != -1)
            clearTimeout(p.lastCombTick);
        if (typeof (delay) == 'undefined')
            delay = DEBUG ? 500 : 1;
        p.lastCombTick = setTimeout(function () {
            p.lastCombTick = -1;
            p.combTick();
        }, delay);
    }

    //
    // XHR / URL junk
    //

    // from fiji xhr: http://code.google.com/p/xhr/source/browse/trunk/xhr.js
    p.ie_activex = false;
    p.getXHR = function () {
        if (window.XMLHttpRequest) {
            // DEBUG && p.log('creating using window.XMLHttpRequest');
            return new XMLHttpRequest();
        } else if (window["ActiveXObject"]) {
            // DEBUG && p.log('creating using window.ActiveXObject');
            if (p.ie_activex) {
                return new ActiveXObject(p.ie_activex);
            } else {
                var axs = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                for (var i = 0; i < axs.length; i++) {
                    try {
                        // DEBUG && p.log('trying ' + axs[i]);
                        var xhr = new ActiveXObject(axs[i]);
                        // DEBUG && p.log('got ' + xhr);
                        if (xhr) {
                            p.ie_activex = axs[i];
                            return xhr;
                            break;
                        }
                    }
                    catch (e) { /* next */ }
                }
            }
        }
        // DEBUG && p.log('no xhr created.');
        return false;
    };

    // modified xhr from xui 2.0.0: http://xuijs.com/downloads/xui-2.0.0.js
    p.xhr = function (url, options) {

        var o = options ? options : {};
        if (typeof options == "function") {
            o = {};
            o.callback = options;
        };

        var that = this,
            method = o.method || 'get',
            i = 0;

        var req = p.getXHR();
        if (typeof (req) == 'undefined') {
            // DEBUG && p.log('unable to create a xhr');
            return;
        }

        o.error = (o.error && typeof o.error == 'function') ? o.error : function () { };

        req.onreadystatechange = function (a) {
            // DEBUG && p.log('req.onreadystatechange', req.readyState);
            if (req.readyState == 4) {
                // DEBUG && p.log('req.status', req.status);
                // delete (that.xmlHttpRequest);
                if (req.status === 0 || req.status == 200)
                    o.callback.apply(req, [that]);
                if ((/^[45]/).test(req.status))
                    o.error.apply(req);
            }
        }

        req.open(method, url, true);
        that.xmlHttpRequest = req;
        req.send('');

        return this;
    }

    p.getUrlFromDep = function (dep) {
        var u = p.root + p.prefix + dep + p.ext;
        if (p.nocache)
            u += '?dummy=' + escape(Math.random());
        return u;
    }

    //
    // List helpers
    //

    var Array_indexOf = function (arr, obj, start) {
        for (var i = (start || 0); i < arr.length; i++)
            if (arr[i] == obj)
                return i;
        return -1;
    }

    //
    // Job workers
    //

    p.cleanDeps = function (deps) {
        if (typeof (deps) == 'undefined') return [];
        if (typeof (deps) == 'string') return [deps];
        return deps;
    }

    p.createDefineFunction = function (depname) {
        return function (a, b, c) {
            // define( require, exports, module ) -called
            if (typeof (c) == 'undefined') {
                if (typeof (b) == 'undefined') {
                    // define( module  ) ...
                    DEBUG && p.log('registering module ', depname, ' (', a, ') without dependencies');
                    p.modulecache[depname] = { callback: a, args: [], ready: true };
                    DEBUG && p.log('marking module READY', depname);
                    return;
                }

                // define( ['dep','dep'], module  ) ...
                DEBUG && p.log('registering module', depname, '(', b, ') with dependencies', a);
                p.modulecache[depname] = { callback: b, args: a, ready: false };
                p.queueDepJobs(a);
                return;
            }
            // ignore exports (b) for now
            // define( ['dep','dep'], exports, module ) ...
            DEBUG && p.log('registering module ', depname, '(', c, ') with dependencies', a);
            p.modulecache[depname] = { callback: c, args: a, ready: false };
            p.queueDepJobs(a);
        }
    }

    p.resolveDependencyJob = function (job) {
        var dep = job.module;
        DEBUG && p.log('resolve: resolve dependency: ' + dep);

        if (dep[0] == '.') {
            DEBUG && p.log('resolve:', dep, 'starts with dot, ignore.');
            p.queueTick();
            return;
        }

        var mod = p.modulecache[dep];
        if (typeof (mod) != 'undefined') {
            if (mod.ready == true) {
                DEBUG && p.log('resolve:', dep, 'already cached (and ready).');
                p.queueTick();
                return;
            }

            DEBUG && p.log('resolve:', dep, 'already cached but not ready yet, check dependencies.');
            if (!p.queueDepJobs(mod.args)) {
                DEBUG && p.log('resolve:', dep, 'all dependencies ready, mark as ready.');
                mod.ready = true;
            }
            p.queueTick();
            return;
        }

        if (Array_indexOf(p.loading, dep) != -1) {
            DEBUG && p.log('resolve:', dep, 'is loading...');
            p.queueTick();
            return;
        }

        if (Array_indexOf(p.loading, dep) == -1)
            p.loading.push(dep);

        var url = p.getUrlFromDep(dep);
        DEBUG && p.log('resolve: Resolving dependency: ' + dep + ' from ' + url);
        // DEBUG && p.log('-----xhr-----');
        p.xhr(url, { callback: function () {

            p.loading.splice(Array_indexOf(p.loading, dep), 1);

            var that = this;
            DEBUG && p.log('resolve: downloaded ' + this.responseText);
            // wrap in a function and inject a few objects
            (function () {
                // DEBUG && p.log('before create');
                var def = p.createDefineFunction(dep);
                var fn = new Function('define', that.responseText);
                // DEBUG && p.log('created', fn);
                // DEBUG && p.log('def', def);
                var sandbox = {}
                // DEBUG && p.log('resolve: invoking.');
                try {
                    fn.apply(sandbox, [def]);
                } catch (e) {
                    DEBUG && p.log('apply crashed.');
                    DEBUG && p.log(e);
                }
                DEBUG && p.log('resolve: done invoking.');
            })();
            p.queueTick();
        }, error: function () {
            DEBUG && p.log('resolve: failed to load', u);
            p.queueJob(job); // try again later
            p.queueTick();
        }
        });
    };

    p.findNonReadyDeps = function (deps) {
        deps = p.cleanDeps(deps);
        DEBUG && p.log('queueDepJobs: check dependencies: ' + deps);
        if (deps.length == 0)
            return [];

        var any = [];
        for (var k = 0; k < deps.length; k++) {
            var dep = deps[k];
            DEBUG && p.log('queueDepJobs: checking for dependency: ' + dep);

            if (typeof (p.modulecache[dep]) != 'undefined' && p.modulecache[dep].ready == true) {
                DEBUG && p.log('queueDepJobs: dependency already loaded: ' + dep);
                continue;
            }

            any.push(dep);
        }

        return any;
    }

    p.queueDepJobs = function (deps) {
        deps = p.cleanDeps(deps);
        var any = false;
        var nonready = p.findNonReadyDeps(deps);
        DEBUG && p.log('queueDepJobs: non ready dependencies:', nonready);
        for (var k = 0; k < nonready.length; k++) {
            var dep = nonready[k];
            DEBUG && p.log('queueDepJobs: queueing resolve dependency job: ' + dep);
            p.queueJob({ handler: p.resolveDependencyJob, module: dep });
            any = true;
        }
        return any;
    }

    p.tryResolveDependencyValue = function (dep, allowqueue) {

        DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', allowqueue=' + allowqueue);

        var mod = p.modulecache[dep];
        if (typeof (mod) == 'undefined') {
            DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', invalid input');
            return false;
        }

        if (mod.ready == true) {
            DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', using cached ready-value');
            return true;
        }

        DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', module:', mod);
        DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', module dependencies:', mod.args);

        var anyqueued = p.queueDepJobs(mod.args);
        // DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', anyqueued:', anyqueued);
        if (anyqueued) {
            p.queueTick();
            DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', has non-ready dependencies, requeue');
            return false;
        }

        for (var i = 0; i < mod.args.length; i++) {
            DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', trying to resolve nested dependency #' + i + ', ' + mod.args[i]);
            var v = p.tryResolveDependencyValue(mod.args[i], allowqueue);
            if (v == false) {
                DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', nested resolve #' + i + ' failed.');
                return false;
            }
            DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', nested resolve #' + i + ' ok');
        }

        DEBUG && p.log('tryResolveDependencyValue: dep=' + dep + ', caching as ready.');
        mod.ready = true;
        return true;
    };

    p.resolveDependencyValue = function (dep) {

        DEBUG && p.log('resolveDependencyValue: dep=' + dep);

        var mod = p.modulecache[dep];
        if (typeof (mod) == 'undefined')
            return null;

        DEBUG && p.log('resolveDependencyValue module:', mod);
        DEBUG && p.log('resolveDependencyValue module dependencies:', mod.args);

        var anyqueued = p.queueDepJobs(mod.args);
        if (anyqueued) {
            DEBUG && p.log('resolveDependencyValue: some missing dependencies queued', mod.args);
            p.queueTick();
            return null;
        }

        var args = [];
        for (var i = 0; i < mod.args.length; i++) {
            var v = p.resolveDependencyValue(mod.args[i], false);
            DEBUG && p.log('resolved arg #' + i + ' = ' + v);
            args.push(v);
        }

        DEBUG && p.log('final args', args);
        DEBUG && p.log('resolveDependencyValue: dependencies are met, run!');

        var exp = {};

        DEBUG && p.log('resolveDependencyValue calling module:', mod);

        //try { 
        DEBUG && p.log('resolveDependencyValue: calling callback with args', args);
        scope = {};
        exp = mod.callback.apply(scope, args);
        DEBUG && p.log('resolveDependencyValue: after callback, got', exp);
        //} catch (e) {
        //DEBUG && p.log('resolveDependencyValue: callback failed', e);
        //}

        DEBUG && p.log('resolveDependencyValue exports', exp);

        return exp;
    };

    p.executeJob = function (job) {
        DEBUG && p.log('executeJob: executing: ', job);

        if (!p.tryResolveDependencyValue(job.module, true)) {
            DEBUG && p.log('executeJob: cant resolve all dependencies, try later');
            p.queueJob(job); // run execute later!
            p.queueTick();
            return;
        }

        DEBUG && p.log('executeJob: before execute');
        var dummy = p.resolveDependencyValue(job.module);
        DEBUG && p.log('executeJob: RESOLVED', job.module, 'returned', dummy);
        p.modulecache[job.module].ready = true;
        p.queueTick();
    };

    p.queueTick(); // tick tock...
    DEBUG && p.log('ready.');

    return function (deps, cb) {
        deps = p.cleanDeps(deps);
        DEBUG && p.log('require: called with deps=', deps, 'callback=', cb);
        var dummymodulename = '.$' + (Math.random());
        p.modulecache[dummymodulename] = { callback: cb, args: deps, ready: false };
        p.queueDepJobs(deps);
        p.queueJob({ handler: p.executeJob, module: dummymodulename });
        p.queueTick();
    };
}

window["Loader"] = Loader;