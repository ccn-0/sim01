class Merchant {

    static overlay = _load_image_asset("assets/merchant.webp"); 

    constructor() {
        this.width = 768;
        this.height = 512;
        this.__draw_offer_offset = 100;
        
        this.active = false;
        this.offers = [];
    }

    enable() {
        // Called on player level up
        this.active = true;
        paused = true;
        this._generate_offers();
    }

    disable() {
        // Called after player chose modifier
        world.player.recalc_stats();
        this.offers = [];
        this.active = false;
        paused = false;
    }

    _generate_offers() {    
        var _mod_ids = weighted_random(StatModifier.mods_db, 3); // Pick 3 random but different mods
        for (let i = 0; i < 3; i++) {
            const _mod_id = _mod_ids[i];
            var _tier_id = weighted_random(StatModifier.mods_db[_mod_id].tiers, 1);
            this.offers.push( new StatModifier(_mod_id, _tier_id) );  
        } 
    }
}