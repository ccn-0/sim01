class BloodItem extends DurationEntity {

    static models = [
        _load_image_asset("assets/blood_coin00.png"),
        _load_image_asset("assets/blood_coin01.png"),
        _load_image_asset("assets/blood_coin02.png"),
    ]

    constructor(x,y) {
        super(x,y,0,0,0,0,48,false,1800);
        this.color = "#FF0000";
        this.value = 1;
        this.model = BloodItem.models[0];
        this.animation_state = 0;
        this.animation_offsets = {
            121 : 1,
            124 : 2,
            127 : 0,
        };
        this.animation_states = {
            0 : BloodItem.models[0],
            1 : BloodItem.models[1],
            2 : BloodItem.models[2],
        };
    }

    update() {
        super.update();
        // Animation state
        const anim_offset = this.frame_alive % 128;
        const next_animation_state = this.animation_offsets[anim_offset];
        if (next_animation_state != undefined) {
            this.animation_state = next_animation_state;
        }
        else {
            this.model = this.animation_states[this.animation_state];
        }
    }
}

class ItemPickupObserver {

    // Player touches item on the ground

    constructor(world) {
        // Observe item-player collisions
        world.collisions.add_observer(3, this);
    }

    onNotify(ev, entities) {
        // Handle events
        switch (ev) {
            case 3: // EVENT_BLOODITEM_PICKUP
                this.__handle_blood_pickup(entities[1]);
                break;
            default:
                break;
        }
    }

    __handle_blood_pickup(blood_item) {
        world.altar.blood_stacks += blood_item.value;
        blood_item.hp = 0;
        if (world.altar.blood_stacks >= world.altar.blood_stacks_max) {
            world.altar.blood_stacks = world.altar.blood_stacks_max;
            world.altar.full = true;
        }
        new DynamicTextEntity(blood_item.x, blood_item.y, 0, -1, 0, 0, 40, 90, 0.98, "#FF0000", `+${blood_item.value} blood coin`);
    }
}