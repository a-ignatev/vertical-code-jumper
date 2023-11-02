import { Scene } from "./Scene";

export class SceneManager {
  private scenes: Record<string, Scene> = {};
  private currentSceneType?: string;
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  addScene(name: string, scene: Scene) {
    scene.setSceneManager(this);
    this.scenes[name] = scene;
  }

  switchScene(sceneType: string) {
    const prevScene = this.getCurrentScene();
    let payload: unknown = null;

    if (prevScene) {
      payload = prevScene.detach(this.ctx);
      prevScene.afterDetach();
    }

    this.currentSceneType = sceneType;

    this.getCurrentScene()?.attach(this.ctx, payload);
  }

  getCurrentScene() {
    if (this.currentSceneType) {
      return this.scenes[this.currentSceneType];
    }
  }

  destroy() {
    this.getCurrentScene()?.detach(this.ctx);
    this.scenes = {};
    this.currentSceneType = undefined;
  }
}
