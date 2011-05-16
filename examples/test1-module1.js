module(function () {
    // console.log('in module1.js, requires dep1.js');
    requires('dep1', function () {
        // console.log('in module1 provide',this);
        mod1value = 'mod1value ' + dep1value;
        provides('module1');
    });
});