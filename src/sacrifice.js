class SacrificeAltar {

    static overlay = _load_image_asset("assets/altar.png"); 

    // HUD icons
    static icons = [
        _load_image_asset("assets/sac_altar_inactive.png"),
        _load_image_asset("assets/sac_altar_active.png"),
    ]

    constructor() {
        this.width = 768;
        this.height = 512;
        this.blood_stacks_max = 10;
        this.blood_stacks = 0;
        this.full = false;
        this.active = false;
        this.offers = [];
        this.icon = undefined;
    }

    enable() {
        // Called on player pressing button
        if (this.full && !this.active) {
            this.active = true;
            paused = true;
            this._generate_offers();
        }
    }

    disable() {
        // Called after player chose modifier
        world.player.recalc_stats();
        this.offers = [];
        this.active = false;
        this.full = false;
        this.blood_stacks = 0;
        this.blood_stacks_max += 10;
        paused = false;
    }

    _generate_offers() {    
        var _mod_ids = weighted_random(AltarModifier.mods_db, 2); // Pick 2 random but different mods
        for (let i = 0; i < 2; i++) {
            const _mod_id = _mod_ids[i];
            this.offers.push( new AltarModifier(_mod_id) );  
        } 
    }
}