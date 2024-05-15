import { EnemyObjectType, NodeGroup } from "../../../lib/GameConstants";
import { Utils } from "../../../lib/GameUtils";
import EnemyController from "../EnemyController";
import PlayerController from "../PlayerController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GoombaEnemyController extends EnemyController {
    private direction = -1;
    private stepCount = 0;
    private currentState: cc.AnimationState = null;

    protected onLoad(): void {
        super.onLoad();
        if (this.animation) {
            this.currentState = this.animation.play(`walk_${this.variant}`);
        }
        if (this.variant == 1) {
            this.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(0, -4);
        }
    }

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
            if (contact.getWorldManifold().normal.y <= 0 && contact.getWorldManifold().normal.x != 0 && Utils.higherThanCollider(selfCollider, otherCollider, -5)) {
                this.direction *= -1;
            }
        }
        if (otherCollider.node.group == NodeGroup.block || otherCollider.node.group == NodeGroup.penetratableBlock) {
            if ((!this.currentState || this.currentState.name == `jump_${this.variant}`) && this.rigidbody.linearVelocity.y <= 1) {
                this.currentState = this.animation.play(`walk_${this.variant}`);
            }
            if (this.variant == 1 && this.stepCount % 8 == 0) {
                this.rigidbody.linearVelocity = cc.v2(this.rigidbody.linearVelocity.x, 3.5);
                this.currentState = this.animation.play(`jump_${this.variant}`);
            }
            this.stepCount++;
        } else if (otherCollider.node.group == NodeGroup.player) {
            let step = otherCollider.node.getComponent(cc.RigidBody).linearVelocity.y < 0 && contact.getWorldManifold().normal.y > 0;
            if (step) {
                this.onDeath(otherCollider.node, true);
            }
        } else if (otherCollider.node.group == NodeGroup.enemy && otherCollider.node.getComponents(cc.Component).find((comp) => comp instanceof EnemyController).identifier == EnemyObjectType.turtle) {
            this.onDeath(otherCollider.node, false);
        }
    }

    public onDeath(attacker: cc.Node, isPlayer: boolean) {
        Utils.addScoreParticle(this.node.position.x, this.node.position.y, 1000);
        if (isPlayer) {
            this.death = true;
            attacker.getComponent(cc.RigidBody).linearVelocity = cc.v2(attacker.getComponent(cc.RigidBody).linearVelocity.x, 3);
            this.rigidbody.linearVelocity = cc.Vec2.ZERO;
            this.rigidbody.gravityScale = 0;
            this.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.animation.play("death");
            this.scheduleOnce(() => this.node.destroy(), 1);
        } else {
            super.onDeath(attacker, isPlayer);
        }
    }

    protected update(dt: number): void {
        super.update(dt);
        if (!this.active) return;
        if (!this.death) this.rigidbody.linearVelocity = cc.v2(this.direction * 0.5, this.rigidbody.linearVelocity.y);
        this.node.position = this.node.position.add(cc.v3(this.rigidbody.linearVelocity));
    }
}
