export class Sound {
  private audio: HTMLAudioElement;
  private isMuted: boolean;

  constructor(name: string, isLoop: boolean = false) {
    const src = mediaFolder + "/sound/" + name;
    this.audio = new Audio(src);

    if (isLoop) {
      this.audio.loop = true;
    }

    this.isMuted = false;
  }

  play() {
    if (this.isMuted) {
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
}
