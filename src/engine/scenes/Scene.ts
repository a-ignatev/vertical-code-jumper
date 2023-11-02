import { v4 as uuidv4 } from "uuid";
import { Entity } from "engine/entities/Entity";
import { Graphics } from "engine/graphics/Graphics";
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
      entityName += uuidv4();
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

  abstract attach(graphics: Graphics, payload: unknown): void;

  abstract detach(graphics: Graphics): unknown;

  afterDetach() {
    this.entities.clear();
  }
}
