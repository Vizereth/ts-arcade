import { EntityManager } from "../entities/entityManager.js";
import { GameState } from "./state.js";

class Renderer {
  private static instance: Renderer | null = null;
  private entityManager = EntityManager.getInstance();

  private constructor() {}

  public static getInstance(): Renderer {
    if (!Renderer.instance) Renderer.instance = new Renderer();
    return Renderer.instance;
  }

  public render(dt?: number): void {
    const gameState = GameState.getInstance();
    const clearedCanvases = new Set<HTMLCanvasElement>();

    const canAnimate = ["PLAYING", "INIT", "LEVEL_TRANSITION"].includes(
      gameState.mode
    );
    const canUpdate = gameState.mode === "PLAYING";

    // Draw all dynamic entities
    this.entityManager.getAllDynamic().forEach((entity) => {
      if (!clearedCanvases.has(entity.canvas)) {
        entity.clearCanvas();
        clearedCanvases.add(entity.canvas);
      }

      // Draw and optionally animate
      entity.draw(canAnimate, dt);

      // Update only if the mode allows it
      if (canUpdate) entity.update(dt);
    });

    // Draw all static entities if they need redraw
    this.entityManager
      .getAllStatic()
      .filter((entity) => entity.needsRedraw)
      .forEach((entity) => {
        if (!clearedCanvases.has(entity.canvas)) {
          entity.clearCanvas();
          clearedCanvases.add(entity.canvas);
        }

        entity.draw(canAnimate, dt);
        entity.needsRedraw = false;

        if (canUpdate) entity.update(dt);
      });
  }
}

export { Renderer };
