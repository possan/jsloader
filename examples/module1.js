console.log('in module1.js, requires dep1.js');
g_loader.provide('module1', function (scope) {
    console.log('in module2 provide: ' + xdep1);
    mod1value = "module1 " + xdep1;
}, ['dep1']);
