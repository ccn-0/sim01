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

    run() {
        const __predicate_generator = (ev) => {
            return (entity) => {
                const dead = entity.hp <= 0;
                if (dead) this.notify(ev, [entity]);
                return !dead;
            };
        }
        world.phys_entities = world.phys_entities.filter(
            __predicate_generator(20)
        );
        world.sprites = world.sprites.filter(
            __predicate_generator(24)
        );
        world.projectiles = world.projectiles.filter(
            __predicate_generator(22)
        );
        world.monsters = world.monsters.filter(
            __predicate_generator(21)
        );
        world.texts = world.texts.filter(
            __predicate_generator(23)
        );
        world.entities = world.entities.filter(
            __predicate_generator(25)
        );
    }
}