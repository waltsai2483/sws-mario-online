// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Game, NodeGroup } from "../../../lib/GameConstants";
import { Utils } from "../../../lib/GameUtils";
import ObjectController from "../ObjectController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WalkingObject extends ObjectController {
    private direction = 1;

    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.node.group == NodeGroup.penetratableBlock && Utils.higherThanCollider(selfCollider, otherCollider, 0)) {
            contact.disabled = true;
            contact.disabledOnce = true;
        }
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.node.group == NodeGroup.block && Utils.higherThanCollider(selfCollider, otherCollider, 0)) {
            this.direction *= -1;
        }
    }

    protected update(dt: number): void {
        this.rigidbody.linearVelocity = cc.v2(this.direction, this.rigidbody.linearVelocity.y);
        this.node.position = this.node.position.add(cc.v3(this.rigidbody.linearVelocity));
    }
}
