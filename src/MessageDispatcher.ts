import { BaseGameEntity } from './BaseGameEntity'
import { EntityManager } from './EntityManager'
import { msgToStr } from './MessageTypes'

import { Telegram } from './Common/Messaging/Telegram'
import { CrudeTimer } from './Common/Time/CrudeTimer'
import { GetNameOfEntity } from './EntityNames'

import chalk from 'chalk';
const log = console.log;
const entityManager: EntityManager = EntityManager.getInstance();
const crudeTimer: CrudeTimer = CrudeTimer.getInstance();

export const SEND_MSG_IMMEDIATELY: number = 0.0;
export const NO_ADDITIONAL_INFO: number   = 0;
export const SENDER_ID_IRRELEVANT: number = -1;

export class MessageDispatcher {
    private static _instance: MessageDispatcher | null = null;

    private _priorityQ: Telegram[] = [];

    constructor() {
        if (MessageDispatcher._instance) {
            throw new Error("must use the getInstance.");
        }
        MessageDispatcher._instance = this;
    }

    public static getInstance():MessageDispatcher {
        if(MessageDispatcher._instance === null) {
            MessageDispatcher._instance = new MessageDispatcher();
        }
        return MessageDispatcher._instance;
    }

    private discharge(receiver: BaseGameEntity, telegram: Telegram) {
        if (!receiver.handleMessage(telegram)) {
            log('Message not handled');
        }
    }

    dispatchMessage(delay: number, sender: number, receiver: number, msg: number, extraInfo: any) {
        // 送信者と受信者取得
        const _sender: BaseGameEntity = entityManager.getEntityFromID(sender);
        const _receiver: BaseGameEntity = entityManager.getEntityFromID(receiver);

        if (!_receiver) {
            log(`警告! ${_receiver}のIDを持つレシーバーが見つかりません`);
            return;
        }

        const telegram: Telegram = new Telegram(0, sender, receiver, msg, extraInfo);

        if (delay <= 0.0) {
            let logMessage = `時刻${crudeTimer.currentTime}に、「${GetNameOfEntity(_sender.ID)}」から「${GetNameOfEntity(_receiver.ID)}」にインスタントTelegramが送信されました。メッセージは${msgToStr(msg)}です。`
            log(chalk.bgRed(logMessage));

            this.discharge(_receiver, telegram);
        } else {
            const currentTime: number = crudeTimer.currentTime;
            telegram.dispatchTime = currentTime + delay;

            this._priorityQ.unshift(telegram);
            let logMessage = `時刻${currentTime}に、「${GetNameOfEntity(_sender.ID)}」から「${GetNameOfEntity(_receiver.ID)}」に遅延Telegramが記録されました。メッセージは${msgToStr(msg)}です。`;
            log(chalk.bgRed(logMessage));
        }
    }

    dispatchDelayedMessages() {
        const currentTime: number = CrudeTimer.getInstance().currentTime;

        // キューの有効期限を確認。過ぎていたら先頭のキューを削除
        while(
            this._priorityQ.length !== 0 &&
            (this._priorityQ[0].dispatchTime < currentTime) &&
            (this._priorityQ[0].dispatchTime > 0)
            )
        {
            const telegram = this._priorityQ[0];

            const _receiver: BaseGameEntity = entityManager.getEntityFromID(telegram.receiver);
            const logMessage = `キューのTelegramを${GetNameOfEntity(_receiver.ID)}に送信する準備ができました。メッセージは${msgToStr(telegram.msg)}です`;
            log(chalk.bgRed(logMessage));

            // 受信者にメッセージを送る
            this.discharge(_receiver, telegram);
            // キューからの削除
            this._priorityQ.shift();
        }
    }
}