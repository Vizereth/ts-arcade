import { CANVAS_CONFIG } from "../config/canvas.js";
import { Entity } from "../entities/entity.js";
import { eventBus } from "../game/eventBus.js";
import { GameState } from "../game/state.js";

class Food extends Entity {
  private gameState: GameState;
  private color: string;
  private r: number;

  // Explicitly typing this as a Set of strings to avoid TS errors with .clear() and .add()
  public positions: Set<string> = new Set<string>();

  constructor() {
    super(CANVAS_CONFIG.canvasIds.food, false);
    this.gameState = GameState.getInstance();
    this.color = "rgb(230, 230, 230)";
    this.r = this.tileSize / 8;
  }

  // 1. Map scanning happens here so game can draw dots on loadLevel()
  public spawn() {
    this.positions.clear();

    // 🌟 Очищаем холст от старых точек ПЕРЕД генерацией новых
    this.clearCanvas();

    const map = this.gameState.levelData.map;
    let dotCount = 0;

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === "FD") {
          this.positions.add(`${i},${j}`);
          dotCount++;
        }
      }
    }
    this.needsRedraw = true;
    this.gameState.setTotalDots(dotCount);
  }

  // 2. Kept empty to prevent duplicate map scans during initAll()
  public override init() {
    // Keep empty or add future event listeners here
  }

  public override reset() {
    this.positions.clear();
  }

  public eat(i: number, j: number) {
    this.positions.delete(`${i},${j}`);
    this.clearCanvas(
      j * this.tileSize,
      i * this.tileSize,
      this.tileSize,
      this.tileSize,
    );
    // 🌟 Сообщаем шине событий, что точка съедена
    eventBus.emit("DOT_EATEN");
  }

  public update() {
    // Static objects usually don't need continuous state updates
  }

  public draw(animate: boolean) {
    this.positions.forEach((pos) => {
      const [i, j] = pos.split(",").map(Number);
      this.drawDot(i, j);
    });
  }

  private drawDot(i: number, j: number) {
    const tileSize = CANVAS_CONFIG.tile.size;

    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(
      tileSize * j + tileSize / 2,
      tileSize * i + tileSize / 2,
      this.r,
      0,
      Math.PI * 2,
    );
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export { Food };
