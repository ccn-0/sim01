class Collisions {

    // Collision detection of physical entities

    constructor() {
        // TODO: use GameEvent enum
        this._observers = {
            0 : [],
            1 : [],
            2 : [],
            3 : [],
        }

        this.distance_matrix = [];

    }

    add_observer(ev, observer) {
        this._observers[ev].push(observer);
    }

    remove_observer(ev, observer) {
        const i = this._observers[ev].indexOf(observer);
        this._observers[ev].splice(i, 1);
    }

    notify(ev, entities) {
        this._observers[ev].forEach(observer => {
            observer.onNotify(ev, entities);
        });
    }

    run() {
        this.distance_matrix = [];
        for (let i = 0; i < world.phys_entities.length; i++) {
            const entity_a = world.phys_entities[i];
            let __dm_row = Array(world.phys_entities.length);
            for (let j = i+1; j < world.phys_entities.length; j++) {
                const entity_b = world.phys_entities[j];
                const dist = Math.hypot(entity_b.x - entity_a.x, entity_b.y - entity_a.y);
                __dm_row[j] = dist;
                if (dist < (entity_a.size + entity_b.size) * 0.5) {
                    // ProjectileEntity hit MonsterEntity         
                    if ((entity_a instanceof ProjectileEntity) && (entity_b instanceof MonsterEntity)) {
                        this.notify(0, [entity_a, entity_b]);
                    }
                    else if ((entity_a instanceof MonsterEntity) && (entity_b instanceof ProjectileEntity)) {
                        this.notify(0, [entity_b, entity_a]);
                    }
                    else if (entity_a instanceof MonsterEntity && entity_b instanceof MonsterEntity) {
                        // MonsterEntity hit MonsterEntity (due knockback)
                        this.notify(1, [entity_a, entity_b]);
                    }
                    else if (entity_a instanceof PlayerEntity && entity_b instanceof MonsterEntity) {
                        // PlayerEntity hit MonsterEntity (attacked)
                        this.notify(2, [entity_a, entity_b]);
                    }
                    else if (entity_a instanceof MonsterEntity && entity_b instanceof PlayerEntity) {
                        this.notify(2, [entity_b, entity_a]);
                    }
                    else if (entity_a instanceof BloodItem && entity_b instanceof PlayerEntity) {
                        // PlayerEntity hit BloodItem (pickup)
                        this.notify(3, [entity_b, entity_a]);
                    }
                    else if (entity_a instanceof PlayerEntity && entity_b instanceof BloodItem) {
                        // PlayerEntity hit BloodItem (pickup)
                        this.notify(3, [entity_a, entity_b]);
                  }
                }
            }
            this.distance_matrix.push(__dm_row);
        }
    }
}