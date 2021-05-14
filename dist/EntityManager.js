"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
class EntityManager {
    constructor() {
        this._entityMap = new Map();
        if (EntityManager._instance) {
            throw new Error("must use the getInstance.");
        }
        EntityManager._instance = this;
    }
    static getInstance() {
        if (EntityManager._instance === null) {
            EntityManager._instance = new EntityManager();
        }
        return EntityManager._instance;
    }
    getEntityFromID(id) {
        const ent = this._entityMap.get(id);
        if (!ent) {
            throw new Error("無効なID");
        }
        return ent;
    }
    removeEntity(entity) {
        if (this._entityMap.has(entity.ID)) {
            this._entityMap.delete(entity.ID);
        }
    }
    registerEntity(newEntity) {
        this._entityMap.set(newEntity.ID, newEntity);
    }
}
exports.EntityManager = EntityManager;
EntityManager._instance = null;
