import { UIData } from "../ui/UIData";
import { Game } from "./GameConstants";

export module Utils {
    export function higherThanCollider(selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider, velocity: number) {
        if (!(selfCollider instanceof cc.PhysicsBoxCollider) || !(otherCollider instanceof cc.PhysicsBoxCollider)) {
            return false;
        }
        let otherBox = otherCollider as cc.PhysicsBoxCollider;
        return otherBox.offset.y + otherBox.size.height / 2 + velocity > selfCollider.node.y;
    }

    export function addScoreParticle(x: number, y: number, score: number) {
        UIData.score += score;

        let scorePrefab = cc.instantiate(Game.manager.scorePrefab);
        scorePrefab.position = cc.v3(x, y, 0);
        scorePrefab.getComponent(cc.Label).string = score.toString();
        Game.manager.canvas.addChild(scorePrefab);
    }
}