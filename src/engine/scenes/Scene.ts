import { Entity } from "engine/entities/Entity";
import { SceneManager } from "./SceneManager";

export type SceneType = "intro" | "game" | "gameOver";

export abstract class Scene {
  protected sceneManager?: SceneManager;

  private entities: Entity[] = [];

  setSceneManager(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
  }

  getSceneManager() {
    return this.sceneManager;
  }

  setEntities(entities: Entity[]) {
    entities.forEach((entity) => entity.setScene(this));
    this.entities = entities;
  }

  getEntities() {
    return this.entities;
  }

  abstract attach(ctx: CanvasRenderingContext2D, payload: unknown): void;
  abstract detach(): unknown;
}
