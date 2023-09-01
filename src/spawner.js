class Spawner {

    // Entity spawn manager

    constructor() {
        this.entities_to_spawn = [];
        this._observers = {
            10 : [], // EVENT_SPAWN_PHYSICAL
            11 : [], // EVENT_SPAWN_MONSTER
            12 : [], // EVENT_SPAWN_PROJECTILE
            13 : [], // EVENT_SPAWN_DYNAMICTEXT
            14 : [], // EVENT_SPAWN_DYNAMICSPRITE
            15 : [], // EVENT_SPAWN_ANY
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
        while (this.entities_to_spawn.length > 0) {
            const entity = this.entities_to_spawn.shift();
            world.entities.push(entity);
            this.notify(15, [entity]);
            if (entity instanceof PhysicalEntity) {
                world.phys_entities.push(entity);
                this.notify(10, [entity]);
            }
            if (entity instanceof MonsterEntity) {
                world.monsters.push(entity);
                this.notify(11, [entity]);
            }
            if (entity instanceof ProjectileEntity || entity instanceof IceCascadeEntity ) {
                console.log("ProjectileEntity or IceCascadeEntity registered for events")
                world.projectiles.push(entity);
                this.notify(12, [entity]);
            }
            if (entity instanceof DynamicTextEntity) {
                world.texts.push(entity);
                this.notify(13, [entity]);
            }
            if (entity instanceof DynamicSpriteEntity) {
                world.sprites.push(entity);
                this.notify(14, [entity]);
            }
        }
    } 
}