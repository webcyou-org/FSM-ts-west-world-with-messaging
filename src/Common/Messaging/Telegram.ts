export class Telegram {
    sender: number = -1;

    receiver: number = -1;

    msg: number = -1;

    dispatchTime: number = -1;

    extraInfo: any;

    constructor(
        time: number,
        sender: number,
        receiver: number,
        msg: number,
        info: any = null
    ) {
        this.dispatchTime = time;
        this.sender = sender;
        this.receiver = receiver;
        this.msg = msg;
        this.extraInfo = info;
    }

}