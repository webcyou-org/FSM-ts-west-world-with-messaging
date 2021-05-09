import { ENTITY_NAMES } from "./EntityNames"
import { State } from './Common/FSM/State'
import { MinersWife } from './MinersWife'
import { GetNameOfEntity } from './EntityNames'
import { Telegram } from './Common/Messaging/Telegram'
import { MESSAGE_TYPE } from './MessageTypes'
import { MessageDispatcher, NO_ADDITIONAL_INFO, SEND_MSG_IMMEDIATELY } from './MessageDispatcher'
import { CrudeTimer } from './Common/Time/CrudeTimer'

import chalk from 'chalk';
const log = console.log;

const dispatch: MessageDispatcher = MessageDispatcher.getInstance();
const crudeTimer: CrudeTimer = CrudeTimer.getInstance();

export class WifesGlobalState implements State {
    private static _instance: WifesGlobalState | null = null;

    constructor() {
        if (WifesGlobalState._instance) {
            throw new Error("must use the getInstance.");
        }
        WifesGlobalState._instance = this;
    }

    public static getInstance(): WifesGlobalState {
        if(WifesGlobalState._instance === null) {
            WifesGlobalState._instance = new WifesGlobalState();
        }
        return WifesGlobalState._instance;
    }

    enter(wife: MinersWife): void {}

    execute(wife: MinersWife): void {
        if (Math.random() < 0.1) {
            wife.FSM.changeState(VisitBathroom.getInstance());
        }
    }

    exit(wife: MinersWife): void {}

    onMessage(wife: MinersWife, msg: Telegram): boolean {
        switch (msg.msg) {
            case MESSAGE_TYPE.MSG_HI_HONEY_IM_HOME:
                let logMessage = `時刻${crudeTimer.currentTime}にメッセージが${GetNameOfEntity(wife.ID)}に受信されました`;
                log(chalk.bgRed(logMessage));
                log(chalk`{green ${GetNameOfEntity(wife.ID)}: あなた〜。あなたにおいしい自慢のシチューを作るわ}`);

                wife.FSM.changeState(CookStew.getInstance());
                return true;
        }
        return false;
    }
}

export class DoHouseWork implements State {
    private static _instance: DoHouseWork | null = null;

    constructor() {
        if (DoHouseWork._instance) {
            throw new Error("must use the getInstance.");
        }
        DoHouseWork._instance = this;
    }

    public static getInstance(): DoHouseWork {
        if(DoHouseWork._instance === null) {
            DoHouseWork._instance = new DoHouseWork();
        }
        return DoHouseWork._instance;
    }

    enter(wife: MinersWife): void {}

    execute(wife: MinersWife): void {
        switch (Math.floor(Math.random()* 3)) {
            case 0:
                log(chalk`{green ${GetNameOfEntity(wife.ID)}: 床掃除をしています}`);
                break;
            case 1:
                log(chalk`{green ${GetNameOfEntity(wife.ID)}: 皿を洗っています}`);
                break;
            case 2:
                log(chalk`{green ${GetNameOfEntity(wife.ID)}: ベッドの用意をしています}`);
                break;
        }
    }

    exit(wife: MinersWife): void {}

    onMessage(miner: MinersWife, msg: Telegram): boolean {
        return false;
    }
}

export class VisitBathroom implements State {
    private static _instance: VisitBathroom | null = null;

    constructor() {
        if (VisitBathroom._instance) {
            throw new Error("must use the getInstance.");
        }
        VisitBathroom._instance = this;
    }

    public static getInstance(): VisitBathroom {
        if(VisitBathroom._instance === null) {
            VisitBathroom._instance = new VisitBathroom();
        }
        return VisitBathroom._instance;
    }

    enter(wife: MinersWife): void {
        log(chalk`{green ${GetNameOfEntity(wife.ID)}: トイレに向かって歩いています。ちょっとお化粧を直してきます}`);
    }

    execute(wife: MinersWife): void {
        log(chalk`{green ${GetNameOfEntity(wife.ID)}: あああ！ すっきりした！}`);
        wife.FSM.revertToPreviousState();
    }

    exit(wife: MinersWife): void {
        log(chalk`{green ${GetNameOfEntity(wife.ID)}: トイレから離れています}`);
    }

    onMessage(miner: MinersWife, msg: Telegram): boolean {
        return false;
    }
}

export class CookStew implements State {
    private static _instance: CookStew | null = null;

    constructor() {
        if (CookStew._instance) {
            throw new Error("must use the getInstance.");
        }
        CookStew._instance = this;
    }

    public static getInstance(): CookStew {
        if(CookStew._instance === null) {
            CookStew._instance = new CookStew();
        }
        return CookStew._instance;
    }

    enter(wife: MinersWife): void {
        // if not already cooking put the stew in the oven
        if (!wife.cooking) {
            log(chalk`{green ${GetNameOfEntity(wife.ID)}: シチューをオーブンに入れます}`);

            //send a delayed message myself so that I know when to take the stew
            //out of the oven
            dispatch.dispatchMessage(1.5, wife.ID, wife.ID, MESSAGE_TYPE.MSG_STEW_READY, NO_ADDITIONAL_INFO);
            wife.cooking = true;
        }

        log(chalk`{green ${GetNameOfEntity(wife.ID)}: トイレに向かって歩いています。ちょっとお化粧を直してきます}`);
    }

    execute(wife: MinersWife): void {
        log(chalk`{green ${GetNameOfEntity(wife.ID)}: 煮込みすぎないようにしなきゃ}`);
    }

    exit(wife: MinersWife): void {
        log(chalk`{green ${GetNameOfEntity(wife.ID)}: シチューをテーブルの上に乗せる}`);
    }

    onMessage(wife: MinersWife, msg: Telegram): boolean {
        switch(msg.msg) {
            case MESSAGE_TYPE.MSG_STEW_READY:
                const logMessage = `時刻${crudeTimer.currentTime}にメッセージが${GetNameOfEntity(wife.ID)}に受信されました`;
                log(chalk.bgRed(logMessage));
                log(chalk`{green ${GetNameOfEntity(wife.ID)}: シチューができたわよ！食べましょう}`);

                dispatch.dispatchMessage(
                    SEND_MSG_IMMEDIATELY,
                    wife.ID,
                    ENTITY_NAMES.ENT_MINER_BOB,
                    MESSAGE_TYPE.MSG_STEW_READY,
                    NO_ADDITIONAL_INFO
                );

                wife.cooking = false;
                wife.FSM.changeState(DoHouseWork.getInstance());

                return true;
        }
        return false;
    }
}