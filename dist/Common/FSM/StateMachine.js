"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = void 0;
class StateMachine {
    constructor(owner) {
        this._currentState = null;
        // エージェントの直前のステートの記録
        this._previousState = null;
        // FSMが更新されるたびに呼ばれる
        this._globalState = null;
        this._owner = owner;
    }
    // FSMの初期化
    set currentState(state) {
        this._currentState = state;
    }
    set globalState(state) {
        this._globalState = state;
    }
    set previousState(state) {
        this._previousState = state;
    }
    get currentState() {
        return this._currentState;
    }
    get globalState() {
        return this._globalState;
    }
    get previousState() {
        return this._previousState;
    }
    // FSMの更新するときにこれを呼ぶ
    update() {
        // グローバルステートがあるなら、そのメソッドを実行する
        if (this._globalState)
            this._globalState.execute(this._owner);
        // 現在のステートと同じ
        if (this._currentState)
            this._currentState.execute(this._owner);
    }
    handleMessage(msg) {
        // _currentStateと_globalStateの有効性確認
        return Boolean(this._currentState) && this._currentState.onMessage(this._owner, msg) ||
            Boolean(this._globalState) && this._globalState.onMessage(this._owner, msg);
    }
    // 新しいステートに変更
    changeState(newState) {
        if (!newState || !this._currentState) {
            throw new Error("NULLステートに変更しようとしています");
        }
        // 以前のステートを記録する
        this._previousState = this._currentState;
        // 存在するステートの終了メソッドを呼ぶ
        this._currentState.exit(this._owner);
        // 新しいステートに変更
        this._currentState = newState;
        // 新しいステートの開始メソッドを呼ぶ
        this._currentState.enter(this._owner);
    }
    // 以前のステートに変更する
    revertToPreviousState() {
        if (!this._previousState)
            return;
        this.changeState(this._previousState);
    }
    // 現在のステートの型とパラメータで渡されたクラスの型が同じならtrueを返す
    isInState(st) {
        return this._currentState instanceof st;
    }
}
exports.StateMachine = StateMachine;
