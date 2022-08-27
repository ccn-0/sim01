
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
        if (projectile.entities_excluded.length > 3) {
            // Monsters hit 3 hits ago can be hit again (shift queue)
            projectile.entities_excluded.shift();
        }
        const result_damage = 
            projectile.damage 
            * (projectile.is_crit ? 2.0 : 1.0)
            * (projectile.projectile_pierce_special ** projectile.projectile_pierce);
        monster.take_damage(result_damage);
        projectile.monster_hit();

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

    // Generic monster death logic, applies to all monsters.

    constructor(world) {
        // Observe monster despawns
        world.despawn.add_observer(21, this);
    }

    onNotify(ev, entities) {
        // Handle events
        switch (ev) {
            case 21: // EVENT_DESPAWNED
                this.__monster_despawned(entities[0]);
                break;
            default:
                break;
        }
    }

    __monster_despawned(monster) {
        // Drop monster inventory
        for (let index = 0; index < monster.inventory.length; index++) {
            const item = monster.inventory[index];
            // TODO: fix when more items exist
            new BloodItem(monster.x, monster.y);
        }

        if (monster.killed_by_player == true) {
            // Count XP
            const result_xp = monster.xp * world.player.xp_multiplier;
            world.player.xp += result_xp;
            // +XP text
            // new DynamicTextEntity(monster.x-30, monster.y, 0, -2, 0, 0, 60, 60, 0.98, "#CCCC00", result_xp + " xp");
        } 
        else {
            // Monster suicided
            new DynamicSpriteEntity(monster.x, monster.y, 0, 0, 0, 0, 
                monster.size * 4, 15, 0.85, "#CC0000", assets.other.bloodsplosion);
        }
    }
}

class MonsterKnockbackOndeathObserver extends MonsterDespawnObserver {

    // This class handles knockback effect on monster death.
    // Monster class must support knockbacking.

    constructor(world) {
        super(world);
    }

    onNotify(ev, entities) {
        // Handle events
        switch (ev) {
            case 21: // EVENT_DESPAWNED
                this.__monster_despawned(entities[0]);
                break;
            default:
                break;
        }
    }

    __monster_despawned(monster) {
        if (monster.killed_by_player == true) {
            // Monster died to player
        } 
        else {
            // Monster suicided
            if (monster instanceof NykMonsterEntity) {
                console.log("nyk died");
                var player = world.player;
                var vec = normalize_vector(player.x - monster.x, player.y - monster.y)
                player.knockback_active = true;
                player.knockback_timer = 8;
                player.knockback_vx = vec.x * NykMonsterEntity.knockback_speed;
                player.knockback_vy = vec.y * NykMonsterEntity.knockback_speed;
                player.vx += player.knockback_vx;
                player.vy += player.knockback_vy;
            }
        }
    }
}