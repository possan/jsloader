module(function () {
    // console.log('in dep1.js file');
    requires('dep2', function () {
        // console.log('in dep1.js code');
        dep1value = "dep1 va lue";
        provides('dep1');
    });
});