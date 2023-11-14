import { Sound } from "engine/components/Sound";
import { Scene } from "engine/scenes/Scene";
import { Entity } from "./Entity";

export class SoundEmitter extends Entity {
  constructor(scene: Scene, filename: string, volume: number = 1) {
    super(scene);

    const sound = this.addComponent("sound", Sound, filename);
    sound.setVolume(volume);
  }

  play(onEnded?: () => void) {
    const sound = this.getComponent<Sound>("sound");

    if (sound && !sound.isPlaying()) {
      sound.play(onEnded);
    }
  }
}
