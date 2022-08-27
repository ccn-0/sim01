
class StatModifier { 
    // Changes player stats

    static tier_desc = {
        0: {"desc" : "Basic tier", "color" : "#DDDDDD"},
        1: {"desc" : "Epic tier", "color" : "#70A0FF"},
        2: {"desc" : "Giga tier", "color" : "#5030C0"},
        3: {"desc" : "Insane tier", "color" : "#FFA500"},
    }

    static mods_db = [
        {
            "weight" : 1000,
            "name" : "BaseMaxHP",
            "min_value" : 20,
            "max_value" : 25,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0}, 
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100, "multiplier" : 2.0},           
            ],
            "callback" : (owner, mod) => {owner.max_hp += Math.floor(mod.get_final_value())},
            "get_description_callback" : [
                (mod) => {return `+${Math.floor(mod.get_final_value())} to maximum HP`}
            ]
        },
        {
            "name" : "BaseHPregen",
            "min_value" : 0.0025,
            "max_value" : 0.00333333333,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 800, "multiplier" : 1.0},
                {"weight" : 100, "multiplier" : 2.0},
                {"weight" : 80, "multiplier" : 3.0},
                {"weight" : 20, "multiplier" : 4.0},
            ],
            "callback" : (owner, mod) => {
                owner.hp_regen += mod.get_final_value();
            },
            "get_description_callback" : [
                (mod) => {return `Regenerate +${(mod.get_final_value()*60).toFixed(2)} HP per second`}
            ]
        },
        {
            "name" : "BaseHPregenPercent",
            "min_value" : 0.00004,
            "max_value" : 0.00005,
            "weight" : 500,
            "tiers" : [
                {"weight" : 0, "multiplier" : 1.0},
                {"weight" : 0, "multiplier" : 1.0},
                {"weight" : 900, "multiplier" : 1.0},
                {"weight" : 100, "multiplier" : 1.5},
            ],
            "callback" : (owner, mod) => {
                owner.hp_regen_percent += mod.get_final_value();
            },
            "get_description_callback" : [
                (mod) => {return `Regenerate +${(mod.get_final_value()*60*100).toFixed(2)}% of max HP per second`}
            ]
        },
        {
            "weight" : 1000,
            "name" : "BaseDefense",
            "min_value" : 0.12,
            "max_value" : 0.16,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100, "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {owner.defense += 1.0 * mod.get_final_value().toFixed(2)},
            "get_description_callback" : [
                (mod) => {return `${Math.floor(mod.get_final_value().toFixed(2) * 100)}% increased defense`}
            ]
        },
        {
            "weight" : 1000,
            "name" : "BaseBlock",
            "min_value" : 0.05,
            "max_value" : 0.07,
            "tiers" : [
                {"weight" : 800, "multiplier" : 1.0},
                {"weight" : 200, "multiplier" : 1.5},
            ],
            "callback" : (owner, mod) => {owner.block_real += 1.0 * mod.get_final_value().toFixed(2)},
            "get_description_callback" : [
                (mod) => {return `+${Math.floor(mod.get_final_value().toFixed(2) * 100)}% to block chance`},
                (mod) => {return `Maximum block chance is 90%`}
            ]
        },
        {
            "name" : "BaseDamage",
            "min_value" : 15,
            "max_value" : 20,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},           
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100, "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {
                owner.damage_min += Math.floor(mod.get_final_value()),
                owner.damage_max += Math.floor(mod.get_final_value())},
            "get_description_callback" : [
                (mod) => {return `+${Math.floor(mod.get_final_value())} to base damage`}
            ]
        },
        {
            "name" : "BaseDamageMultiplier",
            "min_value" : 0.3,
            "max_value" : 0.35,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100,  "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {owner.damage_multiplier += 1.0 * mod.get_final_value().toFixed(2)},
            "get_description_callback" : [
                (mod) => {return `+${Math.floor(mod.get_final_value().toFixed(2) * 100)}% to damage multiplier`}
            ]
        },
        {
            "name" : "BaseAttackCooldownDuration",
            "min_value" : 0.10,
            "max_value" : 0.10,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.3},
                {"weight" : 100,  "multiplier" : 1.6},
            ],
            "callback" : (owner, mod) => {
                owner.attack_cooldown_duration = Math.floor(owner.attack_cooldown_duration * (1 - 1.0 * mod.get_final_value().toFixed(2)))
            },
            "get_description_callback" : [
                (mod) => {return `${Math.floor(mod.get_final_value().toFixed(2) * 100)}% less attack cooldown`}
            ]
        },
        {
            "name" : "BaseProjectileChain",
            "min_value" : 1,
            "max_value" : 1,
            "weight" : 500,
            "tiers" : [
                {"weight" : 0, "multiplier" : 1.0},  
                {"weight" : 0, "multiplier" : 1.0},           
                {"weight" : 1000,  "multiplier" : 1.0},
            ],
            "callback" : (owner, mod) => {
                owner.projectile_chain += Math.floor(mod.get_final_value());
                owner.damage_multiplier -= 0.1;
            },
            "get_description_callback" : [
                (mod) => {return `+${Math.floor(mod.get_final_value())} to chain`},
                (mod) => {return `-10% to damage multiplier`}
            ]
        },
        {
            "name" : "BaseMultipleProjectiles",
            "min_value" : 1,
            "max_value" : 1,
            "weight" : 500,
            "tiers" : [
                {"weight" : 0, "multiplier" : 1.0},  
                {"weight" : 0, "multiplier" : 1.0},           
                {"weight" : 1000,  "multiplier" : 1.0},
            ],
            "callback" : (owner, mod) => {
                owner.projectile_count += Math.floor(mod.get_final_value());
                owner.projectile_spread *= 1.2;
            },
            "get_description_callback" : [
                (mod) => {return `+${Math.floor(mod.get_final_value())} to number of projectiles`},
                (mod) => {return `20% more projectile spread`}
            ]
        },
        {
            "name" : "BaseProjectileSpeed",
            "min_value" : 0.2,
            "max_value" : 0.25,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100, "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {
                owner.projectile_speed = 
                    Math.floor(owner.projectile_speed * (1.0 + 1.0 * mod.get_final_value().toFixed(2)))},
            "get_description_callback" : [
                (mod) => {return `${Math.floor(mod.get_final_value().toFixed(2) * 100)}% more projectile speed`}
            ]
        },
        {
            "name" : "BaseProjectileSpreadReduction",
            "min_value" : 0.12,
            "max_value" : 0.15,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100, "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {
                owner.projectile_spread = 
                    owner.projectile_spread * (1 - mod.get_final_value())
            },
            "get_description_callback" : [
                (mod) => {return `${Math.floor(mod.get_final_value().toFixed(2) * 100)}% less projectile spread`}
            ]
        },
        {
            "name" : "BaseProjectilePierce",
            "min_value" : 1,
            "max_value" : 1,
            "weight" : 500,
            "tiers" : [
                {"weight" : 0, "multiplier" : 1.0},
                {"weight" : 0, "multiplier" : 1.0},         
                {"weight" : 1000,  "multiplier" : 1.0},
            ],
            "callback" : (owner, mod) => {
                owner.projectile_pierce += Math.floor(mod.get_final_value());
                owner.projectile_speed *= 0.75;
            },
            "get_description_callback" : [
                (mod) => {return `+${Math.floor(mod.get_final_value())} to pierce`},
                (mod) => {return `25% less projectile speed`},
            ]
        },
        {
            "name" : "BaseDashCooldownDuration",
            "min_value" : 0.10,
            "max_value" : 0.10,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.3},
                {"weight" : 100,  "multiplier" : 1.6},
            ],
            "callback" : (owner, mod) => {
                owner.dash_cooldown_duration = Math.floor(owner.dash_cooldown_duration * (1 - 1.0 * mod.get_final_value().toFixed(2)))
            },
            "get_description_callback" : [
                (mod) => {return `${Math.floor(mod.get_final_value().toFixed(2) * 100)}% less dash cooldown`}
            ]
        },
        {
            "name" : "BaseDashSpeed",
            "min_value" : 0.20,
            "max_value" : 0.20,
            "weight" : 1000,
            "tiers" : [
                {"weight" : 600, "multiplier" : 1.0},
                {"weight" : 300, "multiplier" : 1.5},
                {"weight" : 100,  "multiplier" : 2.0},
            ],
            "callback" : (owner, mod) => {
                owner.dash_speed = owner.dash_speed * (1.0 + mod.get_final_value());
            },
            "get_description_callback" : [
                (mod) => {return `${Math.floor(mod.get_final_value().toFixed(2) * 100)}% more dash speed`}
            ]
        },
        {
            "name" : "BaseMovementSpeedMultiplier",
            "min_value" : 0.06,
            "max_value" : 0.09,
            "weight" : 500,
            "tiers" : [
                {"weight" : 0, "multiplier" : 1.0},
                {"weight" : 0, "multiplier" : 1.0},
                {"weight" : 900, "multiplier" : 1.0},
                {"weight" : 100,  "multiplier" : 1.5},
            ],
            "callback" : (owner, mod) => {
                owner.speed_multiplier += 1.0 * mod.get_final_value().toFixed(2);
            },
            "get_description_callback" : [
                (mod) => {return `+${Math.floor(mod.get_final_value().toFixed(2) * 100)}% to base movement speed`}
            ]
        },

    ]

    // constructor() {
    //     this.randomize();
    // }

    // Nonrandom constructor
    constructor(mod_id, tier_id) {
        this.mod_id = mod_id;
        this.mod_ref = StatModifier.mods_db[this.mod_id];
        this.randomize_value_base();
        this.tier_id = tier_id;   
        this.tier_ref = this.mod_ref.tiers[this.tier_id];
        this.__desc_update();
    }

    __desc_update() {
        this.desc = []
        for (let i = 0; i < this.mod_ref.get_description_callback.length; i++) {
            const desc_callback = this.mod_ref.get_description_callback[i];
            this.desc.push(desc_callback(this));
        }
    }

    randomize() {
        // Changes itself to random modifier type, tier of that type and base value
        this.mod_id = weighted_random(StatModifier.mods_db, 1)[0];
        this.mod_ref = StatModifier.mods_db[this.mod_id];
        this.randomize_value_base();
        this.randomize_tier();
        this.__desc_update();
    }

    randomize_tier() {
        // Randomize only tier within that mod type
        this.tier_id = weighted_random(this.mod_ref.tiers, 1)[0];   
        this.tier_ref = this.mod_ref.tiers[this.tier_id];
    }

    randomize_value_base () {
        // Randomize only base value
        this.value_base = random_in_range(this.mod_ref.min_value, this.mod_ref.max_value);
    }

    get_final_value() {
        // After multipliers
        return this.value_base * this.tier_ref.multiplier;
    }

    to_string() {
        return `Modifier ${this.mod_ref.name} | Tier: ${this.tier_id + 1} | Base range: ${this.mod_ref.min_value} to ${this.mod_ref.max_value} | Multiplier: ${this.tier_ref.multiplier} )`;
    }
}

class AltarModifier {
    
    // Build defining powerful modifiers

    static mods_db = [
        {
            "weight" : 1000,
            "name" : "Might",
            "callback" : (owner, mod) => {
                owner.damage_min = PlayerEntity.base_damage_min;
                owner.damage_max = PlayerEntity.base_damage_max;
                owner.damage_min += 0.5*owner.max_hp;
                owner.damage_max += 0.5*owner.max_hp;
            },
            "get_description_callback" : [
                (mod) => {return `Gain base damage equal to 50% of max HP`},
                (mod) => {return `No other base damage modifiers apply`}
            ]
        },
        {
            "weight" : 1000,
            "name" : "Splinter",
            "callback" : (owner, mod) => {
                owner.projectile_count += owner.projectile_count;
                owner.projectile_pierce = 0;
            },
            "get_description_callback" : [
                (mod) => {return `Projectile count is doubled`},
                (mod) => {return `Cannot pierce`}
            ]
        },
        {
            "weight" : 1000,
            "name" : "Swiftness",
            "callback" : (owner, mod) => {
                owner.dash_cooldown_duration = 60;
                owner.defense *= 0.25;
            },
            "get_description_callback" : [
                (mod) => {return `Dash cooldown is 1 second`},
                (mod) => {return `75% less defense`}
            ]
        },
        {
            "weight" : 1000,
            "name" : "Teleport",
            "callback" : (owner, mod) => {
                owner.dash_active_duration = 1;
                owner.dash_speed *= 16;
                owner.block_real *= 0.5;
            },
            "get_description_callback" : [
                (mod) => {return `Dash is replaced by teleport skill`},
                (mod) => {return `50% less block chance`}
            ]
        },
        {
            "weight" : 1000,
            "name" : "Serpent",
            "callback" : (owner, mod) => {
                owner.projectile_chain *= 3;
                owner.damage_multiplier *= 0.5;
            },
            "get_description_callback" : [
                (mod) => {return `200% more chains`},
                (mod) => {return `50% less projectile damage`}
            ]
        },
        {
            "weight" : 1000,
            "name" : "Impale",
            "callback" : (owner, mod) => {
                owner.projectile_pierce_special = 1.5;
                owner.projectile_chain = 0;
                owner.damage_multiplier *= 0.7;
            },
            "get_description_callback" : [
                (mod) => {return `50% more damage for each remaining pierce`},
                (mod) => {return `Cannot chain`},
                (mod) => {return `30% less projectile damage`},
            ]
        },
        {
            "weight" : 1000,
            "name" : "Ranger",
            "callback" : (owner, mod) => {
                owner.projectile_speed = 2.0 * PlayerEntity.base_projectile_speed;
            },
            "get_description_callback" : [
                (mod) => {return `You always have 200% of base projectile speed`},
            ]
        },
        {
            "weight" : 1000,
            "name" : "Golem",
            "callback" : (owner, mod) => {
                owner.defense += 1.0;
                owner.speed = 0.9 * PlayerEntity.base_speed;
            },
            "get_description_callback" : [
                (mod) => {return `100% increased defense`},
                (mod) => {return `You always have 90% of base movement speed`},
            ]
        },
    ]

    constructor(mod_id) {
        this.mod_id = mod_id;
        this.mod_ref = AltarModifier.mods_db[this.mod_id];
        this.__desc_update();
    }

    __desc_update() {
        this.desc = [];
        for (let i = 0; i < this.mod_ref.get_description_callback.length; i++) {
            const desc_callback = this.mod_ref.get_description_callback[i];
            this.desc.push(desc_callback(this));
        }
    }
}