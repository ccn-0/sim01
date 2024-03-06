

function _load_image_asset(link) {
    var image_asset = new Image();
    image_asset.src = link;
    return image_asset;
}

function load_assets() {      
    return {
        'hud' : {
            'end_screen' : _load_image_asset("assets/end.png"),
            'dash_active' : _load_image_asset("assets/hud_dash_active.png"),
            'dash_inactive' : _load_image_asset("assets/hud_dash_inactive.png"),
            'attack_active' : _load_image_asset("assets/hud_attack_active.png"),
            'attack_inactive' : _load_image_asset("assets/hud_attack_inactive.png"),
        },
        'other' : {
            'bloodsplosion' : _load_image_asset("assets/explosion.webp"),
            'merchant' : _load_image_asset("assets/merchant.webp"),
            'game_controls' : _load_image_asset("assets/game_controls.png"),
        },
    }
}