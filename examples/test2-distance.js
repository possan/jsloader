module.requires(['square', 'adder', 'subtractor', 'squareroot']).provides('distance', function () {
    dummy_distance = function (a, b) {
        var dx2 = dummy_square(dummy_subtractor(b.x, a.x));
        var dy2 = dummy_square(dummy_subtractor(b.y, a.y));
        return dummy_squareroot(dummy_adder(dx2, dy2));
    }
});