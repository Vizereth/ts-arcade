<script lang="ts">
  import { onMount } from "svelte";
  import { Controller } from "../../../pacman/controller/controller.js";
  import { GameState } from "../../../pacman/game/state.js";

  // 1. Tell Vite to resolve the font file's finalized URL
  import fontUrl from "$lib/assets/fonts/Jersey-Regular.ttf?url";

  onMount(async () => {
    // 2. Create a FontFace instance in JS and load it manually!
    const gameFont = new FontFace("Jersey-Regular", `url(${fontUrl})`);

    // Add it to the document so the browser knows it exists
    document.fonts.add(gameFont);

    // Wait for it to finish loading before kicking off Pacman
    await gameFont.load();

    const gameState = GameState.getInstance();
    gameState.loadGame();

    const controller = new Controller();
    controller.init();
  });
</script>

<main class="game-wrapper">
  <div class="pacman">
    <canvas id="map-cvs"></canvas>
    <canvas id="food-cvs"></canvas>
    <canvas id="pill-cvs"></canvas>
    <canvas id="pacman-cvs"></canvas>
    <canvas id="ghosts-cvs"></canvas>
    <canvas id="ui-cvs"></canvas>
  </div>
</main>

<style lang="scss">
  .game-wrapper {
    display: flex;
    justify-content: center;
    align-items: center; 
    min-height: 100vh;
    background-color: #0c0d10;
    width: 100vw;
  }

  .pacman {
    position: relative;
    /* No hardcoded width and height needed! 
       It will assume the width and height of the canvas children */
       
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      
      /* Smooth high-resolution rendering */
      image-rendering: auto; 
    }
    
    #map-cvs    { z-index: 1; position: relative; } /* Acts as the "floor" to give container its height */
    #food-cvs   { z-index: 2; }
    #pill-cvs   { z-index: 3; }
    #pacman-cvs { z-index: 4; }
    #ghosts-cvs { z-index: 5; }
    #ui-cvs     { z-index: 6; }
  }
</style>