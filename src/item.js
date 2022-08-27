class BloodItem extends DurationEntity {

    constructor(x,y) {
        super(x,y,0,0,0,0,16,false,600);
        this.color = "#FF0000";
        this.value = 3;
    }

    update() {
        super.update();
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
            world.altar.full = true; // Altar is ready to be used whenever player wants
        }
    }
}