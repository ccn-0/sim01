function _apply_modifier(mod) {
    var dispatch = {
        "defense1" : () => {world.player.defense += 0.25},
        "block1" : () => {world.player.block = world.player.block >= 0.75 ? 0.75 : world.player.block + 0.1},
        "life1" : () => {world.player.max_hp += 5},
        "damage1" : () => {world.player.damage_min += 5; world.player.damage_max += 10},
        "damage_percent1" : () => {world.player.damage_percent += 0.2},
        "attack_speed1" : () => {world.player.attack_speed = Math.floor(world.player.attack_speed * 0.9)},
        "movement1" : () => {world.player.movement_speed += 1},
        "projectile_speed1" : () => {world.player.projectile_speed += 1},
        "projectile_spread1" : () => {world.player.projectile_spread *= 0.66666},
        "dash_speed1" : () => {world.player.dash_speed = Math.floor(world.player.dash_speed * 0.9)},
        "critical1" : () => {world.player.critical_chance = world.player.critical_chance >= 1.0 ? 1.0 : world.player.critical_chance + 0.1},
        "projectile_pierce1" : () => {world.player.projectile_pierce += 1},
        "projectile_chain1" : () => {world.player.projectile_chain += 1},
        "multiproj1" : () => {world.player.projectile_count += 1; world.player.projectile_spread *= 2.0},
        "xp_multiplier1" : () => {world.player.xp_multiplier += 0.05},
    }

    dispatch[mod]();
}

class Modifier extends Entity {
    // Modifier is an entity that is collected from the merchant by the player. 
    // Each instance is always owned by the player.

    constructor(owner) {
        super();
        this.owner = owner;
    }
}

class StatModifier extends Modifier { 
    // Changes player stats when collected, other than that does nothing

    static mod_dict = [
        {
            "name" : "BaseMaxHP",
            "description" : "+$ to maximum HP",
            "min_value" : 20,
            "max_value" : 30,
            "weight" : 1000,
            "tier_weights" : [600, 300, 100],
            "tier_multipliers" : [1.0, 1.5, 2.0],
        },
        {
            "name" : "BaseDamage",
            "description" : "+$ to damage",
            "min_value" : 15,
            "max_value" : 25,
            "weight" : 1000,
            "tier_weights" : [600, 300, 100],
            "tier_multipliers" : [1.0, 1.5, 2.0],
        },
        {
            "name" : "BaseDamageMultiplier",
            "description" : "+$% extra damage",
            "min_value" : 20,
            "max_value" : 30,
            "weight" : 1000,
            "tier_weights" : [800, 150, 50],
            "tier_multipliers" : [1.0, 1.5, 2.0],
        },
        {
            "name" : "BaseProjectileChain",
            "description" : "+$ to chain",
            "min_value" : 1,
            "max_value" : 1,
            "weight" : 1000,
            "tier_weights" : [970, 30],
            "tier_multipliers" : [1.0, 2.0],
        }
    ]

    constructor(owner) {
        super(owner);
        this.randomize();
    }

    randomize() {
        // Changes itself to random modifier type and value

        weighted_random()

        this.mod_id = mod_id;
        this.value = value;
        this.multiplier = multiplier;
    }

    to_string() {

    }
}