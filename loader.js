//
// LOADER API
//

/** @define {boolean} DEBUG */
var DEBUG = true;

/** @constructor */
function Loader(opts) {

    if (typeof XMLHttpRequest == "undefined")
        XMLHttpRequest = function () {
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
            catch (e) { }
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
            catch (e) { }
            try { return new ActiveXObject("Microsoft.XMLHTTP"); }
            catch (e) { }
            //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
            throw new Error("This browser does not support XMLHttpRequest.");
        };

    var scope = this.callee;

    /** @private */
    var p = {
        scope: scope,
        ext: 'js',
        root: '',
        deps: {
            loading: [],
            loaded: [],
            ready: []
        },
        // filequeue: [],
        // bvexequeue: [],
        nocache: false,
        domevents: false,
        events: []
    }

    p.log = function (var_args) {
        if (DEBUG) {
            console.log.apply(console, arguments);
        }
    };

    if (opts && opts["root"])
        p.root = opts["root"];

    if (opts && opts["extension"])
        p.ext = opts["extension"];

    if (opts && opts["nocache"])
        p.nocache = opts["nocache"];

    if (opts && opts["domevents"])
        p.domevents = opts["domevents"];

    //
    // Internal jobqueue
    //

    p._jobQueue = [];

    p.queueJob = function (data) {
        p.log('queue job', data);
        p._jobQueue.push(data);
        p.log('new queue length: ' + p._jobQueue.length, p._jobQueue);
        // TODO: wake timer up
    }

    p.combTick = function () {
        p.log('combTick; queue length: ' + p._jobQueue.length);
        if (p._jobQueue.length < 1) {
            // queue is empty, check again in a while.
            p.queueCombTick(DEBUG ? 6000 : 2000);
            return;
        }

        var job = p._jobQueue.splice(0, 1)[0];
        p.log('running job', job);
        job.handler(job);
    }

    p.lastCombTick = -1;

    p.queueCombTick = function (delay) {
        if (p.lastCombTick != -1)
            clearTimeout(p.lastCombTick);
        if (typeof (delay) == 'undefined')
            delay = DEBUG ? 1000 : 1;
        p.log('queue comb tick; delay=' + delay);
        p.lastCombTick = setTimeout(function () {
            p.lastCombTick = -1;
            p.combTick();
        }, delay);
    }

    //
    // XHR / URL junk
    //

    // modified xhr from xui 2.0.0: http://xuijs.com/downloads/xui-2.0.0.js
    p.xhr = function (url, options) {
        var o = options ? options : {};
        if (typeof options == "function") {
            o = {};
            o.callback = options;
        };
        var that = this,
            req = new XMLHttpRequest(),
            method = o.method || 'get',
            async = o.async || true,
            params = o.data || null,
            i = 0;
        req.queryString = params;
        req.open(method, url, async);
        if (o.headers) {
            for (; i < o.headers.length; i++) {
                req.setRequestHeader(o.headers[i].name, o.headers[i].value);
            }
        }
        req.handleResp = o.callback;
        req.handleError = (o.error && typeof o.error == 'function') ? o.error : function () { };
        function hdl() {
            if (req.readyState == 4) {
                delete (that.xmlHttpRequest);
                if (req.status === 0 || req.status == 200) req.handleResp();
                if ((/^[45]/).test(req.status)) req.handleError();
            }
        }
        if (async) {
            req.onreadystatechange = hdl;
            xmlHttpRequest = req;
        }
        req.send(params);
        return this;
    }

    p.getUrlFromDep = function (dep) {
        var u = p.root + dep + '.' + p.ext;
        if (p.nocache)
            u += '?dummy=' + escape(Math.random());
        return u;
    }

    //
    // List helpers
    //

    Array.prototype.map = function (cb) {
        var ret = [];
        for (var k = 0; k < this.length; k++) {
            var r = cb(this[k], k);
            for (var i = 0; i < r.length; i++)
                cb.push(r[i]);
        }
        return ret;
    }

    Array.prototype.each = function (cb) {
        for (var k = 0; k < this.length; k++) {
            cb(this[k], k);
        }
        return this;
    }

    Array.prototype.find = function (cb) {
        var ret = false;
        for (var k = 0; k < this.length; k++) {
            ret |= cb(this[k], k);
        }
        return ret;
    }

    Array.prototype.anyOf = function (items) {
        return this.find(function (e, i) { return (items.indexOf(e) != -1); });
    }
    Array.clean = function (items) { 
        if (typeof (items) == 'undefined')
            return;
        if (typeof (items) == 'string')
            items = [items];
        return items;
    }
    Array.prototype._enableItems = function (items, yes) {
        p.log('enableItems: ', items, yes);        
        if (typeof (yes) == 'undefined')
            yes = true;
        if (typeof (items) == 'undefined')
            return;
        if (typeof (items) == 'string')
            items = [items];
        for (var k = 0; k < items.length; k++) {
            var dep = items[k];
            var i = this.indexOf(dep);
            if (i == -1 && yes) {
                p.log('enableItems: adding ' + dep);
                this.push(dep);
            }
            else if (i != -1 && !yes) {
                p.log('enableItems: removing ' + dep);
                this.splice(i, 1);
            }
        }
    }
    Array.prototype.addItems = function (items) {
        this._enableItems(items, true);
    }
    Array.prototype.removeItems = function (items) {
        this._enableItems(items, false);
    }


    //
    // Dependency list
    //
    p.markReady = function (deps) {
        deps = Array.clean(deps);
        p.log('markReady: ', deps);
        p.deps.ready.addItems(deps);
    }

    p.isReady = function (deps) {
        deps = Array.clean(deps);
        if (deps.length == 0)
            return true;
        return p.deps.ready.anyOf(deps);
    }

    p.markLoaded = function (deps) {
        deps = Array.clean(deps);
        p.log('markLoaded: ', deps);
        p.deps.loaded.addItems(deps);
    }

    p.markLoading = function (deps, yes) {
        deps = Array.clean(deps);
        p.log('markLoading: ', deps, yes);
        if (typeof (yes) == 'undefined')
            yes = true;
        if (yes)
            p.deps.loading.addItems(deps);
        else
            p.deps.loading.removeItems(deps);

    }

    p.isLoading = function (deps) {
        deps = Array.clean(deps);
        if (deps.length == 0)
            return true;
        return p.deps.loading.anyOf(deps);
    }

    p.isLoaded = function (deps) {
        deps = Array.clean(deps);
        if (deps.length == 0)
            return true;
        return p.deps.loaded.anyOf(deps);
    }

    //
    // Job workers
    //

    p.createModuleObject = function (donecb) {
        var _d = [];
        var ret = {};
        ret["requires"] = function (deps) {
            if (typeof (deps) == 'string')
                deps = [deps];
            _d = deps;
            return ret;
        }
        ret["provides"] = function (dep, cb) {
            var item = { event: event, callback: cb, deps: _d, provides: dep };
            p.log('createModuleObject: provides called:', item);
            // p.queueDeps(_d);
            // p.events.push(item);
            p.queueJob({
                handler: p.executeFunctionJob,
                item: item,
                callback: cb,
                deps: _d,
                provides: dep
            });
            // p.markLoaded(dep);
            donecb(item);
            return ret;
        }
        return ret;
    }

    p.queueDepJobs = function (deps) {
        p.log('queueDepJobs: ', deps);
        if (typeof (deps) == 'undefined')
            return;
        if (typeof (deps) == 'string')
            deps = [deps];
        for (var k = 0; k < deps.length; k++) {
            var dep = deps[k];
            if (p.isLoaded(dep))
                continue;
            if (p.isLoading(dep))
                continue;
            p.log('queueDepJobs: queueing resolve dependency job: ' + dep);
            p.queueJob({
                handler: p.resolveDependencyJob,
                name: dep
            });
        }
    }

    p.resolveDependencyJob = function (job) {
        var dep = job.name;
        p.log('resolveDependencyJob: trying to resolve dependency: ' + dep);

        if (typeof (job.deps) != 'undefined') {
            if (p.isLoaded(job.deps)) {
                p.log('resolveDependencyJob: ', job.deps, ' already loaded, skip.');
                // p.queueJob(job); // try again later
                p.queueCombTick();
                return;
            }
        }

        if (p.isLoading(dep)) {
            p.log('resolveDependencyJob: ', dep, ' already loading, wait...');
            p.queueCombTick();
            return;
        }

        p.markLoading(dep, true);
        p.log('resolveDependencyJob: Resolving dependency: ' + dep);
        var url = p.getUrlFromDep(dep);
        p.log('resolveDependencyJob: downloading', url);
        p.xhr(url, { callback: function () {

            p.markLoading(dep, false);
            p.log('resolveDependencyJob: downloaded', this.responseText);
            // wrap in a function and inject a few objects
            var fn = new Function('module', this.responseText);
            var _mod = p.createModuleObject(function (data) {
                p.log('resolveDependencyJob: Module created from within resolveDependencyJob', data);
            });
            // call it
            p.log('resolveDependencyJob: invoking.');
            fn(_mod);
            p.queueCombTick();
        }, error: function () {
            p.log('resolveDependencyJob: failed to load', u);
            p.queueJob(job); // try again later
            p.queueCombTick();
        }
        });
    };

    p.executeFunctionJob = function (job) {
        p.log('executeFunctionJob:', job);

        if (!p.isReady(job.deps)) {
            p.log('executeFunctionJob: missing dependencies', job.deps);
            p.queueDepJobs(job.deps);
            p.queueJob(job); // try again later
            p.queueCombTick();
            return;
        }

        p.log('executeFunctionJob: dependencies are met, run!');
        job.callback.apply(p.scope);
        if (typeof (job.provides) != 'undefined')
            p.markReady(job.provides);
        p.queueCombTick();
    };

    /*
    p.exeTick = function () {
    // console.log('exe tick, queue', p.exequeue);
    var ready = [];
    for (var k = 0; k < p.exequeue.length; k++)
    if (p.areDepsReady(p.exequeue[k].deps))
    ready.push(k);
    for (var k = ready.length - 1; k >= 0; k--) {
    var item = p.exequeue[ready[k]];
    item.callback.apply(p.scope);
    p.markDepLoaded(item.provides);
    }
    for (var k = ready.length - 1; k >= 0; k--)
    p.exequeue.splice(ready[k], 1);
    if (p.exequeue.length > 0)
    p.queueExeTick();
    }

    p.lastExeTick = -1;
    p.queueExeTick = function () {
    if (p.exequeue.length == 0)
    return;
    if (p.lastExeTick != -1)
    clearTimeout(p.lastExeTick);
    p.lastExeTick = setTimeout(function () {
    p.lastExeTick = -1;
    p.exeTick();
    }, 1);
    }

    p.fileTick = function () {
    // console.log('file tick');
    if (p.filequeue.length < 1)
    return;
    var f = p.filequeue[0];
    // console.log('file tick, download ', f);
    p.loading.push(f);
    p.filequeue.splice(0, 1);
    var u = p.getUrlFromDep(f);
    p.log('downloading', u);
    p.xhr(u, { callback: function () {
    p.log('downloaded', this.responseText);
    // wrap in a function and inject a few objects
    var fn = new Function('module', this.responseText);
    var _mod = p.createModuleObject(function () {
    p.log('Module created from within fileTick');
    });
    // call it
    p.log('invoking.');
    fn(_mod);
    p.log('done invoking, queue next...');
    p.queueExeTick();
    }, error: function () {
    p.queueExeTick();
    }
    });
    }

    p.lastFileTick = -1;
    p.queueFileTick = function () {
    if (p.filequeue.length == 0)
    return;
    if (p.lastFileTick != -1)
    clearTimeout(p.lastFileTick);
    p.lastFileTick = setTimeout(function () {
    p.lastFileTick = -1;
    p.fileTick();
    }, 1);
    }
    */

    p.innerRun = function (callback, deps, event) {
        p.log('innerRun: called with deps=', deps, 'event=', event, 'callback=', callback);

        if (typeof (deps) == 'string')
            deps = [deps];
        if (typeof (deps) == 'undefined')
            deps = [];
        if (typeof (event) == 'undefined')
            event = '';
        if (event != '') {
            p.log('innerRun: is event (' + event + '), queue for later run.');
            // p.queueDeps(
            p.events.push({ event: event, callback: callback, deps: deps });
            // console.log(p.events);
            // p.queueExeTick();
            return;
        }

        p.log('innerRun: queue all dependencies');
        if (p.isLoaded(deps)) {
            p.log('innerRun: all dependencies satisfied, run now.');
            callback.apply(p.scope);
            p.queueCombTick();
            return;
        }

        p.log('innerRun: queue later.');
        // p.queueDeps(deps);
        p.queueJob({ handler: p.executeFunctionJob, callback: callback, deps: deps });
        p.queueCombTick();
    }
    /*
    p.innerProvide = function (dep, cb, deps) {
    if (typeof (deps) == 'string')
    deps = [deps];
    if (typeof (deps) == 'undefined')
    deps = [];
    // console.log('Loader ## provided', dep, 'requires', deps);
    if (p.areDepsReady(deps)) {
    p.loaded.push(dep);
    cb.apply(p.scope);
    } else {
    p.queueDeps(deps);
    p.exequeue.push({
    callback: function () {
    p.loaded.push(dep);
    cb.apply(p.scope);
    },
    deps: deps
    });
    }
    p.queueFileTick();
    p.queueExeTick();
    }*/

    p.innerFire = function (id) {

        p.log('innerFire: fire events (' + id + ')');

        var sel = [];

        for (var k = 0; k < p.events.length; k++)
            if (p.events[k].event == id)
                sel.push(k);

        if (sel.length < 1)
            return;

        for (var k = 0; k < sel.length; k++) {
            var item = p.events[sel[k]];
            p.queueJob({
                handler: p.executeFunctionJob,
                callback: item.callback,
                deps: item.deps
            });
        }

        for (var k = sel.length - 1; k >= 0; k--)
            p.events.splice(sel[k], 1);

        p.queueCombTick(); // asap!
    }

    p.innerRegisterDomEvents = function () {
        if (document.addEventListener) {
            // console.log('registering handlers with addEventListener');
            document.addEventListener('load', function () { p.innerFire('load'); }, false);
            document.addEventListener('DOMContentLoaded', function () { p.innerFire('ready'); }, false);
        } else if (document.attachEvent) {
            //console.log('registering handlers with attachEvent');
            document.attachEvent('onload', function () { p.innerFire('load'); });
            document.attachEvent('ondocumentready', function () { p.innerFire('ready'); });
        } else {
            // console.log('registering handlers fallback');
            document.onload = function () { p.innerFire('load'); };
            document.ondocumentready = function () { p.innerFire('ready'); };
        }
    }

    var ret = {};

    ret["module"] = p.createModuleObject(function () {
        p.log('Module created from Loader, start ticks');
        // p.queueFileTick();
        // p.queueExeTick();
    });

    ret["load"] = function (dep) {
        p.queueDeps(dep);
        // p.queueFileTick();
        // p.queueExeTick();
    };

    ret["requires"] = function (deps, cb) {
        p.innerRun(cb, deps, '');
    };
    ret["require"] = function (deps, cb) {
        p.innerRun(cb, deps, '');
    };
    ret["when"] = function (eventid, cb) {
        p.innerRun(cb, [], eventid);
    };
    ret["fire"] = function (eventid) {
        p.innerFire(eventid);
    };
    ret["run"] = function (callback, deps, eventid) {
        p.innerRun(callback, deps, eventid);
    };
    ret["registerDomEvents"] = function () {
        p.innerRegisterDomEvents();
    };

    if (p.domevents)
        p.innerRegisterDomEvents();

    p.queueCombTick(); // tick tock...

    return ret;
}
window["Loader"] = Loader;