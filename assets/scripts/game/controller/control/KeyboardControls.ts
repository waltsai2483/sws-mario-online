
const { ccclass, property } = cc._decorator;

export enum ButtonState {
    Rest = 0,
    Pressed = 1,
    Hold = 2
}

export enum AxisState {
    Left = -1,
    None = 0,
    Right = 1
}

@ccclass
export default class KeyboardControls extends cc.Component {
    private hAxis: AxisState = AxisState.None;
    private spaceState: ButtonState = ButtonState.Rest;
    private downState: ButtonState = ButtonState.Rest;

    private moveTime: number = 0;
    private jumpTime: number = 0;

    public get horizontalAxis() {
        return this.hAxis;
    }

    public get isJumping() {
        return this.spaceState >= ButtonState.Pressed;
    }

    public get isDucking() {
        return this.downState == ButtonState.Pressed;
    }

    public get moveStrength() {
        return this.moveTime;
    }

    public get jumpStrength() {
        return this.jumpTime;
    }

    protected start(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.hAxis--;
                this.moveTime = Math.min(this.moveTime + 0.045, 1);
                break;
            case cc.macro.KEY.d:
                this.moveTime = Math.min(this.moveTime + 0.045, 1);
                this.hAxis++;
                break;
        }
        this.hAxis = Math.max(-1, Math.min(this.hAxis, 1));
        if (event.keyCode == cc.macro.KEY.space) {
            switch (this.spaceState) {
                case ButtonState.Rest:
                    this.spaceState = ButtonState.Pressed;
                    break;
                case ButtonState.Pressed:
                case ButtonState.Hold:
                    this.spaceState = ButtonState.Hold;
                    this.jumpTime = Math.min(this.jumpTime + 0.1, 1);
                    break;
            }
        }
        if (event.keyCode == cc.macro.KEY.s) {
            switch (this.downState) {
                case ButtonState.Rest:
                    this.downState = ButtonState.Pressed;
                    break;
            }
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.hAxis++;
                this.moveTime = 0;
                break;
            case cc.macro.KEY.d:
                this.hAxis--;
                this.moveTime = 0;
                break;
        }
        this.hAxis = Math.max(-1, Math.min(this.hAxis, 1));
        if (event.keyCode == cc.macro.KEY.space) {
            switch (this.spaceState) {
                case ButtonState.Pressed:
                case ButtonState.Hold:
                    this.spaceState = ButtonState.Rest;
                    this.jumpTime = 0;
                    break;
            }
        }
        if (event.keyCode == cc.macro.KEY.s) {
            switch (this.downState) {
                case ButtonState.Pressed:
                    this.downState = ButtonState.Rest;
                    break;
            }
        }
    }
}
