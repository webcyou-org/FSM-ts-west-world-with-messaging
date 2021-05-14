"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookStew = exports.VisitBathroom = exports.DoHouseWork = exports.WifesGlobalState = void 0;
const EntityNames_1 = require("./EntityNames");
const EntityNames_2 = require("./EntityNames");
const MessageTypes_1 = require("./MessageTypes");
const MessageDispatcher_1 = require("./MessageDispatcher");
const CrudeTimer_1 = require("./Common/Time/CrudeTimer");
const chalk_1 = __importDefault(require("chalk"));
const log = console.log;
const dispatch = MessageDispatcher_1.MessageDispatcher.getInstance();
const crudeTimer = CrudeTimer_1.CrudeTimer.getInstance();
class WifesGlobalState {
    constructor() {
        if (WifesGlobalState._instance) {
            throw new Error("must use the getInstance.");
        }
        WifesGlobalState._instance = this;
    }
    static getInstance() {
        if (WifesGlobalState._instance === null) {
            WifesGlobalState._instance = new WifesGlobalState();
        }
        return WifesGlobalState._instance;
    }
    enter(wife) { }
    execute(wife) {
        if (Math.random() < 0.1) {
            wife.FSM.changeState(VisitBathroom.getInstance());
        }
    }
    exit(wife) { }
    onMessage(wife, msg) {
        switch (msg.msg) {
            case MessageTypes_1.MESSAGE_TYPE.MSG_HI_HONEY_IM_HOME:
                let logMessage = `時刻${crudeTimer.currentTime}にメッセージが${EntityNames_2.GetNameOfEntity(wife.ID)}に受信されました`;
                log(chalk_1.default.bgRed(logMessage));
                log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: あなた〜。あなたにおいしい自慢のシチューを作るわ}`);
                wife.FSM.changeState(CookStew.getInstance());
                return true;
        }
        return false;
    }
}
exports.WifesGlobalState = WifesGlobalState;
WifesGlobalState._instance = null;
class DoHouseWork {
    constructor() {
        if (DoHouseWork._instance) {
            throw new Error("must use the getInstance.");
        }
        DoHouseWork._instance = this;
    }
    static getInstance() {
        if (DoHouseWork._instance === null) {
            DoHouseWork._instance = new DoHouseWork();
        }
        return DoHouseWork._instance;
    }
    enter(wife) { }
    execute(wife) {
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: 床掃除をしています}`);
                break;
            case 1:
                log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: 皿を洗っています}`);
                break;
            case 2:
                log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: ベッドの用意をしています}`);
                break;
        }
    }
    exit(wife) { }
    onMessage(miner, msg) {
        return false;
    }
}
exports.DoHouseWork = DoHouseWork;
DoHouseWork._instance = null;
class VisitBathroom {
    constructor() {
        if (VisitBathroom._instance) {
            throw new Error("must use the getInstance.");
        }
        VisitBathroom._instance = this;
    }
    static getInstance() {
        if (VisitBathroom._instance === null) {
            VisitBathroom._instance = new VisitBathroom();
        }
        return VisitBathroom._instance;
    }
    enter(wife) {
        log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: トイレに向かって歩いています。ちょっとお化粧を直してきます}`);
    }
    execute(wife) {
        log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: あああ！ すっきりした！}`);
        wife.FSM.revertToPreviousState();
    }
    exit(wife) {
        log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: トイレから離れています}`);
    }
    onMessage(miner, msg) {
        return false;
    }
}
exports.VisitBathroom = VisitBathroom;
VisitBathroom._instance = null;
class CookStew {
    constructor() {
        if (CookStew._instance) {
            throw new Error("must use the getInstance.");
        }
        CookStew._instance = this;
    }
    static getInstance() {
        if (CookStew._instance === null) {
            CookStew._instance = new CookStew();
        }
        return CookStew._instance;
    }
    enter(wife) {
        // シチューをまだ作っていない場合は、オーブンに入れる。
        if (!wife.cooking) {
            log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: シチューをオーブンに入れます}`);
            // オーブンからシチューを取り出すタイミングを知るために、自分で遅延メッセージを送る。
            dispatch.dispatchMessage(1.5, wife.ID, wife.ID, MessageTypes_1.MESSAGE_TYPE.MSG_STEW_READY, MessageDispatcher_1.NO_ADDITIONAL_INFO);
            wife.cooking = true;
        }
        log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: トイレに向かって歩いています。ちょっとお化粧を直してきます}`);
    }
    execute(wife) {
        log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: 煮込みすぎないようにしなきゃ}`);
    }
    exit(wife) {
        log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: シチューをテーブルの上に乗せる}`);
    }
    onMessage(wife, msg) {
        switch (msg.msg) {
            case MessageTypes_1.MESSAGE_TYPE.MSG_STEW_READY:
                const logMessage = `時刻${crudeTimer.currentTime}にメッセージが${EntityNames_2.GetNameOfEntity(wife.ID)}に受信されました`;
                log(chalk_1.default.bgRed(logMessage));
                log(chalk_1.default `{green ${EntityNames_2.GetNameOfEntity(wife.ID)}: シチューができたわよ！食べましょう}`);
                dispatch.dispatchMessage(MessageDispatcher_1.SEND_MSG_IMMEDIATELY, wife.ID, EntityNames_1.ENTITY_NAMES.ENT_MINER_BOB, MessageTypes_1.MESSAGE_TYPE.MSG_STEW_READY, MessageDispatcher_1.NO_ADDITIONAL_INFO);
                wife.cooking = false;
                wife.FSM.changeState(DoHouseWork.getInstance());
                return true;
        }
        return false;
    }
}
exports.CookStew = CookStew;
CookStew._instance = null;
