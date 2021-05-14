"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinersWife = void 0;
const BaseGameEntity_1 = require("./BaseGameEntity");
const StateMachine_1 = require("./Common/FSM/StateMachine");
const Locations_1 = require("./Locations");
const MinersWifeOwnedStates_1 = require("./MinersWifeOwnedStates");
class MinersWife extends BaseGameEntity_1.BaseGameEntity {
    constructor(id) {
        super(id);
        this._cooking = false;
        this._location = Locations_1.LOCATION_TYPE.SHACK;
        this._stateMachine = new StateMachine_1.StateMachine(this);
        this._stateMachine.currentState = MinersWifeOwnedStates_1.DoHouseWork.getInstance();
        this._stateMachine.globalState = MinersWifeOwnedStates_1.WifesGlobalState.getInstance();
    }
    get FSM() {
        return this._stateMachine;
    }
    get location() {
        return this._location;
    }
    set changeLocation(location) {
        this._location = location;
    }
    update() {
        this._stateMachine.update();
    }
    get cooking() {
        return this._cooking;
    }
    set cooking(val) {
        this._cooking = val;
    }
    handleMessage(msg) {
        return this._stateMachine.handleMessage(msg);
    }
}
exports.MinersWife = MinersWife;
