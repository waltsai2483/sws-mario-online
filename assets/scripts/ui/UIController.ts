// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIData } from "./UIData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIController extends cc.Component {
    @property(cc.Label)
    private score: cc.Label;
    @property(cc.Label)
    private timer: cc.Label;
    @property(cc.Label)
    private life: cc.Label;
    @property(cc.Label)
    private coin: cc.Label;

    protected start(): void {
        this.updateLife();
    }
    
    protected update(dt: number): void {
        this.updateScore();
        this.updateTimer();
        this.updateCoin();
    }

    updateScore() {
        let str = UIData.score.toString();
        while (str.length < 8) str = "0" + str;
        this.score.string = str;
    }
    
    updateTimer() {
        let str = UIData.time.toString();
        while (str.length < 3) str = "0" + str;
        this.timer.string = str;
    }
    
    updateLife() {
        this.life.string = UIData.life.toString();
    }
    
    updateCoin() {
        this.coin.string = UIData.coin.toString();
    }
}
