console.log('in module2.js, requires dep1,dep2');
g_loader.provide('module2', function (scope) {
    console.log('module2 in require: ' + xdep2);
    mod2value = "module2 "+xdep2;
}, ['dep2']);