import BlockController from "../BlockController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrickBlockController extends BlockController {
    protected hitByPlayer(player: cc.Node) {
    }
}