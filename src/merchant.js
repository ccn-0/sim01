class Merchant {

    static overlay = _load_image_asset("https://cdn.discordapp.com/attachments/671443540819312731/1005911569005297726/merchant.webp"); 

    constructor() {
        this.width = 512;
        this.height = 256;
        this.active = false;
        this.offers = undefined;
    }

    enable() {
        this.active = true;
        paused = true;
        this._generate_offers();
    }

    disable() {
        this.active = false;
        paused = false;
    }

    _generate_offers() {
        // Table with player modifiers and their weights.
        var modifiers = [
            [100, "defense1"],
            //[100, "block1"],
            //[100, "life1"],
            [100, "damage1"],
            //[100, "damage_percent1"],
            //[100, "attack_speed1"],
            //[100, "dash_speed1"],
            //[100, "movement1"],   
            //[50, "projectile_speed1"],
            [50, "projectile_spread1"],
            //[50, "critical1"],
            [50, "projectile_pierce1"],
            [25, "projectile_chain1"],
            [50, "multiproj1"],
            //[10, "xp_multiplier1"],
        ];
    
        var offers = [];
    
        for (var i = 0; i < 3; i++) {
            // Pick weighted random
            var random_mod = weighted_random(modifiers);
            offers.push(random_mod.item);
            // Remove for next round 
            modifiers.splice(random_mod.i, 1);
        }
        this.offers = offers
    }

}