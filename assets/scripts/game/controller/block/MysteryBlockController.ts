import { Game, GameObjectType } from "../../../lib/GameConstants";
import { GameObjectData } from "../../GameManager";
import BlockController from "../BlockController";

const { ccclass, property } = cc._decorator;

/*
    mystery_with_coin = 0,
    mystery_with_mushroom = 1,
    mystery_with_plenty_coins = 2,
*/
@ccclass
export default class MysteryBlockController extends BlockController {
    private hitCount = 0;
    private maxHitAmount = 1;

    protected start(): void {
        if (this.variant <= 1) {
            this.maxHitAmount = 1;
        } else if (this.variant == 2) {
            this, this.maxHitAmount = Math.ceil(Math.random() * 4) + 6;
        }
    }

    protected hitByPlayer(player: cc.Node) {
        if (this.hitCount >= this.maxHitAmount) {
            return;
        }
        let object: cc.Node;
        if (this.variant == 0) {
            object = cc.instantiate(Game.manager.gamePrefabMap.get(GameObjectType.red_mushroom).prefab);
            object.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 2);
        } else {
            object = cc.instantiate(Game.manager.gamePrefabMap.get(GameObjectType.coin).prefab);
            object.getComponent(cc.RigidBody).linearVelocity = cc.v2(Math.random() - 0.5, 2.5 + Math.random() * 0.5);
        }
        object.position = this.node.position;
        Game.manager.canvas.addChild(object);
        this.hitCount++;
    }

    protected update(dt: number): void {
        if (this.hitCount >= this.maxHitAmount && this.animation.currentClip == null) {
            this.animation.play("empty");
        }
    }
}