<script lang="ts">
  import { page } from "$app/state";
  import "../lib/scss/style.scss"; // Your global styles

  // 1. Accept the 'children' snippet as a prop (Svelte 5 standard)
  let { children } = $props();

  // 2. Derive whether the current route belongs to the /games/ directory
  const isGamePage = $derived(page.url.pathname.split('/')[1] === 'games');
</script>

{#if !isGamePage}
  <div class="crt-overlay"></div>
{/if}

{@render children()}