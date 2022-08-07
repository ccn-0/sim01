
function _apply_modifier(mod) {
    var dispatch = {
        "defense1" : () => {world.player.defense += 1},
        "block1" : () => {world.player.block = world.player.block >= 0.75 ? 0.75 : world.player.block + 0.1},
        "life1" : () => {world.player.max_hp += 5},
        "damage1" : () => {world.player.damage_min += 5; world.player.damage_max += 10},
        "damage_percent1" : () => {world.player.damage_percent += 0.2},
        "movement1" : () => {world.player.movement_speed += 1},
        "projectile_speed1" : () => {world.player.projectile_speed += 1},
        "leech1" : () => {world.player.leech += 1},
        "critical1" : () => {world.player.crit_chance = world.player.crit_chance >= 1.0 ? 1.0 : world.player.crit_chance + 0.2},
        "pierce1" : () => {},
        "multiproj1" : () => {world.player.projectile_count += 1},
        "chain1" : () => {},
    }

    dispatch[mod]();
}

function _generate_offers() {
    // Table with player modifiers and their weights.
    var modifiers = [
        [100, "defense1"],
        [100, "block1"],
        [100, "life1"],
        [100, "damage1"],
        [100, "damage_percent1"],
        [50, "movement1"],
        [50, "projectile_speed1"],
        //[50, "leech1"],
        [50, "critical1"],
        //[50, "pierce1"],
        [25, "multiproj1"],
        //[25, "chain1"]
    ];

    var offers = [];

    for (var i = 0; i < 3; i++) {
        // Pick weighted random
        random_mod = weighted_random(modifiers);
        offers.push(random_mod.item);
        // Remove for next round 
        modifiers.splice(random_mod.i, 1);
    }
    return offers
}

function weighted_random(modifiers) {
    var weights = [];
    var items = [];
    for (var i = 0; i < modifiers.length; i++) {
        items.push(modifiers[i][1]);
        weights.push(modifiers[i][0]);
    }
    var i;
    for (i = 0; i < weights.length; i++)
        weights[i] += weights[i - 1] || 0;
    var random = Math.random() * weights[weights.length - 1];
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    return {'item' : items[i], 'i' : i};
}

