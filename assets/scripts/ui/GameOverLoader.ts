// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../game/GameManager";
import { Game } from "../lib/GameConstants";
import { LevelData } from "./GameLoader";
import { UIData } from "./UIData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverLoader extends cc.Component {
    @property({type: [LevelData]})
    levels: LevelData[] = [];

    private scene: cc.Scene;

    protected start(): void {
        cc.director.loadScene("scenes/game", (err, scene: cc.Scene) => {
            const level = this.levels.find((data) => data.name == Game.levelName);
            scene.getComponentInChildren(cc.TiledMap).tmxAsset = level.asset;
            this.scene = scene;
        });
    }

    protected update(dt: number): void {
        if (this.scene) {
            this.scheduleOnce(() => cc.director.runScene(this.scene), 8);
        }
    }
}
