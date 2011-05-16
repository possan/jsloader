module(function () {
    // console.log('in dep2.js file');
    requires('dep3', function () {
        // console.log('in dep2.js code');
        dep2value = 'dep2 value+' + dep3value;
        provides('dep2');
    });
});