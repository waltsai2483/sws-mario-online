import BlockController from "../BlockController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NoteBlockController extends BlockController {
    protected stepByPlayer(player: cc.Node) {
        let start = cc.moveBy(0.1, 0, -8).easing(cc.easeIn(2.0));
        let mid = cc.moveBy(0.2, 0, 16).easing(cc.easeOut(2.0));
        let end = cc.moveBy(0.1, 0, -8).easing(cc.easeOut(2.0));
        this.node.runAction(cc.sequence(start, mid, end));

        let rigidbody = player.getComponent(cc.RigidBody);
        rigidbody.linearVelocity = cc.v2(rigidbody.linearVelocity.x, 5);
    }

    protected stepByEntity(entity: cc.Node) {
        let start = cc.moveBy(0.1, 0, -8).easing(cc.easeIn(2.0));
        let mid = cc.moveBy(0.2, 0, 16).easing(cc.easeOut(2.0));
        let end = cc.moveBy(0.1, 0, -8).easing(cc.easeOut(2.0));
        this.node.runAction(cc.sequence(start, mid, end));

        let rigidbody = entity.getComponent(cc.RigidBody);
        rigidbody.linearVelocity = cc.v2(rigidbody.linearVelocity.x, 5);
    }
}