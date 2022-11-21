class MonsterEntity extends PhysicalEntity {
    constructor(size, max_hp, damage, speed, xp) {
        super(0, 0, 0, 0, 0, 0, size, true);
        this.max_hp = max_hp;
        this.hp = max_hp;
        this.model = undefined;
        this.hit_recently = 0;
        this.killed_by_player = false; // True when death was caused by player effect
        this.animation_state = 0;
        this.damage = damage;
        this.speed = speed;
        this.xp = xp;
        this.model_hit = undefined; // TODO: replace with dev sprites
        this.inventory = []; // Monster item drops on death
        this.animation_offsets = {
            0 : 0
        };
        this.animation_states = {
            0 : undefined,
        };

        this._random_spawn();
    }

    update() {
        super.update();

        // Animation state
        const anim_offset = this.frame_alive % 64;
        const next_animation_state = this.animation_offsets[anim_offset];
        if (next_animation_state != undefined) {
            this.animation_state = next_animation_state;
        }
        if (this.hit_recently > 0) {
            // Hit animation model has priority     
            this.model = this.model_hit;
        }
        else {
            // Set normal model based on current animation state
            this.model = this.animation_states[this.animation_state];
        }

        this.hit_recently = this.hit_recently ? this.hit_recently - 1 : 0;

        if (this.hit_recently == 0) {
            // Monster not stunned
            this._move_towards_player();
        }
    }

    _move_towards_player() {
        var uvec = normalize_vector(
            this.x - world.player.x, 
            this.y - world.player.y
        )
        // Try move straight, then 45 degrees left and right,
        // then finally 90 degrees left and right. This is probably not very
        // efficient or smart, but looks good enough.
        var candidate_moves = [
            uvec,
            rotate_vector(uvec.x, uvec.y, Math.PI/4),
            rotate_vector(uvec.x, uvec.y, -Math.PI/4),
            rotate_vector(uvec.x, uvec.y, Math.PI/2),
            rotate_vector(uvec.x, uvec.y, -Math.PI/2),
        ];

        var mx = this.x;
        var my = this.y;
        
        // Try moves and accept the first position that doesnt collide
        for (var move = 0; move < candidate_moves.length; move++) {
            var move_vec = candidate_moves[move]
            var new_x = this.x - move_vec.x * this.speed;
            var new_y = this.y - move_vec.y * this.speed;
            var collision_flag = false;
            for (var j = 0; j < world.monsters.length; j++) {
                const other_monster = world.monsters[j];
                if (other_monster.eid == this.eid) continue;   
                if (is_stuck(new_x, new_y, this.size, other_monster.x, other_monster.y, other_monster.size)) {
                    collision_flag = true;
                    break;
                }
            }
            if (!collision_flag) {
                // No collision, accept new position
                mx = new_x;
                my = new_y;
                break;
            }
        }
        this.x = mx;
        this.y = my
    }

    take_damage(result_damage) {
        this.hp -= result_damage;
        this.hit_recently = 6;
        if (this.hp <= 0) {
            this.killed_by_player = true;
        }
        new DynamicTextEntity(this.x+30, this.y, 0, -2, 0, 0, 100, 60, 0.96, "#FFFFFF", result_damage);  
    }

    _random_spawn() {
        // This sets monster origin to random point around player
        const player = world.player;
        // 10 attempts to spawn without collision
        for (let i = 0; i < 10; i++) {
            var new_origin = normalize_vector(Math.random()-0.5, Math.random()-0.5);
            var collide = false;
            new_origin.x = new_origin.x * 1000 + player.x;
            new_origin.y = new_origin.y * 1000 + player.y;
            for (let j = 0; j < world.monsters.length; j++) {
                const monster = world.monsters[j];
                if (is_stuck(new_origin.x, new_origin.y, 100, monster.x, monster.y, monster.size)) {
                    collide = true;
                    break;
                }
            }
            if (!collide) {
                break;
            }
        }
        this.x = new_origin.x;
        this.y = new_origin.y;
    }
}

class HonzeekMonsterEntity extends MonsterEntity {

    static size = 60;
    static max_hp = 200;
    static damage = 15;
    static speed = 1.8;
    static xp = 400;
    static model_idle = _load_image_asset("https://cdn.discordapp.com/emojis/857700195689300008.webp");
    static model_hit = _load_image_asset("https://cdn.discordapp.com/attachments/749608248184799345/1004827766283309126/honzeek_hit.webp");

    constructor(extra_max_hp, extra_damage, extra_speed) {
        super(
            HonzeekMonsterEntity.size, 
            HonzeekMonsterEntity.max_hp + extra_max_hp, 
            HonzeekMonsterEntity.damage + extra_damage, 
            HonzeekMonsterEntity.speed + extra_speed, 
            HonzeekMonsterEntity.xp
        );
        this.model = HonzeekMonsterEntity.model_idle;
        this.model_hit = HonzeekMonsterEntity.model_hit;
        this.animation_offsets = {
            0 : 0
        };
        this.animation_states = {
            0 : HonzeekMonsterEntity.model_idle,
        };
        this.__create_drops();
    }

    __create_drops() {
        if (Math.random() < 0.2) {
            this.inventory.push(0);
        }
    }
}

class CorgiMonsterEntity extends MonsterEntity {

    static size = 100;
    static max_hp = 200;
    static damage = 15;
    static speed = 1.8;
    static xp = 400;
    static model_idle = _load_image_asset("assets/corgimonster.webp");
    static model_hit = _load_image_asset("assets/corgimonster_hit.webp");

    constructor(extra_max_hp, extra_damage, extra_speed) {
        super(
            CorgiMonsterEntity.size, 
            CorgiMonsterEntity.max_hp + extra_max_hp, 
            CorgiMonsterEntity.damage + extra_damage, 
            CorgiMonsterEntity.speed + extra_speed, 
            CorgiMonsterEntity.xp
        );
        this.model = CorgiMonsterEntity.model_idle;
        this.model_hit = CorgiMonsterEntity.model_hit;
        this.animation_offsets = {
            0 : 0
        };
        this.animation_states = {
            0 : CorgiMonsterEntity.model_idle,
        };
        this.__create_drops();
    }

    __create_drops() {
        if (Math.random() < 0.2) {
            this.inventory.push(0);
        }
    }
}


class MyregMonsterEntity extends MonsterEntity {

    static size = 60;
    static max_hp = 300;
    static damage = 40;
    static speed = 2;
    static xp = 500;
    
    static model_idle = _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804398619938917/frame_0_delay-0.1s.gif");
    static model_anim0 = _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804398900940890/frame_1_delay-0.1s.gif")
    static model_anim1 = _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1005804399303606282/frame_2_delay-0.1s.gif")
    static model_hit = _load_image_asset("https://cdn.discordapp.com/attachments/1005798982691323914/1006979563500347412/myreg_hit.webp");

    constructor(extra_max_hp, extra_damage, extra_speed) {
        super(
            MyregMonsterEntity.size, 
            MyregMonsterEntity.max_hp + extra_max_hp, 
            MyregMonsterEntity.damage + extra_damage, 
            MyregMonsterEntity.speed + extra_speed, 
            MyregMonsterEntity.xp
        );
        this.model = MyregMonsterEntity.model_idle;
        this.model_hit = MyregMonsterEntity.model_hit;
        this.animation_offsets = {
            0 : 1,
            12 : 2,
            24 : 1,
            36 : 0,
        };
        this.animation_states = {
            0 : MyregMonsterEntity.model_idle,
            1 : MyregMonsterEntity.model_anim0,
            2 : MyregMonsterEntity.model_anim1,
        };
        this.__create_drops();
    }
    __create_drops() {
        if (Math.random() < 0.3) {
            this.inventory.push(0);
        }
    }
}


class NykMonsterEntity extends MonsterEntity {

    static size = 70;
    static max_hp = 500;
    static damage = 10;
    static speed = 3.5;
    static xp = 1000;

    static knockback_speed = 20;
    
    static models = [
        _load_image_asset("assets/nyk00.gif"),
        _load_image_asset("assets/nyk01.gif"),
        _load_image_asset("assets/nyk02.gif"),
        _load_image_asset("assets/nyk03.gif"),
        _load_image_asset("assets/nyk04.gif"),
        _load_image_asset("assets/nyk05.gif"),
        _load_image_asset("assets/nyk06.gif"),
        _load_image_asset("assets/nyk07.gif"),
        _load_image_asset("assets/nyk08.gif"),
        _load_image_asset("assets/nyk09.gif"),
        _load_image_asset("assets/nyk10.gif"),
        _load_image_asset("assets/nyk11.gif"),        
        _load_image_asset("assets/nyk12.gif"),
        _load_image_asset("assets/nyk13.gif"),
        _load_image_asset("assets/nyk14.gif"),
    ]
    static model_hit = _load_image_asset("assets/nyk_hit.png");

    constructor(extra_max_hp, extra_damage, extra_speed, extra_xp) {
        super(
            NykMonsterEntity.size, 
            NykMonsterEntity.max_hp + extra_max_hp, 
            NykMonsterEntity.damage + extra_damage, 
            NykMonsterEntity.speed + extra_speed, 
            NykMonsterEntity.xp + extra_xp
        );
        this.model = NykMonsterEntity.models[0];
        this.model_hit = NykMonsterEntity.model_hit;
        this.animation_offsets = {
            2 : 1,
            5 : 2,
            8 : 3,
            11 : 4,
            14 : 5,
            17 : 6,
            20 : 7,
            23 : 8,
            26 : 9,
            29 : 10,
            32 : 11,
            23 : 12,
            26 : 13,
            29 : 14,
            32 : 0,
        };
        this.animation_states = {
            0 : NykMonsterEntity.models[0],
            1 : NykMonsterEntity.models[1],
            2 : NykMonsterEntity.models[2],
            3 : NykMonsterEntity.models[3],
            4 : NykMonsterEntity.models[4],
            5 : NykMonsterEntity.models[5],
            6 : NykMonsterEntity.models[6],
            7 : NykMonsterEntity.models[7],
            8 : NykMonsterEntity.models[8],
            9 : NykMonsterEntity.models[9],
            10 : NykMonsterEntity.models[10],
            11 : NykMonsterEntity.models[11],
            12 : NykMonsterEntity.models[12],
            13 : NykMonsterEntity.models[13],
            14 : NykMonsterEntity.models[14],
        };
        this.__create_drops();
    }
    __create_drops() {
        if (Math.random() < 0.9) {
            this.inventory.push(0);
        }
    }
}
