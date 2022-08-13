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
        this.offers.push( new StatModifier() );
        this.offers.push( new StatModifier() );
        this.offers.push( new StatModifier() );
    }

}