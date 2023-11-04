import { Graphics } from "engine/core/Graphics";
import { Scene } from "./Scene";

type ConstructorParametersWithoutNameSceneManager<
  T extends new (...args: any) => any
> = T extends new (sceneManager: SceneManager, ...args: infer P) => any
  ? P
  : [];

export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private currentSceneName?: string;
  private graphics: Graphics;

  constructor(graphics: Graphics) {
    this.graphics = graphics;
  }

  // todo can limit by Entity?
  addScene<
    T extends new (
      sceneManager: SceneManager,
      ...params: ConstructorParametersWithoutNameSceneManager<T>
    ) => Scene
  >(
    name: string,
    ctor: T,
    ...params: ConstructorParametersWithoutNameSceneManager<T>
  ) {
    const scene = new ctor(this, ...params);

    this.scenes.set(name, scene);

    return scene as InstanceType<T>;
  }

  switchScene(sceneName: string) {
    const prevScene = this.getCurrentScene();
    let payload: unknown = null;

    if (prevScene) {
      payload = prevScene.detach(this.graphics);
      prevScene.afterDetach();
    }

    this.currentSceneName = sceneName;

    this.getCurrentScene()?.attach(this.graphics, payload);
  }

  getCurrentScene() {
    if (this.currentSceneName) {
      return this.scenes.get(this.currentSceneName);
    }
  }

  getCurrentSceneName() {
    return this.currentSceneName;
  }

  getGraphics() {
    return this.graphics;
  }

  destroy() {
    this.getCurrentScene()?.detach(this.graphics);
    this.scenes.clear();
    this.currentSceneName = undefined;
  }
}
