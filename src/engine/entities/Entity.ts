import { v4 as uuidv4 } from "uuid";
import { Component } from "engine/components/Component";
import { Transform } from "engine/components/Transform";
import { Scene } from "engine/scenes/Scene";

export interface Context {
  delta: number;
}

type ConstructorParametersWithoutEntity<T extends new (...args: any) => any> =
  T extends new (entity: Entity, ...args: infer P) => any ? P : [];

export class Entity {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.addComponent("transform", Transform, 0, 0);
  }

  private components: Map<string, Component> = new Map();

  // eslint-disable-next-line no-unused-vars
  update(context: Context) {}

  getComponent<T extends Component>(name: string) {
    if (this.components.has(name)) {
      return this.components.get(name) as T;
    }
  }

  getComponents() {
    return this.components.values();
  }

  removeComponent(componentToRemove: Component) {
    for (const [name, entity] of this.components) {
      if (entity === componentToRemove) {
        entity.destroy();
        this.components.delete(name);

        return;
      }
    }
  }

  getTransform() {
    return this.getComponent<Transform>("transform")!;
  }

  addComponent<
    T extends new (
      entity: Entity,
      ...params: ConstructorParametersWithoutEntity<T>
    ) => Component
  >(name: string, ctor: T, ...params: ConstructorParametersWithoutEntity<T>) {
    let componentName = name;

    if (this.components.has(componentName)) {
      componentName += uuidv4();
    }

    const component = new ctor(this, ...params);
    this.components.set(componentName, component);

    return component as InstanceType<T>;
  }

  getZOrder() {
    return 0;
  }

  getScene() {
    return this.scene;
  }

  setScene(scene: Scene) {
    this.scene = scene;
  }

  destroy() {
    for (const component of this.getComponents()) {
      component.destroy();
    }
  }
}
