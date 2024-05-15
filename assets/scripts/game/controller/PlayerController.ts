// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Game, GameObjectType, NodeGroup, PlayerAnimation, PlayerHealthState } from "../../lib/GameConstants";
import { UIData } from "../../ui/UIData";
import KeyboardControls, { AxisState } from "./control/KeyboardControls";
import ObjectController from "./ObjectController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {
    @property(cc.Node)
    public camera: cc.Node = null;

    public inputControls: KeyboardControls = null;

    private animation: cc.Animation;
    private rigidbody: cc.RigidBody;
    private physicCollision: cc.PhysicsBoxCollider;
    private animationState: cc.AnimationState;

    private health: PlayerHealthState = PlayerHealthState.small;
    private healthChanged: boolean = false;
    private invincibility: number = 0;
    private velX = 0;
    private velY = 0;
    private isJumping = false;

    public get velocity() {
        return cc.v2(this.velX, this.velY);
    }

    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if ((otherCollider.node.group == NodeGroup.penetratableBlock && (this.higherThanCollider(otherCollider) || this.inputControls.isDucking)) || selfCollider.tag == -1) {
            contact.disabled = true;
            contact.disabledOnce = true;
        }
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.tag == 100 && this.health != PlayerHealthState.death) {
            this.onDeath();
        } else if (otherCollider.node.group == NodeGroup.powerItem) {
            let objData = otherCollider.node.getComponents(cc.Component).find((component) => component instanceof ObjectController);
            if (objData.identifier == GameObjectType.red_mushroom && this.health == PlayerHealthState.small) {
                otherCollider.node.destroy();
                contact.disabledOnce = true;
                this.playLevelupAnimation();
            } else if (objData.identifier == GameObjectType.coin) {
                contact.disabled = true;
                otherCollider.tag = -1;
            }
        } else if ((otherCollider.node.group == NodeGroup.block || otherCollider.node.group == NodeGroup.penetratableBlock) && !this.higherThanCollider(otherCollider) && this.isJumping) {
            this.isJumping = false;
        } else if (otherCollider.node.group == NodeGroup.enemy) {
            let step = selfCollider.node.getComponent(cc.RigidBody).linearVelocity.y < 0;
            if (!step) {
                this.levelDown();
            }
        }
    }

    protected onLoad(): void {
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.physicCollision = this.node.getComponent(cc.PhysicsBoxCollider);
    }

    protected start(): void {
        this.inputControls = this.getComponent(KeyboardControls);
        this.animationState = this.animation.play("small_walk");
    }

    protected update(dt: number): void {
        this.colliderChange();
        if (this.inputControls.horizontalAxis == AxisState.None || this.inputControls.isDucking) {
            this.velX *= (this.inputControls.isDucking ? 0.95 : 0.8);
        } else {
            this.velX = this.inputControls.horizontalAxis * ((this.inputControls.moveStrength < 0.25 || this.isJumping) ? Game.playerDefaultMoveSpeed : Game.playerDefaultRunSpeed) * dt;
        }

        this.velY = this.rigidbody.linearVelocity.y;
        if (this.inputControls.isJumping && !this.isJumping && this.rigidbody.linearVelocity.y >= 0) {
            this.velY = (this.inputControls.moveStrength < 0.25) ? Game.playerDefaultJumpStrength : Game.playerMegaJumpStrength;
            this.isJumping = true;
        }
        if (this.health != PlayerHealthState.death) this.rigidbody.linearVelocity = this.velocity;
        this.node.position = this.node.position.add(cc.v3(this.rigidbody.linearVelocity));

        if (!this.healthChanged && this.health != PlayerHealthState.death) {
            this.animationUpdate();
        }
        this.invincibility = Math.max(this.invincibility - dt, 0);
    }

    private colliderChange() {
        if (this.health == PlayerHealthState.small) {
            if (this.inputControls.isDucking) {
                this.physicCollision.offset = cc.v2(0, -3);
                this.physicCollision.size = cc.size(12, 8);
            } else {
                this.physicCollision.offset = cc.v2(0, 1);
                this.physicCollision.size = cc.size(12, 16);
            }
        } else {
            if (this.inputControls.isDucking) {
                this.node.position = this.node.position.sub(cc.v3(0, 2.5));
                this.physicCollision.offset = cc.v2(0, -1.5);
                this.physicCollision.size = cc.size(12, 13);
            } else {
                this.physicCollision.offset = cc.v2(0, 1);
                this.physicCollision.size = cc.size(12, 26);
            }
        }
        this.physicCollision.apply();
    }

    private animationUpdate() {
        if (this.inputControls.isDucking) {
            this.playAnimation(PlayerAnimation.down);
        } else if (this.isJumping || this.rigidbody.linearVelocity.y < 0) {
            if (this.inputControls.moveStrength < 0.25) {
                this.playAnimation(PlayerAnimation.jump);
            } else {
                this.playAnimation(PlayerAnimation.ultrajump);
            }
        } else {
            if (this.inputControls.horizontalAxis == 0) {
                this.playAnimation(PlayerAnimation.idle);
            } else {
                if (this.inputControls.moveStrength < 0.25 || this.isJumping) {
                    this.playAnimation(PlayerAnimation.walk);
                } else {
                    this.playAnimation(PlayerAnimation.run);
                }
            }
        }
        if (this.inputControls.horizontalAxis != AxisState.None) {
            this.node.setScale(new cc.Vec2(this.inputControls.horizontalAxis == AxisState.Right ? 1 : -1, 1));
        }
    }

    private playAnimation(name: string) {
        if (this.animationState == null || this.animationState.name != `${this.health}_${name}`) {
            this.animationState = this.animation.play(`${this.health}_${name}`);
        }
    }

    private playLevelupAnimation() {
        this.health = PlayerHealthState.big;
        this.invincibility = 3;
        this.animationState = this.animation.play("level_up_to_big");
        this.healthChanged = true;
        this.scheduleOnce(() => {
            this.healthChanged = false;
            this.colliderChange();
        }, 0.5);
        this.scheduleOnce(() => {
            this.node.runAction(cc.moveBy(0, 0, 8));
        }, 0.125);
        this.scheduleOnce(() => {
            this.node.runAction(cc.moveBy(0, 0, -8));
        }, 0.25);
        this.scheduleOnce(() => {
            this.node.runAction(cc.moveBy(0, 0, 8));
        }, 0.375);
    }

    public levelDown() {
        if (this.invincibility > 0) return;
        if (this.health == PlayerHealthState.big) {
            this.health = PlayerHealthState.small;
            this.invincibility = 3;
            this.animationState = this.animation.play("level_down_to_small");
            this.healthChanged = true;
            this.scheduleOnce(() => {
                this.healthChanged = false;
                this.colliderChange();
            }, 0.5);
            this.scheduleOnce(() => {
                this.node.runAction(cc.moveBy(0, 0, -8));
            }, 0.125);
            this.scheduleOnce(() => {
                this.node.runAction(cc.moveBy(0, 0, 8));
            }, 0.25);
            this.scheduleOnce(() => {
                this.node.runAction(cc.moveBy(0, 0, -8));
            }, 0.375);
        } else if (this.health != PlayerHealthState.death) {
            this.onDeath();
        }
    }

    private onDeath() {
        this.health = PlayerHealthState.death;
        this.animationState = this.animation.play("death");
        this.rigidbody.linearVelocity = cc.Vec2.ZERO;
        this.rigidbody.gravityScale = 0;
        this.physicCollision.tag = -1;
        UIData.life = Math.max(UIData.life - 1, 0);
        this.scheduleOnce(() => {
            this.rigidbody.gravityScale = 0.025;
            this.rigidbody.linearVelocity = cc.v2(0, 3);
        }, 0.5);
        if (UIData.life > 0) {
            this.scheduleOnce(() => {
                cc.director.loadScene("scenes/game_start");
            }, 4);
        } else {
            this.scheduleOnce(() => {
                cc.director.loadScene("scenes/game_over");
            }, 4);
        }
    }

    private higherThanCollider(collider: cc.PhysicsCollider) {
        let box = collider as cc.PhysicsBoxCollider;
        return collider.node.y + box.offset.y + box.size.height / 2 + this.velY > this.node.y + this.physicCollision.offset.y - this.physicCollision.size.height / 2;
    }
}
