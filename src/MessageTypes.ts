export enum MESSAGE_TYPE {
    MSG_HI_HONEY_IM_HOME,
    MSG_STEW_READY,
}

export function msgToStr(msg: number) {
    switch (msg) {
        case MESSAGE_TYPE.MSG_HI_HONEY_IM_HOME:
            return 'HiHoneyImHome';
        case MESSAGE_TYPE.MSG_STEW_READY:
            return 'StewReady';
        default:
            return 'Not recognized!';
    }
}