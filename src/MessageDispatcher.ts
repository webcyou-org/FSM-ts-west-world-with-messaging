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
            // telegram could not be handled
            log('Message not handled');
        }
    }

    dispatchMessage(delay: number, sender: number, receiver: number, msg: number, extraInfo: any) {
        // SetTextColor(BACKGROUND_RED|FOREGROUND_RED|FOREGROUND_GREEN|FOREGROUND_BLUE);

        //get pointers to the sender and receiver
        const _sender: BaseGameEntity = entityManager.getEntityFromID(sender);
        const _receiver: BaseGameEntity = entityManager.getEntityFromID(receiver);

        //make sure the receiver is valid
        if (!_receiver) {
            // cout << "\nWarning! No Receiver with ID of " << receiver << " found";
            log(`Warning! No Receiver with ID of ${_receiver} found`);
            return;
        }

        //create the telegram
        const telegram: Telegram = new Telegram(0, sender, receiver, msg, extraInfo);
        // if there is no delay, route telegram immediately
        if (delay <= 0.0) {
            log(`Instant telegram dispatched at time: ${crudeTimer.currentTime} by ${GetNameOfEntity(_sender.ID)} for ${GetNameOfEntity(_receiver.ID)}. Msg is ${msgToStr(msg)}`);

            // send the telegram to the recipient
            this.discharge(_receiver, telegram);
        } else {
            const currentTime: number = crudeTimer.currentTime;
            telegram.dispatchTime = currentTime + delay;

            //and put it in the queue
            this._priorityQ.unshift(telegram);
            log(`Delayed telegram from ${GetNameOfEntity(_sender.ID)} recorded at time ${currentTime} for ${GetNameOfEntity(_receiver.ID)}. Msg is ${msgToStr(msg)}`)
        }
    }

    dispatchDelayedMessages() {
        // SetTextColor(BACKGROUND_RED|FOREGROUND_RED|FOREGROUND_GREEN|FOREGROUND_BLUE);
        // get current time
        const currentTime: number = CrudeTimer.getInstance().currentTime;

        // now peek at the queue to see if any telegrams need dispatching.
        // remove all telegrams from the front of the queue that have gone
        // past their sell by date
        while(
            this._priorityQ.length !== 0 &&
            (this._priorityQ[0].dispatchTime < currentTime) &&
            (this._priorityQ[0].dispatchTime > 0)
            )
        {
            // read the telegram from the front of the queue
            const telegram = this._priorityQ[0];

            // find the recipient
            const _receiver: BaseGameEntity = entityManager.getEntityFromID(telegram.receiver);

            log(`Queued telegram ready for dispatch: Sent to ${GetNameOfEntity(_receiver.ID)}. Msg is ${msgToStr(telegram.msg)}`)

            // send the telegram to the recipient
            this.discharge(_receiver, telegram);
            // remove it from the queue
            this._priorityQ.shift();
        }
    }
}