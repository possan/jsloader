console.log('in dep3.js');
g_loader.provide('dep3', function (scope) {
    console.log('in dep3 provide.', scope);
    xdep3 = "dep3";
});