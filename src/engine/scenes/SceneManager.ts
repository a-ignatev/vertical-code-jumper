import { Graphics } from "engine/graphics/Graphics";
import { Scene } from "./Scene";

export class SceneManager {
  private scenes: Record<string, Scene> = {};
  private currentSceneType?: string;
  private graphics: Graphics;

  constructor(graphics: Graphics) {
    this.graphics = graphics;
  }

  addScene(name: string, scene: Scene) {
    scene.setSceneManager(this);
    this.scenes[name] = scene;
  }

  switchScene(sceneType: string) {
    const prevScene = this.getCurrentScene();
    let payload: unknown = null;

    if (prevScene) {
      payload = prevScene.detach(this.graphics);
      prevScene.afterDetach();
    }

    this.currentSceneType = sceneType;

    this.getCurrentScene()?.attach(this.graphics, payload);
  }

  getCurrentScene() {
    if (this.currentSceneType) {
      return this.scenes[this.currentSceneType];
    }
  }

  getGraphics() {
    return this.graphics;
  }

  destroy() {
    this.getCurrentScene()?.detach(this.graphics);
    this.scenes = {};
    this.currentSceneType = undefined;
  }
}
