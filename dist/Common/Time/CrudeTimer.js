"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudeTimer = void 0;
class CrudeTimer {
    constructor() {
        if (CrudeTimer._instance) {
            throw new Error("must use the getInstance.");
        }
        this._startTime = Date.now();
        CrudeTimer._instance = this;
    }
    static getInstance() {
        if (CrudeTimer._instance === null) {
            CrudeTimer._instance = new CrudeTimer();
        }
        return CrudeTimer._instance;
    }
    get currentTime() {
        return (Date.now() - this._startTime) * 0.001;
    }
}
exports.CrudeTimer = CrudeTimer;
CrudeTimer._instance = null;
