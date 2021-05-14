"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EatStew = exports.QuenchThirst = exports.GoHomeAndSleepTilRested = exports.VisitBankAndDepositGold = exports.EnterMineAndDigForNugget = void 0;
const EntityNames_1 = require("./EntityNames");
const Miner_1 = require("./Miner");
const Locations_1 = require("./Locations");
const EntityNames_2 = require("./EntityNames");
const MessageTypes_1 = require("./MessageTypes");
const MessageDispatcher_1 = require("./MessageDispatcher");
const CrudeTimer_1 = require("./Common/Time/CrudeTimer");
const chalk_1 = __importDefault(require("chalk"));
const log = console.log;
const dispatch = MessageDispatcher_1.MessageDispatcher.getInstance();
const crudeTimer = CrudeTimer_1.CrudeTimer.getInstance();
// 金鉱に入り金塊を掘る
class EnterMineAndDigForNugget {
    constructor() {
        if (EnterMineAndDigForNugget._instance) {
            throw new Error("must use the getInstance.");
        }
        EnterMineAndDigForNugget._instance = this;
    }
    static getInstance() {
        if (EnterMineAndDigForNugget._instance === null) {
            EnterMineAndDigForNugget._instance = new EnterMineAndDigForNugget();
        }
        return EnterMineAndDigForNugget._instance;
    }
    enter(miner) {
        // 鉱夫がまだ金鉱にいない場合は、場所を金鉱に変えなければいけない
        if (miner.location != Locations_1.LOCATION_TYPE.GOLDMINE) {
            log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 金鉱に向かって歩いています}`);
            miner.changeLocation = Locations_1.LOCATION_TYPE.GOLDMINE;
        }
    }
    execute(miner) {
        // 鉱夫が、MaxNuggets値を超える金塊を運べるようになるまで金を掘る。
        // 鉱夫が、掘っている途中で喉の渇きを覚えたら、作業を止めてステートを変更し、ウイスキーを飲みに酒場へ行く
        miner.addToGoldCarried(1);
        miner.increaseFatigue();
        log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 金塊を拾ってます}`);
        // 十分金を掘ったら、銀行に行って預ける
        if (miner.isPocketsFull()) {
            miner.FSM.changeState(VisitBankAndDepositGold.getInstance());
        }
        if (miner.thirsty()) {
            miner.FSM.changeState(QuenchThirst.getInstance());
        }
    }
    exit(miner) {
        log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 金塊でポケットを一杯にして金鉱から離れています}`);
    }
    onMessage(miner, msg) {
        return false;
    }
}
exports.EnterMineAndDigForNugget = EnterMineAndDigForNugget;
EnterMineAndDigForNugget._instance = null;
// 銀行を訪れ金を預ける
class VisitBankAndDepositGold {
    constructor() {
        if (VisitBankAndDepositGold._instance) {
            throw new Error("must use the getInstance.");
        }
        VisitBankAndDepositGold._instance = this;
    }
    static getInstance() {
        if (VisitBankAndDepositGold._instance === null) {
            VisitBankAndDepositGold._instance = new VisitBankAndDepositGold();
        }
        return VisitBankAndDepositGold._instance;
    }
    enter(miner) {
        if (miner.location != Locations_1.LOCATION_TYPE.BANK) {
            log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 銀行に向かいます。イエッサー}`);
            miner.changeLocation = Locations_1.LOCATION_TYPE.BANK;
        }
    }
    execute(miner) {
        // 金を預ける
        miner.addToWealth(miner.goldCarried);
        miner.goldCarried = 0;
        const message = `${EntityNames_2.GetNameOfEntity(miner.ID)}: 金を預けています。現在預けている合計: ${miner.wealth()}`;
        log(chalk_1.default `{red ${message}}`);
        // リッチな状態であれば、休息をとる
        if (miner.wealth() >= Miner_1.COMFORT_LEVEL) {
            log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: うおー！今日はもう十分稼いだ。可愛い奥さんがいる家へ帰ろう}`);
            miner.FSM.changeState(GoHomeAndSleepTilRested.getInstance());
        }
        else {
            miner.FSM.changeState(EnterMineAndDigForNugget.getInstance());
        }
    }
    exit(miner) {
        log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 銀行から離れています}`);
    }
    onMessage(miner, msg) {
        return false;
    }
}
exports.VisitBankAndDepositGold = VisitBankAndDepositGold;
VisitBankAndDepositGold._instance = null;
// 家に帰って疲れが取れるまで眠る
class GoHomeAndSleepTilRested {
    constructor() {
        if (GoHomeAndSleepTilRested._instance) {
            throw new Error("must use the getInstance.");
        }
        GoHomeAndSleepTilRested._instance = this;
    }
    static getInstance() {
        if (GoHomeAndSleepTilRested._instance === null) {
            GoHomeAndSleepTilRested._instance = new GoHomeAndSleepTilRested();
        }
        return GoHomeAndSleepTilRested._instance;
    }
    enter(miner) {
        if (miner.location != Locations_1.LOCATION_TYPE.SHACK) {
            log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 家に向かっています}`);
            miner.changeLocation = Locations_1.LOCATION_TYPE.SHACK;
            dispatch.dispatchMessage(MessageDispatcher_1.SEND_MSG_IMMEDIATELY, miner.ID, EntityNames_1.ENTITY_NAMES.ENT_ELSA, MessageTypes_1.MESSAGE_TYPE.MSG_HI_HONEY_IM_HOME, MessageDispatcher_1.NO_ADDITIONAL_INFO);
        }
    }
    execute(miner) {
        // 鉱夫が疲れていなければ、再び金を掘り始める
        if (!miner.isFatigued()) {
            log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: なんてすばらしい昼寝だったんだろう！もっと金を探す時間だ}`);
            miner.FSM.changeState(EnterMineAndDigForNugget.getInstance());
        }
        else {
            miner.decreaseFatigue();
            log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: グーグーグー}`);
        }
    }
    exit(miner) {
        log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 家から離れています}`);
    }
    onMessage(miner, msg) {
        switch (msg.msg) {
            case MessageTypes_1.MESSAGE_TYPE.MSG_STEW_READY:
                let logMessage = `時刻${crudeTimer.currentTime}にメッセージが${EntityNames_2.GetNameOfEntity(miner.ID)}に受信されました`;
                log(chalk_1.default.bgRed(logMessage));
                log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: OK。今行くよ！}`);
                miner.FSM.changeState(EatStew.getInstance());
                return true;
        }
        return false;
    }
}
exports.GoHomeAndSleepTilRested = GoHomeAndSleepTilRested;
GoHomeAndSleepTilRested._instance = null;
// 喉の乾きを癒す
class QuenchThirst {
    constructor() {
        if (QuenchThirst._instance) {
            throw new Error("must use the getInstance.");
        }
        QuenchThirst._instance = this;
    }
    static getInstance() {
        if (QuenchThirst._instance === null) {
            QuenchThirst._instance = new QuenchThirst();
        }
        return QuenchThirst._instance;
    }
    enter(miner) {
        if (miner.location != Locations_1.LOCATION_TYPE.SALOON) {
            miner.changeLocation = Locations_1.LOCATION_TYPE.SALOON;
            log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: アアのどが渇いた！ 酒場に向かって歩いています}`);
        }
    }
    execute(miner) {
        if (miner.thirsty()) {
            miner.buyAndDrinkAWhiskey();
            log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: こいつはとびきり旨い酒だ}`);
            miner.FSM.changeState(EnterMineAndDigForNugget.getInstance());
        }
        else {
            log(chalk_1.default `{red \nERROR!\nERROR!\nERROR!}`);
        }
    }
    exit(miner) {
        log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 酒場を離れています。良い気分です}`);
    }
    onMessage(miner, msg) {
        return false;
    }
}
exports.QuenchThirst = QuenchThirst;
QuenchThirst._instance = null;
class EatStew {
    constructor() {
        if (EatStew._instance) {
            throw new Error("must use the getInstance.");
        }
        EatStew._instance = this;
    }
    static getInstance() {
        if (EatStew._instance === null) {
            EatStew._instance = new EatStew();
        }
        return EatStew._instance;
    }
    enter(miner) {
        log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 本当に良い匂いだ、エルザ！}`);
    }
    execute(miner) {
        log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 本当においしいな！}`);
        miner.FSM.revertToPreviousState();
    }
    exit(miner) {
        log(chalk_1.default `{red ${EntityNames_2.GetNameOfEntity(miner.ID)}: 本当にありがとう。帰ってきてよかったよ}`);
    }
    onMessage(miner, msg) {
        return false;
    }
}
exports.EatStew = EatStew;
EatStew._instance = null;
