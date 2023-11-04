import { Entity } from "engine/entities/Entity";

export abstract class Component {
  private entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  // todo refactor
  public pivot: { x: number; y: number } = { x: 0, y: 0 };

  getEntity() {
    return this.entity;
  }

  abstract destroy(): void;
}
