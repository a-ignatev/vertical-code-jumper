import { Scene } from "./Scene";
import { SceneType } from "./Scene";

export class SceneManager {
  private scenes: Record<string, Scene> = {};
  private currentSceneType?: SceneType;

  addScene(name: SceneType, scene: Scene) {
    scene.setSceneManager(this);
    this.scenes[name] = scene;
  }

  switchScene(sceneType: SceneType) {
    const prevScene = this.getScene();
    let payload: unknown = null;

    if (prevScene) {
      payload = prevScene.detach();
    }

    this.currentSceneType = sceneType;

    this.getScene()?.attach(payload);
  }

  getScene() {
    if (this.currentSceneType) {
      return this.scenes[this.currentSceneType];
    }
  }
}
