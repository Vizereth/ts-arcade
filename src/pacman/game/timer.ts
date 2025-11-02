class Timer {
  private duration: number = 0;
  private elapsed: number = 0;
  private intervalId: number | null = null;
  private onTick: ((remaining: number) => void) | null = null;
  private onComplete: (() => void) | null = null;
  private isRunning: boolean = false;

  constructor() {}

  public start(
    duration: number,
    interval: number,
    onTick: (remaining: number) => void,
    onComplete?: () => void
  ): void {
    this.duration = duration;
    this.elapsed = 0;
    this.onTick = onTick;
    this.onComplete = onComplete || null;
    this.isRunning = true;

    // Immediately fire first tick
    this.onTick?.(this.duration - this.elapsed);

    this.intervalId = setInterval(() => {
      this.elapsed++;
      if (this.elapsed < this.duration) {
        this.onTick?.(this.duration - this.elapsed);
      } else {
        this.complete();
      }
    }, interval);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  public reset(): void {
    this.stop();
    this.elapsed = 0;
  }

  public getRemaining(): number {
    return this.duration - this.elapsed;
  }

  public getProgress(): number {
    return this.duration > 0 ? this.elapsed / this.duration : 0;
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  private complete(): void {
    this.stop();
    this.onComplete?.();
  }
}

export { Timer };
