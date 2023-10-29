export class Sound {
  audio: HTMLAudioElement;
  muted: boolean;

  constructor(name: string, isLoop: boolean = false) {
    const src = mediaFolder + "/sound/" + name;
    this.audio = new Audio(src);

    if (isLoop) {
      this.audio.loop = true;
    }

    this.muted = false;
  }

  play() {
    if (this.muted) {
      return;
    }

    this.audio.play();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  isPlaying() {
    return !this.audio.paused;
  }

  seMuted(value: boolean) {
    this.muted = value;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  playWithDelay(delayMs: number) {
    setTimeout(() => {
      this.play();
    }, delayMs);
  }
}
