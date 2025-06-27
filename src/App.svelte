<script lang="ts">
  import { onMount } from 'svelte';
  import JsonViewer from './lib/JsonViewer.svelte';
  import AiAssistant from './lib/AiAssistant.svelte';
  import Navigation from './lib/Navigation.svelte';
  import Sidebar from './lib/Sidebar.svelte';
  import { currentView } from './lib/store';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="flex h-screen bg-gray-900 text-white overflow-hidden">
  <!-- Left Sidebar with Options -->
  <Sidebar />
  
  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col overflow-hidden">
    <div class="flex-1 overflow-hidden pb-16">
      {#if $currentView === 'json'}
        <JsonViewer />
      {:else if $currentView === 'assistant'}
        <AiAssistant />
      {/if}
    </div>
    
    <!-- Bottom Navigation -->
    <Navigation />
  </main>
</div>

<style>
  :global(html) {
    height: 100%;
    overflow: hidden;
  }
  
  :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #111827;
    overflow: hidden;
  }
  
  :global(#app) {
    height: 100vh;
    overflow: hidden;
  }
</style>