import { BaseGameEntity } from './BaseGameEntity'
import { StateMachine } from './Common/FSM/StateMachine'
import { LOCATION_TYPE } from './Locations'
import { DoHouseWork, WifesGlobalState } from './MinersWifeOwnedStates'
import { Telegram } from './Common/Messaging/Telegram'

export class MinersWife extends BaseGameEntity {
    private _stateMachine: StateMachine;
    private _location: LOCATION_TYPE;
    private _cooking: boolean = false;

    constructor(id: number) {
        super(id);

        this._location = LOCATION_TYPE.SHACK;
        this._stateMachine = new StateMachine(this);
        this._stateMachine.currentState = DoHouseWork.getInstance();
        this._stateMachine.globalState = WifesGlobalState.getInstance();
    }

    get FSM(): StateMachine {
        return this._stateMachine;
    }

    get location(): LOCATION_TYPE {
        return this._location
    }

    set changeLocation(location: LOCATION_TYPE) {
        this._location = location;
    }

    update(): void {
        this._stateMachine.update();
    }

    get cooking(): boolean {
        return this._cooking;
    }

    set cooking(val: boolean) {
        this._cooking = val;
    }

    handleMessage(msg: Telegram): boolean {
        return this._stateMachine!.handleMessage(msg);
    }
}