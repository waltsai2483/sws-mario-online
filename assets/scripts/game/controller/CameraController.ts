// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Game } from "../../lib/GameConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraController extends cc.Component {
    @property(cc.Node)
    public target: cc.Node = null;

    protected lateUpdate(dt: number): void {
        this.node.position = cc.v3(Math.max(Game.mapRect.xMin, Math.min(Game.mapRect.xMax, this.target.position.x)), Math.max(Game.mapRect.yMin, Math.min(Game.mapRect.yMax, this.target.position.y)));
    }
}
