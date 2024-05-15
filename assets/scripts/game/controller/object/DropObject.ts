// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Game, NodeGroup } from "../../../lib/GameConstants";
import { Utils } from "../../../lib/GameUtils";
import { UIData } from "../../../ui/UIData";
import ObjectController from "../ObjectController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DropObject extends ObjectController {
    private collider: cc.PhysicsBoxCollider;
    private collected: boolean = false;

    protected start(): void {
        this.collider = this.getComponent(cc.PhysicsBoxCollider);   
    }

    protected update(dt: number): void {
        if (this.collider.tag == -1 && !this.collected) {
            this.node.removeFromParent();
            Game.manager.ui.addChild(this.node);
            this.rigidbody.type = cc.RigidBodyType.Static;
            this.getComponent(cc.Animation).stop();
            this.node.removeComponent(cc.PhysicsBoxCollider);
            this.node.removeComponent(cc.RigidBody);
            this.node.removeComponent(cc.Animation);
            this.node.position = this.node.parent.convertToNodeSpaceAR(Game.manager.node.convertToWorldSpaceAR(Game.manager.player.position));
            this.node.runAction(cc.moveTo(0.3, cc.v2(44.893, 92)).easing(cc.easeInOut(1)));
            this.node.runAction(cc.scaleTo(0.3, 0.4, 0.4).easing(cc.easeInOut(1)));
            this.scheduleOnce(() => {
                UIData.coin++;
                this.node.destroy();
            }, 0.35);
            this.collected = true;
        }
        else if (this.collider.tag == 0) this.node.position = this.node.position.add(cc.v3(this.rigidbody.linearVelocity));
    }
}
