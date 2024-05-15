import { NodeGroup } from "../../lib/GameConstants";
import { Utils } from "../../lib/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockController extends cc.Component {
    public variant: number = 0;
    
    protected animation: cc.Animation = null;
    protected rigidbody: cc.RigidBody = null;
    protected triggerCooldown = 0.1;

    private triggered = false;

    protected onLoad(): void {
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidbody = this.node.getComponent(cc.RigidBody);
    }

    protected hitByPlayer(player: cc.Node) {}
    protected stepByPlayer(player: cc.Node) {}
    protected stepByEntity(player: cc.Node) {}

    // Tag=-1: enemies that can interact with block
    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.node.group == NodeGroup.player && !this.triggered) {
            let player = otherCollider.node;
            if (contact.getWorldManifold().normal.y < 0 && contact.getWorldManifold().normal.x == 0) {
                let start = cc.moveBy(0.12, 0, 4).easing(cc.easeIn(2.0));
                let end = cc.moveBy(0.12, 0, -4).easing(cc.easeOut(2.0));
                this.node.runAction(cc.sequence(start, end));
                this.hitByPlayer(player);
            } else if (contact.getWorldManifold().normal.y > 0 && contact.getWorldManifold().normal.x == 0) {
                this.stepByPlayer(player);
            }
            this.triggered = true;
            this.scheduleOnce(() => this.triggered = false, this.triggerCooldown);
        } else if (otherCollider.node.group == NodeGroup.enemy) {
            this.stepByEntity(otherCollider.node);
        }
    }
}