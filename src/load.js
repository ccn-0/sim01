

function _load_image_asset(link) {
    var image_asset = new Image();
    image_asset.src = link;
    return image_asset;
}

function load_assets() {      
    return {
        'hud' : {
            'end_screen' : _load_image_asset("https://cdn.discordapp.com/attachments/788804003315449857/1005542893609558107/end.png"),
            'dash_active' : _load_image_asset("assets/hud_dash_active.png"),
            'dash_inactive' : _load_image_asset("assets/hud_dash_inactive.png"),
            'attack_active' : _load_image_asset("assets/hud_attack_active.png"),
            'attack_inactive' : _load_image_asset("assets/hud_attack_inactive.png"),
        },
        'marty' : {
            'model_idle' : _load_image_asset("https://cdn.discordapp.com/emojis/756206456679694567.webp"),
            'model_hit' : _load_image_asset("https://cdn.discordapp.com/attachments/749608248184799345/1005794573240520724/marty_hit.webp"),
        },

        'other' : {
            'bloodsplosion' : _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005847942969704468/explosion.webp"),
            'merchant' : _load_image_asset("https://cdn.discordapp.com/attachments/671443540819312731/1005911569005297726/merchant.webp"),
        },
    }
}