
class HitObserver {

    constructor(world) {
        // Observe events that result in hit damage
        world.collisions.add_observer(0, this);
        world.collisions.add_observer(1, this);
        world.collisions.add_observer(2, this);
    }

    onNotify(ev, entities) {
        // Handle events
        switch (ev) {
            case 0: // EVENT_COLLISION_PROJECTILE_MONSTER
                this.__projectile_monster_hit(entities[0], entities[1]);
                break;
            case 1: // EVENT_COLLISION_MONSTER_MONSTER
                // TODO: when monsters hitting eachother is implemented
                break;
            case 2: // EVENT_COLLISION_PLAYER_MONSTER
                this.__player_monster_hit(entities[0], entities[1]);
                break;
            default:
                break;
        }
    }

    __projectile_monster_hit(projectile, monster) {
        if (monster.hp <= 0) {
            return; // Something already killed the monster, don't interact
        }
        if (projectile.entities_excluded.includes(monster.eid)) {
            return; // Projectile already hit this monster during its lifetime
        }
        if (projectile.is_inactive) {
            return; // Projectile already applied damage this tick
        }
        projectile.entities_excluded.push(monster.eid);
        const result_damage = projectile.damage * (projectile.is_crit ? 2.0 : 1.0);
        monster.take_damage(result_damage);
        projectile.monster_hit();
        if (monster.hp <= 0) {
            const result_xp = monster.xp * projectile.player.xp_multiplier;
            projectile.player.xp += result_xp;
            new DynamicTextEntity(monster.x-30, monster.y, 0, -2, 0, 0, 60, 60, 0.98, "#CCCC00", result_xp + " xp");
        } 
    }

    __player_monster_hit(player, monster) {
        if (player.dash_isactive) {
            // Player has no monster collision during dash
            return;
        }
        var is_blocked = Math.random() < player.block_effective ? 1 : 0;
        var result_damage = Math.floor((monster.damage / (player.defense+1)) * (1-is_blocked));
        player.hp -= result_damage;
        monster.hp = 0;
        var message = result_damage + (is_blocked ? "(blocked)" : "");
        new DynamicTextEntity(player.x, player.y, 0, -2, 0, 0, 100, 60, 0.96, "#FF0000", message);

    }
}

class MonsterDespawnObserver {

    constructor(world) {
        // Observe monster despawns
        world.despawn.add_observer(21, this);
    }

    onNotify(ev, entities) {
        // Handle events
        switch (ev) {
            case 21: // EVENT_COLLISION_PROJECTILE_MONSTER
                this.__monster_despawned(entities[0]);
                break;
            default:
                break;
        }
    }

    __monster_despawned(monster) {
        new DynamicSpriteEntity(monster.x, monster.y, 0, 0, 0, 0, 
            monster.size * 4, 15, 0.85, "#CC0000", assets.other.bloodsplosion);
    }
}