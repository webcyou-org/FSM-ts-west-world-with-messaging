"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telegram = void 0;
class Telegram {
    constructor(time, sender, receiver, msg, info = null) {
        this.sender = -1;
        this.receiver = -1;
        this.msg = -1;
        this.dispatchTime = -1;
        this.dispatchTime = time;
        this.sender = sender;
        this.receiver = receiver;
        this.msg = msg;
        this.extraInfo = info;
    }
}
exports.Telegram = Telegram;
