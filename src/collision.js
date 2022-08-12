class Collisions {

    // Collision detection of physical entities

    constructor() {
        // TODO: use GameEvent enum
        this._observers = {
            0 : [],
            1 : [],
            2 : []
        }
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
        for (let i = 0; i < world.phys_entities.length; i++) {
            const entity_a = world.phys_entities[i];
            for (let j = i+1; j < world.phys_entities.length; j++) {
                const entity_b = world.phys_entities[j];
                if (is_stuck(entity_a.x, entity_a.y, entity_a.size, entity_b.x, entity_b.y, entity_b.size)) {
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
                }
            }
        }
    }
}