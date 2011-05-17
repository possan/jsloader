module.provides('adder',function () {
    dummy_adder = function (a, b) {
        return a + b;
    }
});
module.requires(['square', 'adder', 'subtractor', 'squareroot']).provides('distance', function () {
    dummy_distance = function (a, b) {
        var dx2 = dummy_square(dummy_subtractor(b.x, a.x));
        var dy2 = dummy_square(dummy_subtractor(b.y, a.y));
        return dummy_squareroot(dummy_adder(dx2, dy2));
    }
});module.provides('multiplier',function () {
    dummy_multiplier = function (a, b) {
        return a * b;
    }
});module.requires('multiplier').provides('square', function () {
    dummy_square = function (x) {
        return dummy_multiplier(x, x);
    }
});module.provides('squareroot',function () {
    dummy_squareroot = function (x) {
        return Math.sqrt(x);
    }
});module.provides('subtractor',function () {
    dummy_subtractor = function (a, b) {
        return a - b;
    }
});