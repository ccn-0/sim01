// function load_anim_transitions() {
//     // Transition tables for animation states
//     return {
//         'offsets' : {
//             'honzeek' : {
//                 0 : 0,
//             },
//             'marty' : {
//                 0 : 0,
//             },
//             'myreg' : {
//                 0 : 1,
//                 8 : 2,
//                 16 : 1,
//                 24 : 0,
//             }
//         },
//         'states' : {
//             'honzeek' : {
//                 0 : assets.honzeek.model_idle,
//             },
//             'marty' : {
//                 0 : assets.marty.model_idle,
//             },
//             'myreg' : {
//                 0 : assets.myreg.model_idle,
//                 1 : assets.myreg.model_anim0,
//                 2 : assets.myreg.model_anim1,
//             }
//         }
//     }
// }

function _load_image_asset(link) {
    var image_asset = new Image();
    image_asset.src = link;
    return image_asset;
}

function load_assets() {      
    return {
        'hud' : {
            'end_screen' : _load_image_asset("https://cdn.discordapp.com/attachments/788804003315449857/1005542893609558107/end.png"),
        },
        'tiles' : {
            // "https://cdn.discordapp.com/attachments/749608248184799345/1005129290582609960/unknown.png"
            'grass' : _load_image_asset("assets/tile_grass.png"),
        },
        'player' : {
            'model_idle' : _load_image_asset("https://cdn.discordapp.com/emojis/980168035082055690.webp"),
            'model_hit' : _load_image_asset("https://cdn.discordapp.com/emojis/980168035082055690.webp"),
        },
        'honzeek' : {
            'model_idle' : _load_image_asset("https://cdn.discordapp.com/emojis/857700195689300008.webp"),
            'model_hit' : _load_image_asset("https://cdn.discordapp.com/attachments/749608248184799345/1004827766283309126/honzeek_hit.webp"),
        },
        'marty' : {
            'model_idle' : _load_image_asset("https://cdn.discordapp.com/emojis/756206456679694567.webp"),
            'model_hit' : _load_image_asset("https://cdn.discordapp.com/attachments/749608248184799345/1005794573240520724/marty_hit.webp"),
        },
        'myreg' : {
            'model_idle' : _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804398619938917/frame_0_delay-0.1s.gif"),
            'model_hit' : _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005836644869472317/myreg_hit.webp"),
            'model_anim0' : _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804398900940890/frame_1_delay-0.1s.gif"),
            'model_anim1' : _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804399303606282/frame_2_delay-0.1s.gif"),
        },
        'other' : {
            'bloodsplosion' : _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005847942969704468/explosion.webp"),
            'merchant' : _load_image_asset("https://cdn.discordapp.com/attachments/671443540819312731/1005911569005297726/merchant.webp"),
        },
    }
}