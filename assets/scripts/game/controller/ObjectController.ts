// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Game, GameObjectType } from "../../lib/GameConstants";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ObjectController extends cc.Component {
    @property({ type: cc.Enum(GameObjectType), serializable: true })
    public identifier: GameObjectType = GameObjectType.coin;
    protected rigidbody: cc.RigidBody;
    
    protected onLoad(): void {
        this.rigidbody = this.getComponent(cc.RigidBody);
    }
}
