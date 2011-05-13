console.log('in dep1.js');
g_loader.provide('dep1', function (scope) {
    console.log('in dep1 provide.', scope);
    xdep1 = "dep1";
});