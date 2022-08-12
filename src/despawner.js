class Despawner {

    // Entity despawn manager

    constructor() {
        this.entities_to_despawn = [];
        this._observers = {
            20 : [], // EVENT_DESPAWN_PHYSICAL
            21 : [], // EVENT_DESPAWN_MONSTER
            22 : [], // EVENT_DESPAWN_PROJECTILE
            23 : [], // EVENT_DESPAWN_DYNAMICTEXT
            24 : [], // EVENT_DESPAWN_DYNAMICSPRITE
            25 : [], // EVENT_DESPAWN_ANY
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

    __run() {
        while (this.entities_to_despawn.length > 0) {
            const entity = this.entities_to_despawn.shift();
            this.notify(25, [entity]);
            world.entities.fast_delete(entity);

        }
    } 

    run() {
        const is_dead = (entity) => {
            const dead = entity.hp <= 0;
            if (dead) {
                this.notify(25, [entity]);
                if (entity instanceof PhysicalEntity) {
                    this.notify(20, [entity]);
                }
                if (entity instanceof MonsterEntity) {
                    this.notify(21, [entity]);
                }
                if (entity instanceof ProjectileEntity) {
                    this.notify(22, [entity]);
                }
                if (entity instanceof DynamicTextEntity) {
                    this.notify(23, [entity]);
                }
                if (entity instanceof DynamicSpriteEntity) {
                    this.notify(24, [entity]);
                }     
            }
            return !dead;
        }
        world.phys_entities = world.phys_entities.filter(is_dead);
        world.sprites = world.sprites.filter(is_dead);
        world.projectiles = world.projectiles.filter(is_dead);
        world.monsters = world.monsters.filter(is_dead);
        world.texts = world.texts.filter(is_dead);
        world.entities = world.entities.filter(is_dead);
    }
}