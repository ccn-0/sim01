// function _apply_modifier(mod) {
//     var dispatch = {
//         "defense1" : () => {world.player.defense += 0.25},
//         "block1" : () => {world.player.block = world.player.block >= 0.75 ? 0.75 : world.player.block + 0.1},
//         "life1" : () => {world.player.max_hp += 5},
//         "damage1" : () => {world.player.damage_min += 5; world.player.damage_max += 10},
//         "damage_percent1" : () => {world.player.damage_percent += 0.2},
//         "attack_speed1" : () => {world.player.attack_speed = Math.floor(world.player.attack_speed * 0.9)},
//         "movement1" : () => {world.player.movement_speed += 1},
//         "projectile_speed1" : () => {world.player.projectile_speed += 1},
//         "projectile_spread1" : () => {world.player.projectile_spread *= 0.66666},
//         "dash_speed1" : () => {world.player.dash_speed = Math.floor(world.player.dash_speed * 0.9)},
//         "critical1" : () => {world.player.critical_chance = world.player.critical_chance >= 1.0 ? 1.0 : world.player.critical_chance + 0.1},
//         "projectile_pierce1" : () => {world.player.projectile_pierce += 1},
//         "projectile_chain1" : () => {world.player.projectile_chain += 1},
//         "multiproj1" : () => {world.player.projectile_count += 1; world.player.projectile_spread *= 2.0},
//         "xp_multiplier1" : () => {world.player.xp_multiplier += 0.05},
//     }

//     dispatch[mod]();
// }

class Modifier extends Entity {
    // Modifier is an entity that is collected from the merchant by the player. 
    // Each instance is always owned by the player.

    constructor() {
        super();
    }
}

class StatModifier extends Modifier { 
    // Changes player stats when collected, other than that does nothing

    static tier_desc = {
        0: {"desc" : "Basic tier", "color" : "#DDDDDD"},
        1: {"desc" : "Epic tier", "color" : "#4589FF"},
        2: {"desc" : "\"Holy shit\" tier", "color" : "#4722BF"},
    }

    static mods_db = [
        {
            "weight" : 1000,
            "name" : "BaseMaxHP",
            "min_value" : 20,
            "max_value" : 30,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0}, 
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100, "multiplier" : 2.0},           
            ],
            "callback" : (owner, mod) => {owner.max_hp += Math.floor(mod.get_final_value())},
            "get_description_callback" : (mod) => {return `+${Math.floor(mod.get_final_value())} to maximum HP`}
        },
        {
            "weight" : 1000,
            "name" : "BaseDefense",
            "min_value" : 0.2,
            "max_value" : 0.3,
            "tiers" : [
                {"weight" : 1000, "multiplier" : 1.0},
            ],
            "callback" : (owner, mod) => {owner.defense += 1.0 * mod.get_final_value().toFixed(2)},
            "get_description_callback" : (mod) => {return `+${Math.floor(mod.get_final_value().toFixed(2) * 100)} to defense`}
        },
        {
            "weight" : 1000,
            "name" : "BaseBlock",
            "min_value" : 0.05,
            "max_value" : 0.08,
            "tiers" : [
                {"weight" : 800, "multiplier" : 1.0},
                {"weight" : 200, "multiplier" : 1.5},
            ],
            "callback" : (owner, mod) => {owner.block_real += 1.0 * mod.get_final_value().toFixed(2)},
            "get_description_callback" : (mod) => {return `+${Math.floor(mod.get_final_value().toFixed(2) * 100)}% to block chance`}
        },
        {
            "name" : "BaseDamage",
            "min_value" : 15,
            "max_value" : 25,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},           
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100, "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {
                owner.damage_min += Math.floor(mod.get_final_value()),
                owner.damage_max += Math.floor(mod.get_final_value())},
            "get_description_callback" : (mod) => {return `+${Math.floor(mod.get_final_value())} to base damage`}
        },
        {
            "name" : "BaseDamageMultiplier",
            "min_value" : 0.1,
            "max_value" : 0.2,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100,  "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {owner.damage_multiplier += 1.0 * mod.get_final_value().toFixed(2)},
            "get_description_callback" : (mod) => {return `+${Math.floor(mod.get_final_value().toFixed(2) * 100)}% to damage multiplier`}
        },
        {
            "name" : "BaseAttackCooldownDuration",
            "min_value" : 0.15,
            "max_value" : 0.25,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100,  "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {
                owner.attack_cooldown_duration = Math.floor(owner.attack_cooldown_duration * (1 - 1.0 * mod.get_final_value().toFixed(2)))
            },
            "get_description_callback" : (mod) => {return `-${Math.floor(mod.get_final_value().toFixed(2) * 100)}% less attack cooldown`}
        },
        {
            "name" : "BaseProjectileChain",
            "min_value" : 1,
            "max_value" : 1,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 700, "multiplier" : 1.0},          
                {"weight" : 300,  "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {owner.projectile_chain += Math.floor(mod.get_final_value())},
            "get_description_callback" : (mod) => {return `+${Math.floor(mod.get_final_value())} to chain`}
        }
    ]

    constructor() {
        super();
        this.randomize();
    }

    randomize() {
        // Changes itself to random modifier type, tier of that type and base value
        this.mod_id = weighted_random(StatModifier.mods_db, 1)[0];
        this.mod_ref = StatModifier.mods_db[this.mod_id];
        this.randomize_value_base();
        this.randomize_tier();
        this.desc = this.mod_ref.get_description_callback(this);
    }

    randomize_tier() {
        this.tier_id = weighted_random(this.mod_ref.tiers, 1)[0];   
        this.tier_ref = this.mod_ref.tiers[this.tier_id];
    }

    randomize_value_base () {
        this.value_base = random_in_range(this.mod_ref.min_value, this.mod_ref.max_value);
    }

    get_final_value() {
        // After multipliers
        return this.value_base * this.tier_ref.multiplier;
    }

    value_to_string() {
        
    }

    to_string() {
        return `Modifier ${this.mod_ref.name} | Tier: ${this.tier_id + 1} | Base range: ${this.mod_ref.min_value} to ${this.mod_ref.max_value} | Multiplier: ${this.tier_ref.multiplier} )`;
    }
}