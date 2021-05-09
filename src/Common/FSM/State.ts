import { Miner } from '../../Miner'
import { MinersWife } from '../../MinersWife'
import { Telegram } from '../Messaging/Telegram'

export interface State {
    enter(miner: Miner | MinersWife): void;
    execute(miner: Miner | MinersWife): void;
    exit(miner: Miner | MinersWife): void;
    onMessage(miner: Miner | MinersWife, msg: Telegram): boolean;
}