// console.log('in dep2.js, requires dep3.js');
g_loader.provide('dep2', function (scope) {
    console.log('in dep2 require', scope);

    xdep2 = "dep2 " + xdep3;

}, ['dep3']);