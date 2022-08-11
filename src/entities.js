function _make_merchant() {
    var x = world.player.x;
    var y = world.player.y;
    var offers = _generate_offers();
    // Entity for merchant
    return {
        'eid' : global_eid++,
        'x' : x,
        'y' : y,
        'sizes' : {'width' : 512, 'height' : 256},
        'color' : "#000000",
        'model' : assets.other.merchant,
        'offers' : offers,
    }
}