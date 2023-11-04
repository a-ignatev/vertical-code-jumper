import { Sound } from "engine/components/Sound";
import { Scene } from "engine/scenes/Scene";
import { Entity } from "./Entity";

export class MusicEmitter extends Entity {
  constructor(scene: Scene, filename: string, volume: number) {
    super(scene);

    const music = this.addComponent("music", Sound, filename, true);
    music.setVolume(volume);
  }

  switchMusic(enabled: boolean) {
    const music = this.getComponent<Sound>("music");

    if (!music) {
      return;
    }

    if (enabled) {
      music.seMuted(false);
      music.play();
    } else {
      music.stop();
      music.seMuted(true);
    }
  }
}
