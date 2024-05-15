// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "../../game/GameManager";
import { Game } from "../../lib/GameConstants";
import { UIData } from "../UIData";
import LevelSelectorController from "./LevelSelectorController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerSelectorController extends cc.Component {
    @property(cc.Node)
    public arrow: cc.Node = null;
    public selectable: boolean = true;
    @property(cc.Node)
    public nextSelection: cc.Node;

    protected start(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.moveDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.moveUp, this);
    }

    moveDown(event: cc.Event.EventKeyboard) {
        if (!this.selectable) return;
        if (event.keyCode == cc.macro.KEY.s) {
            UIData.type = UIData.multiplayer;
            this.arrow.position = cc.v3(-55, -50);
        } else if (event.keyCode == cc.macro.KEY.space) {
            this.selectable = false;
            this.node.parent.runAction(cc.moveTo(1, cc.v2(-320, 0)));
            this.schedule(() => {
                this.nextSelection.getComponent(LevelSelectorController).selectable = true;
            }, 0.5);
        }
    }

    moveUp(event: cc.Event.EventKeyboard) {
        if (!this.selectable) return;
        if (event.keyCode != cc.macro.KEY.w) return;
        UIData.type = UIData.singleplayer;
        this.arrow.position = cc.v3(-55, -34);
    }
}
