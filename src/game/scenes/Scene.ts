import { Entity } from "../entities/Entity";
import { SceneManager } from "./SceneManager";

export type SceneType = "intro" | "game";

export abstract class Scene {
  sceneManager?: SceneManager;

  entities: Entity[] = [];

  setSceneManager(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
  }

  abstract attach(): void;
  abstract detach(): void;
}
