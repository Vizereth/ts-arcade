import { CANVAS_CONFIG } from "../config/canvas.js";
import type { TileType, TeleportType } from "../types.js"; 
import { GameState } from "./state.js";

interface Coords {
  x: number;
  y: number;
}

class Collision {
  private static instance: Collision;
  private gameState: GameState;
  private teleportPairs: Record<string, Coords> = {};
  private tileSize: number;

  constructor() {
    this.gameState = GameState.getInstance();
    this.tileSize = CANVAS_CONFIG.tile.size;
  }

  static getInstance(): Collision {
    if (!Collision.instance) {
      Collision.instance = new Collision();
    }
    return Collision.instance;
  }

  // 🌟 TYPE GUARD: Теперь TypeScript на 100% уверен в типе телепорта
  private isTeleportTile(tile: TileType): tile is TeleportType {
    return typeof tile === "string" && tile.startsWith("0");
  }

  public getTile(x: number, y: number) {
    return {
      tileX: Math.floor(x / this.tileSize),
      tileY: Math.floor(y / this.tileSize),
    };
  }

  public getTileCenter(x: number, y: number) {
    return {
      centerX:
        Math.floor(x / this.tileSize) * this.tileSize + this.tileSize / 2,
      centerY:
        Math.floor(y / this.tileSize) * this.tileSize + this.tileSize / 2,
    };
  }

  public isWall(
    x: number,
    y: number,
    isExiting: boolean = false,
    isEntering: boolean = false,
  ): boolean {
    if (!this.gameState.levelData.map[y]) return true;

    const tile = this.gameState.levelData.map[y][x];

    if (tile === "GL" && (isExiting || isEntering)) {
      return false;
    }

    const wallTiles = new Set(["WH", "WV", "TL", "TR", "BL", "BR", "GL"]);

    if (wallTiles.has(tile)) {
      return true;
    }

    return false;
  }

  public initTeleports(map: TileType[][]): void {
    this.teleportPairs = {}; 
    const groups: Record<string, Coords[]> = {};

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        
        // 🌟 Используем наш Type Guard
        if (this.isTeleportTile(tile)) {
          const id = tile.slice(1); // Теперь TS знает, что slice безопасен
          if (!groups[id]) groups[id] = [];
          groups[id].push({ x, y });
        }
      }
    }

    for (const id in groups) {
      const [a, b] = groups[id];
      if (a && b) {
        this.teleportPairs[`${a.x},${a.y}`] = b;
        this.teleportPairs[`${b.x},${b.y}`] = a;
      } else {
        console.warn(`Portal with ID "0${id}" has no pair on map!`);
      }
    }
  }

  public getTeleportExit(x: number, y: number): Coords | null {
    return this.teleportPairs[`${x},${y}`] || null;
  }

  public isTeleport(x: number, y: number): boolean {
    return !!this.teleportPairs[`${x},${y}`];
  }
}

export { Collision };