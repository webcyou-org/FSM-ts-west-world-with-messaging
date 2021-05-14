"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDispatcher = exports.SENDER_ID_IRRELEVANT = exports.NO_ADDITIONAL_INFO = exports.SEND_MSG_IMMEDIATELY = void 0;
const EntityManager_1 = require("./EntityManager");
const MessageTypes_1 = require("./MessageTypes");
const Telegram_1 = require("./Common/Messaging/Telegram");
const CrudeTimer_1 = require("./Common/Time/CrudeTimer");
const EntityNames_1 = require("./EntityNames");
const chalk_1 = __importDefault(require("chalk"));
const log = console.log;
const entityManager = EntityManager_1.EntityManager.getInstance();
const crudeTimer = CrudeTimer_1.CrudeTimer.getInstance();
exports.SEND_MSG_IMMEDIATELY = 0.0;
exports.NO_ADDITIONAL_INFO = 0;
exports.SENDER_ID_IRRELEVANT = -1;
class MessageDispatcher {
    constructor() {
        this._priorityQ = [];
        if (MessageDispatcher._instance) {
            throw new Error("must use the getInstance.");
        }
        MessageDispatcher._instance = this;
    }
    static getInstance() {
        if (MessageDispatcher._instance === null) {
            MessageDispatcher._instance = new MessageDispatcher();
        }
        return MessageDispatcher._instance;
    }
    discharge(receiver, telegram) {
        if (!receiver.handleMessage(telegram)) {
            log('Message not handled');
        }
    }
    dispatchMessage(delay, sender, receiver, msg, extraInfo) {
        // 送信者と受信者取得
        const _sender = entityManager.getEntityFromID(sender);
        const _receiver = entityManager.getEntityFromID(receiver);
        if (!_receiver) {
            log(`警告! ${_receiver}のIDを持つレシーバーが見つかりません`);
            return;
        }
        const telegram = new Telegram_1.Telegram(0, sender, receiver, msg, extraInfo);
        if (delay <= 0.0) {
            let logMessage = `時刻${crudeTimer.currentTime}に、「${EntityNames_1.GetNameOfEntity(_sender.ID)}」から「${EntityNames_1.GetNameOfEntity(_receiver.ID)}」にインスタントTelegramが送信されました。メッセージは${MessageTypes_1.msgToStr(msg)}です。`;
            log(chalk_1.default.bgRed(logMessage));
            this.discharge(_receiver, telegram);
        }
        else {
            const currentTime = crudeTimer.currentTime;
            telegram.dispatchTime = currentTime + delay;
            this._priorityQ.unshift(telegram);
            let logMessage = `時刻${currentTime}に、「${EntityNames_1.GetNameOfEntity(_sender.ID)}」から「${EntityNames_1.GetNameOfEntity(_receiver.ID)}」に遅延Telegramが記録されました。メッセージは${MessageTypes_1.msgToStr(msg)}です。`;
            log(chalk_1.default.bgRed(logMessage));
        }
    }
    dispatchDelayedMessages() {
        const currentTime = CrudeTimer_1.CrudeTimer.getInstance().currentTime;
        // キューの有効期限を確認。過ぎていたら先頭のキューを削除
        while (this._priorityQ.length !== 0 &&
            (this._priorityQ[0].dispatchTime < currentTime) &&
            (this._priorityQ[0].dispatchTime > 0)) {
            const telegram = this._priorityQ[0];
            const _receiver = entityManager.getEntityFromID(telegram.receiver);
            const logMessage = `キューのTelegramを${EntityNames_1.GetNameOfEntity(_receiver.ID)}に送信する準備ができました。メッセージは${MessageTypes_1.msgToStr(telegram.msg)}です`;
            log(chalk_1.default.bgRed(logMessage));
            // 受信者にメッセージを送る
            this.discharge(_receiver, telegram);
            // キューからの削除
            this._priorityQ.shift();
        }
    }
}
exports.MessageDispatcher = MessageDispatcher;
MessageDispatcher._instance = null;
