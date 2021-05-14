"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgToStr = exports.MESSAGE_TYPE = void 0;
var MESSAGE_TYPE;
(function (MESSAGE_TYPE) {
    MESSAGE_TYPE[MESSAGE_TYPE["MSG_HI_HONEY_IM_HOME"] = 0] = "MSG_HI_HONEY_IM_HOME";
    MESSAGE_TYPE[MESSAGE_TYPE["MSG_STEW_READY"] = 1] = "MSG_STEW_READY";
})(MESSAGE_TYPE = exports.MESSAGE_TYPE || (exports.MESSAGE_TYPE = {}));
function msgToStr(msg) {
    switch (msg) {
        case MESSAGE_TYPE.MSG_HI_HONEY_IM_HOME:
            return 'HiHoneyImHome';
        case MESSAGE_TYPE.MSG_STEW_READY:
            return 'StewReady';
        default:
            return 'Not recognized!';
    }
}
exports.msgToStr = msgToStr;
