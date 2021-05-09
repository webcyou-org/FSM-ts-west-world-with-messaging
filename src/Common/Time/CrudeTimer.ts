export class CrudeTimer {
    private static _instance: CrudeTimer | null = null;

    private _startTime: number;

    constructor() {
        if (CrudeTimer._instance) {
            throw new Error("must use the getInstance.");
        }
        this._startTime = Date.now();
        CrudeTimer._instance = this;
    }

    public static getInstance(): CrudeTimer {
        if(CrudeTimer._instance === null) {
            CrudeTimer._instance = new CrudeTimer();
        }
        return CrudeTimer._instance;
    }

    get currentTime(): number {
        return (Date.now() - this._startTime) * 0.001;
    }
}