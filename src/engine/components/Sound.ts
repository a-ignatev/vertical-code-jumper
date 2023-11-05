import { Entity } from "engine/entities/Entity";
import { Component } from "./Component";

export class Sound extends Component {
  private audio: HTMLAudioElement;
  private isMuted: boolean;

  constructor(entity: Entity, name: string, isLoop: boolean = false) {
    super(entity);

    const src = mediaFolder + "/sound/" + name;
    this.audio = new Audio(src);

    if (isLoop) {
      this.audio.loop = true;
    }

    this.isMuted = false;
  }

  setCurrentTime(timeS: number) {
    this.audio.currentTime = timeS;
  }

  play() {
    if (this.isMuted) {
      return;
    }

    this.audio.play().catch(() => {
      // just wait until user interact
    });
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  isPlaying() {
    return !this.audio.paused;
  }

  seMuted(value: boolean) {
    this.isMuted = value;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  playWithDelay(delayMs: number) {
    setTimeout(() => {
      this.play();
    }, delayMs);
  }

  destroy() {
    this.audio.pause();
    this.audio.remove();
  }
}
