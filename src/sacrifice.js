class SacrificeAltar extends Entity {

    static overlay = _load_image_asset("assets/altar.png"); 

    // HUD icons
    static icons = [
        _load_image_asset("assets/sac_altar_inactive.png"),
        _load_image_asset("assets/sac_altar_active.png"),
    ]

    constructor() {
        this.blood_stacks_max = 10;
        this.blood_stacks = 0;
        this.full = false;
        this.active = false;
        this.offers = [];
        this.icon = undefined;
        world.collisions.add_observer(3, this);
    }

    onNotify(ev, entities) {
        // Handle events
        switch (ev) {
            case 3: // EVENT_BLOOD_PICKUP
                this._handle_blood_pickup(entities[1]);
                break;
            default:
                break;
        }
    }

    enable() {
        // Called on player pressing button
        if (this.full) {
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

    _handle_blood_pickup(blood_item) {
        this.blood_stacks += blood_item.value;
        blood_item.hp = 0;
        if (this.blood_stacks >= this.blood_stacks_max) {
            this.blood_stacks = this.blood_stacks_max;
            this.full = true; // Altar is ready to be used whenever player wants
        }
    }

    // _generate_offers() {    
    //     var _mod_ids = weighted_random(StatModifier.mods_db, 3); // Pick 3 random but different mods
    //     for (let i = 0; i < 3; i++) {
    //         const _mod_id = _mod_ids[i];
    //         var _tier_id = weighted_random(StatModifier.mods_db[_mod_id].tiers, 1);
    //         this.offers.push( new StatModifier(_mod_id, _tier_id) );  
    //     } 
    // }
}