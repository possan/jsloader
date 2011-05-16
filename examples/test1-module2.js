module(function () {
    // console.log('in module2.js, requires dep1,dep2');
    requires(['dep1', 'dep2'], function () {
        // console.log('in module2 provide');
        mod2value = dep1value + '+' + dep2value;
        provides('module2');
    });
});