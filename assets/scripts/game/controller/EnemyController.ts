// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EnemyObjectType as EnemyObjectType, Game, GameObjectType } from "../../lib/GameConstants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyController extends cc.Component {
    @property({ type: cc.Enum(EnemyObjectType), serializable: true })
    public identifier: EnemyObjectType = EnemyObjectType.goomba;
    public variant: number = 0;
    public active: boolean = false;
    public death: boolean = false;
    
    protected rigidbody: cc.RigidBody;
    protected animation: cc.Animation = null;


    protected onLoad(): void {
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.animation = this.node.getComponent(cc.Animation);
    }

    public onDeath(attacker: cc.Node, isPlayer: boolean) {
        if (this.death) return;
        if (!isPlayer) {
            this.death = true;
            this.getComponent(cc.PhysicsBoxCollider).tag = -1;
            this.rigidbody.gravityScale = 0.025;
            this.rigidbody.linearVelocity = cc.v2(Math.random()-0.5, 2);
            this.scheduleOnce(() => this.node.destroy(), 2);
        }
    }

    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (selfCollider.tag == -1) {
            contact.disabled = true;
        }
    }

    protected update(dt: number): void {
        if (Math.abs(Game.manager.player.position.x - this.node.position.x) < 200) {
            this.active = true;
        }
    }
}
