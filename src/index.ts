import { ENTITY_NAMES } from "./EntityNames"
import { Miner } from "./Miner"
import { MinersWife } from "./MinersWife"
import { MessageDispatcher } from './MessageDispatcher'
import { EntityManager } from './EntityManager'
import { CrudeTimer } from './Common/Time/CrudeTimer'

const entityManager: EntityManager = EntityManager.getInstance();
const dispatch: MessageDispatcher = MessageDispatcher.getInstance();

function sleep(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), milliseconds);
    });
}

async function main() {
    const crudeTimer: CrudeTimer = CrudeTimer.getInstance();
    const bob = new Miner(ENTITY_NAMES.ENT_MINER_BOB);
    const elsa = new MinersWife(ENTITY_NAMES.ENT_ELSA);

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