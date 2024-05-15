import { NodeGroup } from "../../../lib/GameConstants";
import { Utils } from "../../../lib/GameUtils";
import EnemyController from "../EnemyController";
import PlayerController from "../PlayerController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TurtleEnemyController extends EnemyController {
    private direction = -1;
    private animationState: cc.AnimationState = null;

    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        super.onPreSolve(contact, selfCollider, otherCollider);
        if (this.death) return;
        if (otherCollider.node.group == NodeGroup.penetratableBlock && Utils.higherThanCollider(selfCollider, otherCollider, this.rigidbody.linearVelocity.y)) {
            contact.disabled = true;
            contact.disabledOnce = true;
        }
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.death) return;
        if (otherCollider.node.group == NodeGroup.block) {
            if (Utils.higherThanCollider(selfCollider, otherCollider, 0)) {
                this.direction *= -1;
            }
        }
        else if (otherCollider.node.group == NodeGroup.player) {
            let step = otherCollider.node.getComponent(cc.RigidBody).linearVelocity.y < 0 && contact.getWorldManifold().normal.y > 0;
            if (this.variant == 0 && step) {
                this.variant = 1;
                this.animationState = this.animation.play(`shell`);
                this.node.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(0, -3.5);
                this.rigidbody.linearVelocity = cc.v2(0, 1.5);
            } else {
                if (this.variant == 1) {
                    this.variant = 2;
                    if (this.animationState.name != "shell_running") this.animationState = this.animation.play(`shell_running`);
                    this.getComponent(cc.PhysicsBoxCollider).tag = 2;
                    this.direction = -Math.sign(contact.getWorldManifold().normal.x + 0.01);
                } else if (step) {
                    this.variant = 1;
                    this.rigidbody.linearVelocity = cc.v2(0, this.rigidbody.linearVelocity.y)
                    this.getComponent(cc.PhysicsBoxCollider).tag = 0;
                    if (this.animationState.name != "shell") this.animationState = this.animation.play(`shell`);
                }
            }
            if (step) {
                otherCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(otherCollider.node.getComponent(cc.RigidBody).linearVelocity.x, 3);
                Utils.addScoreParticle(this.node.position.x, this.node.position.y, 100);
            }
        } else if (otherCollider.node.group == NodeGroup.enemy && this.variant == 2) {
            otherCollider.getComponents(cc.Component).find((component) => component instanceof EnemyController).onDeath(otherCollider.node, false);
        }
    }

    public onDeath(attacker: cc.Node, isPlayer: boolean): void {
        super.onDeath(attacker, isPlayer);
        Utils.addScoreParticle(this.node.position.x, this.node.position.y, 1000);
    }

    protected update(dt: number): void {
        if (this.death) {
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            return;
        }
        super.update(dt);
        if (!this.active) return;
        if (this.variant != 1) {
            this.rigidbody.linearVelocity = cc.v2(this.direction * (this.variant == 0 ? 0.5 : 2), this.rigidbody.linearVelocity.y);
        }
        this.node.scaleX = -Math.sign(this.direction);
        this.node.position = this.node.position.add(cc.v3(this.rigidbody.linearVelocity));
    }
}
