module.requires(['dep1', 'dep2']).provides('module2', function () {
    mod2value = dep1value + '+' + dep2value;
});