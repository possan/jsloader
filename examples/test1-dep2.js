module.requires('dep3').provides('dep2', function () {
    dep2value = 'dep2 value+' + dep3value;
});