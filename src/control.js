function init_control() {
    return {
        "left" : false,
        "up" : false,
        "right" : false,
        "down" : false,
        "space" : false,
        "mouse_x" : 0,
        "mouse_y" : 0,
        "mouse1" : false,
        "escape" : false,
        "escapeToggle" : false,
    }
}

function _take_merchant_offer(offer_number) {
    var merchant = world.merchant;
    var selected_modifier = merchant.offers[offer_number];
    world.player.modifiers.push(selected_modifier);
    merchant.disable();
}

function _take_altar_offer(offer_number) {
    var altar = world.altar;
    var selected_modifier = altar.offers[offer_number];
    world.player.altar_modifiers.push(selected_modifier);
    altar.disable();
}

function prehandle_controls() {
    // Called every frame even when game is paused.
    // Merchant menu is active
    if (world.merchant.active) {
        if (keys.slot1) {
            world.merchant.offers[1].hp = 0;
            world.merchant.offers[2].hp = 0;
            _take_merchant_offer(0);
        }
        else if (keys.slot2) {
            world.merchant.offers[0].hp = 0;
            world.merchant.offers[2].hp = 0;
            _take_merchant_offer(1);
        }
        else if (keys.slot3) {
            world.merchant.offers[1].hp = 0;
            world.merchant.offers[0].hp = 0;
            _take_merchant_offer(2);
        }
    }
    else if (world.altar.active) {
        if (keys.slot1) {
            world.altar.offers[1].hp = 0;
            _take_altar_offer(0);
        }
        else if (keys.slot2) {
            world.merchant.offers[0].hp = 0;
            _take_altar_offer(1);
        }
    }
    else {
        paused = keys.escapeToggle;
    }
    
}

function add_listeners() {
    c.addEventListener('mousemove', function(evt) {
        var rect = c.getBoundingClientRect();
        keys.mouse_x = evt.clientX - rect.left;
        keys.mouse_y = evt.clientY - rect.top;
    });
    c.addEventListener('mousedown', function(evt) {
        if (evt.button == 0) {
            keys.mouse1 = true;
        }
    });
    c.addEventListener('mouseup', function(evt) {
        if (evt.button == 0) {
            keys.mouse1 = false;
        }
    });
    document.addEventListener('keydown', function(evt) {
        if (evt.defaultPrevented) {  
            return;
        }
        if (evt.code === "Escape") {
            console.log("esc")
            keys.escapeToggle = keys.escapeToggle ? false : true;
            keys.escape = true;
        } else if (evt.code === "KeyS") {
            keys.down = true;
        } else if (evt.code === "KeyW") {
            keys.up = true;
        } else if (evt.code === "KeyA") {
            keys.left = true;
        } else if (evt.code === "KeyD") {
            keys.right = true;
        } else if (evt.code === "Space") {
            keys.space = true;
        } else if (evt.code === "Digit1") {
            keys.slot1 = true;
        } else if (evt.code === "Digit2") {
            keys.slot2 = true;
        } else if (evt.code === "Digit3") {
            keys.slot3 = true;
        } 
    });
    document.addEventListener('keyup', function(evt) {
        if (evt.defaultPrevented) {
            return;
        }
        if (evt.code === "Escape") {
            keys.escape = false;
        } else if (evt.code === "KeyS"){
            keys.down = false;
        } else if (evt.code === "KeyW"){
            keys.up = false;
        } else if (evt.code === "KeyA"){
            keys.left = false;
        } else if (evt.code === "KeyD"){
            keys.right = false;
        } else if (evt.code === "Space") {
            keys.space = false;
        } else if (evt.code === "Digit1"){
            keys.slot1 = false;
        } else if (evt.code === "Digit2"){
            keys.slot2 = false;
        } else if (evt.code === "Digit3"){
            keys.slot3 = false;
        } 
    });
}