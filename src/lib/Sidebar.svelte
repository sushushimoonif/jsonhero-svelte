<script lang="ts">
  import { sidebarOptions, selectedSidebarOption, updateDataForOption } from './store';
  import { 
    TreePine, 
    GitCompare, 
    Target, 
    MapPin, 
    Shapes 
  } from 'lucide-svelte';

  function getIcon(iconName: string) {
    switch (iconName) {
      case 'tree': return TreePine;
      case 'compare': return GitCompare;
      case 'extract': return Target;
      case 'point-compare': return MapPin;
      case 'geometry': return Shapes;
      default: return TreePine;
    }
  }

  function selectOption(optionId: string) {
    // Update selected option
    sidebarOptions.update(options => 
      options.map(opt => ({ ...opt, active: opt.id === optionId }))
    );
    selectedSidebarOption.set(optionId);
    
    // Update data based on selected option
    updateDataForOption(optionId);
  }
</script>

<div class="w-24 bg-gray-800 border-r border-gray-700 flex flex-col">
  <!-- Header -->
  <div class="p-2 border-b border-gray-700">
    <h2 class="text-sm font-semibold text-white text-center">数据分析</h2>
  </div>

  <!-- Options List -->
  <div class="flex-1 py-2">
    {#each $sidebarOptions as option}
      <button
        class="w-full flex flex-col items-center px-2 py-3 text-center hover:bg-gray-700 transition-colors duration-200 {option.active ? 'bg-blue-600 text-white border-r-2 border-blue-400' : 'text-gray-300'}"
        on:click={() => selectOption(option.id)}
      >
        <svelte:component 
          this={getIcon(option.icon)} 
          class="w-4 h-4 mb-1 {option.active ? 'text-white' : 'text-gray-400'}" 
        />
        <span class="text-xs font-medium leading-tight">{option.name}</span>
      </button>
    {/each}
  </div>

  <!-- Footer Info -->
  <div class="p-2 border-t border-gray-700">
    <div class="text-xs text-gray-400 text-center">
      <p class="text-blue-400 font-medium text-xs">
        {$sidebarOptions.find(opt => opt.active)?.name || '结构数'}
      </p>
    </div>
  </div>
</div>