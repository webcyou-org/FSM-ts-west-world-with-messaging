"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityNames_1 = require("./EntityNames");
const Miner_1 = require("./Miner");
const MinersWife_1 = require("./MinersWife");
const MessageDispatcher_1 = require("./MessageDispatcher");
const EntityManager_1 = require("./EntityManager");
const CrudeTimer_1 = require("./Common/Time/CrudeTimer");
const entityManager = EntityManager_1.EntityManager.getInstance();
const dispatch = MessageDispatcher_1.MessageDispatcher.getInstance();
function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), milliseconds);
    });
}
async function main() {
    const crudeTimer = CrudeTimer_1.CrudeTimer.getInstance();
    const bob = new Miner_1.Miner(EntityNames_1.ENTITY_NAMES.ENT_MINER_BOB);
    const elsa = new MinersWife_1.MinersWife(EntityNames_1.ENTITY_NAMES.ENT_ELSA);
    entityManager.registerEntity(bob);
    entityManager.registerEntity(elsa);
    for (let i = 0; i < 30; ++i) {
        bob.update();
        elsa.update();
        // 遅延したメッセージの送信
        dispatch.dispatchDelayedMessages();
        await sleep(800);
    }
}
main();
