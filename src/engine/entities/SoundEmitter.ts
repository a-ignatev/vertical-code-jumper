import { Sound } from "engine/components/Sound";
import { Scene } from "engine/scenes/Scene";
import { Entity } from "./Entity";

export class SoundEmitter extends Entity {
  constructor(scene: Scene, filename: string) {
    super(scene);

    this.addComponent("sound", Sound, filename);
  }

  play() {
    const sound = this.getComponent<Sound>("sound");

    if (sound && !sound.isPlaying()) {
      sound.play();
    }
  }
}
