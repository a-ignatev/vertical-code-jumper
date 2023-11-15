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
  private holdingKeys: string[] = [];
  private keyEventListeners: Map<string, (() => void)[]> = new Map();

  constructor(graphics: Graphics) {
    this.graphics = graphics;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    // todo encapsulate window events
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
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

  private onKeyDown(event: KeyboardEvent) {
    this.holdingKeys.push(event.key);
    this.keyEventListeners.get(event.key)?.forEach((listener) => listener());
  }

  private onKeyUp(event: KeyboardEvent) {
    this.holdingKeys = this.holdingKeys.filter((key) => key !== event.key);
  }

  getHoldingKeys() {
    return [...this.holdingKeys];
  }

  subscribeToKey(key: string, callback: () => void) {
    const listeners = this.keyEventListeners.get(key) || [];
    listeners.push(callback);
    this.keyEventListeners.set(key, listeners);
  }

  unsubscribeFromKey(key: string, callback: () => void) {
    const listeners = this.keyEventListeners.get(key) || [];
    this.keyEventListeners.set(
      key,
      listeners.filter((listener) => listener !== callback)
    );
  }

  destroy() {
    this.getCurrentScene()?.detach(this.graphics);
    this.scenes.clear();
    this.currentSceneName = undefined;

    // todo encapsulate window events
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
