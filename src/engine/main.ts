import { Graphics } from "./graphics/Graphics";
import { SceneManager } from "./scenes/SceneManager";

export function startGameLoop(
  sceneManager: SceneManager,
  graphics: Graphics,
  abortSignal: AbortSignal,
  debug: boolean
) {
  let lastTimeStamp = 0;

  function gameLoop(timeStamp: number) {
    const scene = sceneManager.getCurrentScene();

    if (!scene) {
      console.log("No scene set");

      return;
    }

    if (!lastTimeStamp) {
      lastTimeStamp = timeStamp;
      window.requestAnimationFrame(gameLoop);
    }

    const deltaMs = timeStamp - lastTimeStamp;

    // update entities
    for (const entity of scene.getEntities()) {
      entity.update({ delta: deltaMs / 1000 });
    }

    // clear screen
    graphics.clearScreen();

    // render entities
    [...scene.getEntities()]
      .sort((a, b) => a.getZOrder() - b.getZOrder())
      .forEach((entity) => entity.render(graphics, debug));

    lastTimeStamp = timeStamp;

    if (!abortSignal.aborted) {
      window.requestAnimationFrame(gameLoop);
    } else {
      sceneManager.destroy();
    }
  }
  window.requestAnimationFrame(gameLoop);
}
