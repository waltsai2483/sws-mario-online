// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../game/GameManager";
import { Game } from "../lib/GameConstants";
import { UIData } from "./UIData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLoader extends cc.Component {
    @property(cc.Label)
    lifeCount: cc.Label = null;

    protected start(): void {
        if (this.lifeCount) this.lifeCount.string = UIData.life.toString();
        UIData.init();
        this.scheduleOnce(() => {
            cc.director.loadScene("scenes/game", (err, scene: cc.Scene) => {
                const level = scene.getComponentInChildren(GameManager).levels.find((data) => data.name == Game.levelName);
                scene.getComponentInChildren(cc.TiledMap).tmxAsset = level.asset;
            });
        }, 3);
    }
}
