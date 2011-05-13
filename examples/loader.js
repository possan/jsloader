//
// LOADER API
//

function Loader(opts) {

    var scope = this.callee;

    var p = {
        scope: scope,
        ext: 'js',
        base: '',
        loading: [],
        loaded: [],
        filequeue: [],
        exequeue: [],
        nocache: false,
        events: []
    }

    if (opts && opts.baseurl)
        p.base = opts.baseurl;

    if (opts && opts.extension)
        p.ext = opts.extension;

    if (opts && opts.nocache)
        p.nocache = opts.nocache;

    p.fileTick = function () {
        // console.log('file tick');
        if (p.filequeue.length < 1)
            return;
        var f = p.filequeue[0];
        // console.log('file tick, download ', f);
        p.loading.push(f);
        p.filequeue.splice(0, 1);
        var u = p.base + f + '.' + p.ext;
        if (p.nocache)
            u += '?cachebuster=' + escape(Math.random());
        var el = document.createElement('script');
        el.type = 'text/javascript';
        el.src = u;
        document.head.appendChild(el);
    }

    p.areDepsReady = function (deps) {
        for (var k = 0; k < deps.length; k++)
            if (p.loaded.indexOf(deps[k]) == -1)
                return false;
        return true;
    }

    p.exeTick = function () {
        console.log('exe tick, queue', p.exequeue);
        var ready = [];
        for (var k = 0; k < p.exequeue.length; k++) {
            if (p.areDepsReady(p.exequeue[k].deps))
                ready.push(k);
        }
        for (var k = ready.length - 1; k >= 0; k--) {
            p.exequeue[ready[k]].callback.apply(p.scope);
        }
        for (var k = ready.length - 1; k >= 0; k--) {
            p.exequeue.splice(ready[k], 1);
        }
        if (p.exequeue.length > 0)
            p.queueExeTick();
    }

    p.queueExeTick = function () {
        if (p.exequeue.length == 0)
            return;
        setTimeout(function () {
            p.exeTick();
        }, 100);
    }

    p.queueFileTick = function () {
        if (p.filequeue.length == 0)
            return;
        setTimeout(function () {
            p.fileTick();
        }, 100);
    }

    p.queueDep = function (f) {
        // console.log('queueDep', f);
        if (p.loaded.indexOf(f) != -1)
            return;
        if (p.loading.indexOf(f) != -1)
            return;
        if (p.filequeue.indexOf(f) != -1)
            return;
        // console.log('really queue dep', f);
        p.filequeue.push(f);
        p.queueFileTick();
    }

    var ret = {
        load: function (filename) {
            //  console.log('Loader ## load', filename);
        },
        provide: function (dep, cb, deps) {
            if (typeof (deps) == 'undefined')
                deps = [];
            // console.log('Loader ## provided', dep, 'requires', deps);
            if (p.areDepsReady(deps)) {
                p.loaded.push(dep);
                cb.apply(p.scope);
            } else {
                for (var k = 0; k < deps.length; k++)
                    p.queueDep(deps[k]);
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
        },
        fire: function (id) {
            console.log('Loader fire', id);
            // flytta alla från events till queue, som kan köras
            var sel = [];
            for (var k = 0; k < p.events.length; k++)
                if (p.events[k].event == id)
                    sel.push(k);
            if (sel.length < 1)
                return;
            for (var k = 0; k < sel.length; k++) {
                var item = p.events[sel[k]];
                p.exequeue.push({
                    callback: item.callback,
                    deps: item.deps
                });
            }
            for (var k = sel.length - 1; k >= 0; k--)
                p.events.splice(sel[k], 1);
            p.queueFileTick();
            p.queueExeTick();
        },
        run: function (callback, deps, event) {
            if (typeof (deps) == 'undefined')
                deps = [];
            if (typeof (event) == 'undefined')
                event = '';
            if (event != '') {
                p.events.push({ event: event, callback: callback, deps: deps });
                console.log(p.events);
                p.queueExeTick();
                return;
            }
            for (var k = 0; k < deps.length; k++)
                p.queueDep(deps[k]);
            // console.log('Loader ## queue', callback, 'requires', deps, 'event', event);
            if (p.areDepsReady(deps)) {
                callback.apply(p.scope);
                return;
            }
            p.exequeue.push({ callback: callback, deps: deps });
            p.queueExeTick();
        }
    }
    return ret;
};


