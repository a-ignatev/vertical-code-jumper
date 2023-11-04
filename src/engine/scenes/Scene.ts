import { v4 as uuidv4 } from "uuid";
import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";
import { SceneManager } from "./SceneManager";

type ConstructorParametersWithoutNameAndScene<
  T extends new (...args: any) => any
> = T extends new (scene: Scene, ...args: infer P) => any ? P : [];

export abstract class Scene {
  private sceneManager: SceneManager;

  private entities: Map<string, Entity> = new Map();

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
  }

  getSceneManager() {
    return this.sceneManager;
  }

  // todo can limit by Entity?
  spawnEntity<
    T extends new (
      scene: Scene,
      ...params: ConstructorParametersWithoutNameAndScene<T>
    ) => Entity
  >(
    name: string,
    ctor: T,
    ...params: ConstructorParametersWithoutNameAndScene<T>
  ) {
    let entityName = name;

    if (this.entities.has(entityName)) {
      entityName += uuidv4();
    }

    const entity = new ctor(this, ...params);
    this.entities.set(entityName, entity);

    return entity as InstanceType<T>;
  }

  removeEntity(entityToRemove: Entity) {
    for (const [name, entity] of this.entities) {
      if (entity === entityToRemove) {
        entity.destroy();
        this.entities.delete(name);

        return;
      }
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
    this.entities.forEach((entity) => {
      entity.destroy();
    });

    this.entities.clear();
  }
}
