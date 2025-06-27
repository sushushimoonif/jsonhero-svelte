<script lang="ts">
  import { fileList, currentView } from './store';
  import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-svelte';

  let expandedFolders = new Set(['']);

  function toggleFolder(path: string) {
    if (expandedFolders.has(path)) {
      expandedFolders.delete(path);
    } else {
      expandedFolders.add(path);
    }
    expandedFolders = expandedFolders;
  }

  function setView(view: 'json' | 'assistant') {
    currentView.set(view);
  }

  function getIndentLevel(path: string): number {
    return path.split('/').length - 1;
  }
</script>

<!-- Bottom Navigation Bar -->
<div class="fixed bottom-0 left-24 right-0 bg-gray-800 border-t border-gray-700 px-6 py-4 z-20">
  <div class="flex items-center justify-between">
    <!-- Empty space where parts list used to be -->
    <div class="flex items-center space-x-4">
      <div class="text-sm text-gray-400">
        数据分析系统
      </div>
    </div>

    <!-- View Toggle Buttons -->
    <div class="flex items-center space-x-2">
      <button
        class="flex items-center px-4 py-2 text-sm rounded transition-colors duration-200 {$currentView === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        onclick={() => setView('json')}
      >
        <FileText class="w-4 h-4 mr-2" />
        数据
      </button>
      <button
        class="flex items-center px-4 py-2 text-sm rounded transition-colors duration-200 {$currentView === 'assistant' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        onclick={() => setView('assistant')}
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        指令
      </button>
    </div>
  </div>
</div>