import GameManager from "../game/GameManager";

export module Game {
    export const playerDefaultMoveSpeed = 150;
    export const playerDefaultRunSpeed = 200;
    export const playerDefaultJumpStrength = 4;
    export const playerMegaJumpStrength = 5.5;

    export const mapMinX = -1888;
    export const mapMaxX = 1888;
    export const mapRect = cc.rect(-1888, -149, 3776, 298);

    export var manager: GameManager;
    export var levelName: string = "level1";
}

export module PlayerAnimation {
    export const idle = "idle";
    export const walk = "walk";
    export const run = "run";
    export const jump = "jump";
    export const ultrajump = "ultrajump";
    export const down = "down";
    export const slide = "slide";
    export const hold_idle = "hold_idle";
    export const hold_walk = "hold_walk";
}

export enum PlayerHealthState {
    death = "death",
    small = "small",
    big = "big"
}

export enum NodeGroup {
    player = "player",
    block = "block",
    penetratableBlock = "penetratable_block",
    enemy = "enemy",
    powerItem = "power_item"
}

export const TopBlockedPID = [16, 17, 18, 20, 21, 22, 145, 146, 147, 149, 150, 151, 257, 272, 273]

export enum TilemapObjectType {
    mystery_with_coin = 226,
    mystery_with_mushroom = 227,
    mystery_with_plenty_coins = 228,
    brick = 355,
    brick_with_coin = 356,
    note = 223
}

export enum EnemyObjectType {
    goomba = 0,
    flying_goomba = 1,
    flower = 2,
    turtle = 3
}

export enum GameObjectType {
    red_mushroom = 0,
    coin = 1,
    steady_coin = 2
}