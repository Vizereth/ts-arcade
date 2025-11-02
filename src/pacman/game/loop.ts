import { Renderer } from "./renderer.js";

class GameLoop {
  renderer: Renderer;
  private static instance: GameLoop;
  private fps: number;
  private now: number | null = null;
  private then: number;
  private interval: number;
  private delta: number | null = null;
  private timer: number | null = null;

  constructor(fps: number = 60) {
    this.renderer = Renderer.getInstance();
    this.fps = fps;
    this.then = Date.now();
    this.interval = 1000 / this.fps;
  }

  static getInstance(): GameLoop {
    if (!GameLoop.instance) {
      GameLoop.instance = new GameLoop();
    }
    return GameLoop.instance;
  }

  public loop() {
    this.timer = requestAnimationFrame(() => this.loop());

    this.now = Date.now();
    this.delta = this.now - this.then;

    if (this.delta > this.interval) {
      this.then = this.now - (this.delta % this.interval);
      this.renderer.render(this.delta);
    }
  }

  public start() {
    if (!this.timer) {
      this.loop();
    }
  }

  public stop() {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
  }
}

export { GameLoop };
