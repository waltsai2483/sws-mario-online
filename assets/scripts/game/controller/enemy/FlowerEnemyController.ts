import { Game, NodeGroup } from "../../../lib/GameConstants";
import { Utils } from "../../../lib/GameUtils";
import EnemyController from "../EnemyController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FlowerEnemyController extends EnemyController {
    inPipe: boolean = true;
    lastAttackTime: number = 0;
    currentTime: number = 0;

    protected update(dt: number): void {
        if (Math.abs(Game.manager.player.position.x - this.node.position.x) < 600) {
            this.active = true;
        }
        if (!this.active || this.death) return;
        this.currentTime += dt;
        if (this.currentTime - this.lastAttackTime > 4) {
            this.node.runAction(cc.moveBy(0.75, cc.v2(0, 32)));
            this.lastAttackTime += 4.5 + Math.random() * 5;
            this.scheduleOnce(() => {
                this.node.runAction(cc.moveBy(0.75, cc.v2(0, -32)));
            }, 3.75);
        }
    }

    public onDeath(attacker: cc.Node, isPlayer: boolean): void {
        if (this.death) return;
        Utils.addScoreParticle(this.node.position.x, this.node.position.y, 500);
        this.node.stopAllActions();
        this.node.runAction(cc.moveBy(0.25, cc.v2(0, -32)).easing(cc.easeInOut(1)));
        super.onDeath(attacker, isPlayer);
        this.rigidbody.linearVelocity = cc.Vec2.ZERO;
    }
}
