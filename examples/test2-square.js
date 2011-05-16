module.requires('multiplier').provides('square', function () {
    dummy_square = function (x) {
        return dummy_multiplier(x, x);
    }
});