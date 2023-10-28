export class Sound {
  audio: HTMLAudioElement;

  constructor(name: string) {
    const src = mediaFolder + "/sound/" + name;
    this.audio = new Audio(src);
  }

  play() {
    this.audio.play();
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
