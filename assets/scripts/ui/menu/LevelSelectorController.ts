// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../../game/GameManager";
import { Game } from "../../lib/GameConstants";
import { UIData } from "../UIData";
import PlayerSelectorController from "./PlayerSelectorController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelSelectorController extends cc.Component {
    @property(cc.Node)
    public arrow: cc.Node = null;
    public selectable: boolean = false;
    @property(PlayerSelectorController)
    public prevSelection: PlayerSelectorController = null;

    protected start(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.moveDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.moveUp, this);
    }

    moveDown(event: cc.Event.EventKeyboard) {
        if (!this.selectable) return;
        if (event.keyCode == cc.macro.KEY.s) {
            Game.levelName = "level2";
            this.arrow.position = cc.v3(-30, -50);
        } else if (event.keyCode == cc.macro.KEY.space) {
            cc.director.loadScene("scenes/game_start", (err, scene: cc.Scene) => {
            });
        } else if (event.keyCode == cc.macro.KEY.escape) {
            this.selectable = false;
            this.node.parent.runAction(cc.moveTo(1, cc.v2(0, 0)));
            this.schedule(() => {
                this.prevSelection.selectable = true;
            }, 0.5);
        }
    }

    moveUp(event: cc.Event.EventKeyboard) {
        if (!this.selectable) return;
        if (event.keyCode != cc.macro.KEY.w) return;
        Game.levelName = "level1";
        this.arrow.position = cc.v3(-30, -34);
    }
}
