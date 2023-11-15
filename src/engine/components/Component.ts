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

  getWorldPosition() {
    return {
      x: this.entity.getTransform().getPosition().x + this.pivot.x,
      y: this.entity.getTransform().getPosition().y + this.pivot.y,
    };
  }

  abstract destroy(): void;
}
