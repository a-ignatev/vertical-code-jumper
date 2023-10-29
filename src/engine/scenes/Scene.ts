import { Entity } from "engine/entities/Entity";
import { SceneManager } from "./SceneManager";

export abstract class Scene {
  // must be set by the manager
  private sceneManager!: SceneManager;

  private entities: Map<string, Entity> = new Map();

  setSceneManager(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
  }

  getSceneManager() {
    return this.sceneManager;
  }

  addEntity(name: string, entity: Entity) {
    let entityName = name;

    if (this.entities.has(entityName)) {
      entityName += Math.random().toString();
    }

    entity.name = entityName;
    entity.setScene(this);
    this.entities.set(entityName, entity);
  }

  removeEntity(entity: Entity) {
    if (this.entities.has(entity.name)) {
      this.entities.delete(entity.name);
    }
  }

  getEntities() {
    return this.entities.values();
  }

  getEntity<T extends Entity>(name: string): T | undefined {
    return this.entities.get(name) as T;
  }

  abstract attach(ctx: CanvasRenderingContext2D, payload: unknown): void;
  abstract detach(): unknown;
}
