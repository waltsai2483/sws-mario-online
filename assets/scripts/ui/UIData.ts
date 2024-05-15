export module UIData {
    export const singleplayer = 0;
    export const multiplayer = 1;

    export var score = 0;
    export var time = 300;
    export var life = 5;
    export var coin = 0;

    export var type: number = singleplayer;

    export function init() {
        score = 0;
        time = 300;
        coin = 0;
    }
}