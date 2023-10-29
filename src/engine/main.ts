import { SceneManager } from "./scenes/SceneManager";

export function startGameLoop(
  sceneManager: SceneManager,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  abortSignal: AbortSignal,
  debug: boolean
) {
  let lastTimeStamp = 0;

  function gameLoop(timeStamp: number) {
    const scene = sceneManager.getScene();

    if (!scene) {
      console.log("No scene set");
      return;
    }

    const delta = timeStamp - lastTimeStamp;

    // update entities
    scene.getEntities().forEach((entity) =>
      entity.update({
        entities: scene.getEntities(),
        delta,
        ctx,
      })
    );
    scene.setEntities(
      scene.getEntities().filter((entity) => !entity.tryDestroyEntity())
    );

    // clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render entities
    scene.getEntities().forEach((entity) => entity.render(ctx, debug));

    lastTimeStamp = timeStamp;
    if (!abortSignal.aborted) {
      window.requestAnimationFrame(gameLoop);
    }
  }
  window.requestAnimationFrame(gameLoop);
}
