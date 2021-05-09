import { BaseGameEntity } from './BaseGameEntity'

export class EntityManager {
    private static _instance: EntityManager | null = null;

    private _entityMap: Map<number, BaseGameEntity> = new Map();

    constructor() {
        if (EntityManager._instance) {
            throw new Error("must use the getInstance.");
        }
        EntityManager._instance = this;
    }

    public static getInstance(): EntityManager {
        if(EntityManager._instance === null) {
            EntityManager._instance = new EntityManager();
        }
        return EntityManager._instance;
    }

    getEntityFromID(id: number): BaseGameEntity {
        const ent = this._entityMap.get(id);

        if (!ent) {
            throw new Error("無効なID");
        }
        return ent;
    }

    removeEntity(entity: BaseGameEntity): void {
        if (this._entityMap.has(entity.ID)) {
            this._entityMap.delete(entity.ID);
        }
    }

    registerEntity(newEntity: BaseGameEntity): void {
        this._entityMap.set(newEntity.ID, newEntity);
    }
}