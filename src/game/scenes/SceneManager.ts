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
    console.log("switching!");
    const prevScene = this.getScene();
    if (prevScene) {
      prevScene.detach();
    }

    this.currentSceneType = sceneType;

    this.getScene()?.attach();
  }

  getScene() {
    if (this.currentSceneType) {
      return this.scenes[this.currentSceneType];
    }
  }
}
