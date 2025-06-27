<script lang="ts">
  import { onMount } from 'svelte';
  import { jsonData, selectedPath, selectedSidebarOption, fileList } from './store';
  import type { JsonNode } from './store';
  import { ChevronRight, Search, FileText, Database, GitCompare, Target, MapPin, Shapes, Folder, Copy, Download, Share, Info, Layers, Zap } from 'lucide-svelte';

  let searchQuery = '';
  let selectedNode: JsonNode | null = null;
  let navigationPath: string[] = [];
  let selectedPartItem: string = '';
  
  // Column data structure - supports unlimited dynamic columns
  let columns: Array<{title: string, items: JsonNode[], selectedIndex: number}> = [];
  let showRightPanel = false;

  // Context menu state
  let contextMenu = {
    show: false,
    x: 0,
    y: 0,
    selectedItem: null as JsonNode | null
  };

  // Responsive layout state
  let containerWidth = 0;
  let isSmallScreen = false;

  $: if ($jsonData) {
    initializeColumns();
  }

  // Clear selection history when switching sidebar options
  $: if ($selectedSidebarOption) {
    clearSelectionHistory();
  }

  // Monitor screen size for responsive behavior
  $: isSmallScreen = containerWidth < 1024;

  function clearSelectionHistory() {
    columns = [];
    selectedNode = null;
    navigationPath = [];
    showRightPanel = false;
    if ($jsonData) {
      initializeColumns();
    }
  }

  function initializeColumns() {
    if (!$jsonData) return;
    
    // Initialize with 4 base columns as requested
    const partBodyNode = $jsonData.children?.find(child => child.key === 'PartBody');
    if (partBodyNode && partBodyNode.children) {
      // Column 1: PartBody level
      const geometrySetsNode = partBodyNode.children.find(child => child.key === 'GeometrySets');
      if (geometrySetsNode && geometrySetsNode.children) {
        // Column 2: GeometrySets level
        const modelAttributesNode = geometrySetsNode.children.find(child => child.key === 'A_模型属性');
        if (modelAttributesNode && modelAttributesNode.children) {
          // Initialize 4 base columns
          columns = [
            {
              title: 'PartBody',
              items: [partBodyNode],
              selectedIndex: 0
            },
            {
              title: 'GeometrySets',
              items: geometrySetsNode.children,
              selectedIndex: geometrySetsNode.children.findIndex(child => child.key === 'A_模型属性')
            },
            {
              title: 'A_模型属性',
              items: modelAttributesNode.children,
              selectedIndex: 0
            },
            {
              title: '属性详情',
              items: modelAttributesNode.children[0] ? [modelAttributesNode.children[0]] : [],
              selectedIndex: 0
            }
          ];
          
          // Set initial selected node to first item in column 4
          if (modelAttributesNode.children[0]) {
            selectedNode = modelAttributesNode.children[0];
            updateNavigationPath();
            checkForDynamicColumns(3, 0); // Check if we need to add more columns
          }
        }
      }
    }
  }

  function getColumnTitle(): string {
    switch ($selectedSidebarOption) {
      case 'structure': return '结构数据';
      case 'info-compare': return '信息对比';
      case 'point-extract': return '点位提取';
      case 'point-compare': return '点位对比';
      case 'geometry-compare': return '几何对比';
      default: return '数据列表';
    }
  }

  function getOptionIcon(option: string) {
    switch (option) {
      case 'structure': return Database;
      case 'info-compare': return GitCompare;
      case 'point-extract': return Target;
      case 'point-compare': return MapPin;
      case 'geometry-compare': return Shapes;
      default: return FileText;
    }
  }

  function getItemIcon(item: JsonNode): any {
    // Return appropriate icon based on item content and type
    if (item.key.includes('产品')) return Layers;
    if (item.key.includes('型号') || item.key.includes('规格')) return Zap;
    if (item.key.includes('配置') || item.key.includes('参数')) return Info;
    if (item.type === 'object' && item.children && item.children.length > 0) return Folder;
    return FileText;
  }

  function selectNode(node: JsonNode, columnIndex: number, itemIndex: number) {
    selectedNode = node;
    
    // Update the selected index for the current column
    columns[columnIndex].selectedIndex = itemIndex;
    
    // Remove columns after the current one to maintain clean state
    columns = columns.slice(0, columnIndex + 1);
    
    // Update navigation path
    updateNavigationPath();
    
    // Check for dynamic column addition (especially for column 4 and beyond)
    checkForDynamicColumns(columnIndex, itemIndex);
    
    selectedPath.set(node.path);
  }

  function checkForDynamicColumns(columnIndex: number, itemIndex: number) {
    const currentNode = columns[columnIndex].items[itemIndex];
    
    // Check if current node has non-empty children
    const nonEmptyChildren = currentNode.children?.filter(child => 
      child.value !== null && 
      child.value !== undefined && 
      child.value !== '' &&
      !(typeof child.value === 'object' && Object.keys(child.value).length === 0)
    ) || [];

    // CRITICAL LOGIC CHANGE: Show right panel ONLY when child attributes are empty
    // If selected item has non-empty children, do NOT show right panel (keep it blank)
    showRightPanel = nonEmptyChildren.length === 0;
    
    // Dynamic column logic: Add next column if the selected node has non-empty children
    // This applies recursively to any column (especially column 4 and beyond)
    if (nonEmptyChildren.length > 0) {
      const nextColumnTitle = currentNode.key + '_子项';
      
      // Add the new dynamic column
      columns = [...columns, {
        title: nextColumnTitle,
        items: nonEmptyChildren,
        selectedIndex: 0
      }];
      
      // Auto-select first item in new column and recursively check for more columns
      if (nonEmptyChildren[0]) {
        setTimeout(() => {
          selectNode(nonEmptyChildren[0], columnIndex + 1, 0);
        }, 0);
      }
    }
  }

  function updateNavigationPath() {
    navigationPath = columns.map((col, i) => {
      const selectedItem = col.items[col.selectedIndex];
      return selectedItem ? selectedItem.key : '';
    }).filter(Boolean);
  }

  function selectPartItem(partName: string) {
    selectedPartItem = partName;
    // Clear selection history when selecting a new part
    clearSelectionHistory();
  }

  function handleRightClick(event: MouseEvent, item: JsonNode) {
    event.preventDefault();
    contextMenu = {
      show: true,
      x: event.clientX,
      y: event.clientY,
      selectedItem: item
    };
  }

  function hideContextMenu() {
    contextMenu.show = false;
  }

  function copyToClipboard() {
    if (contextMenu.selectedItem) {
      const textToCopy = formatDisplayValue(contextMenu.selectedItem.value, contextMenu.selectedItem.type);
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('Copied to clipboard:', textToCopy);
      });
    }
    hideContextMenu();
  }

  function downloadItem() {
    if (contextMenu.selectedItem) {
      const data = JSON.stringify(contextMenu.selectedItem, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contextMenu.selectedItem.key}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    hideContextMenu();
  }

  function shareItem() {
    if (contextMenu.selectedItem && navigator.share) {
      navigator.share({
        title: contextMenu.selectedItem.key,
        text: formatDisplayValue(contextMenu.selectedItem.value, contextMenu.selectedItem.type)
      });
    }
    hideContextMenu();
  }

  function formatDisplayValue(value: any, type: string): string {
    if (type === 'string') return value;
    if (type === 'number') return value.toString();
    if (type === 'boolean') return value ? '是' : '否';
    if (type === 'object' && value && typeof value === 'object') {
      // For coordinate objects
      if (value.x !== undefined && value.y !== undefined && value.z !== undefined) {
        return `(${value.x}, ${value.y}, ${value.z})`;
      }
      // For comparison objects
      if (value.A !== undefined && value.B !== undefined) {
        return `A: ${value.A} | B: ${value.B}`;
      }
    }
    return JSON.stringify(value);
  }

  // Function to get all properties of the selected node for detailed display
  function getSelectedNodeProperties(): Array<{key: string, value: any, type: string}> {
    if (!selectedNode || !selectedNode.children) return [];
    
    return selectedNode.children.map(child => ({
      key: child.key,
      value: child.value,
      type: child.type
    }));
  }

  // Function to determine interaction behavior description
  function getInteractionDescription(): string {
    if (!selectedNode) return '未选择项目';
    
    const nonEmptyChildren = selectedNode.children?.filter(child => 
      child.value !== null && 
      child.value !== undefined && 
      child.value !== '' &&
      !(typeof child.value === 'object' && Object.keys(child.value).length === 0)
    ) || [];

    if (nonEmptyChildren.length > 0) {
      return `示例1 - 有子项的情况：${selectedNode.key} 包含 ${nonEmptyChildren.length} 个非空子项，已自动展开第${columns.length}列`;
    } else if (selectedNode.children && selectedNode.children.length > 0) {
      return `示例2 - 无子项的情况：${selectedNode.key} 的子项值为空，保持${columns.length - 1}列显示，显示详情面板`;
    } else {
      return `示例2 - 无子项的情况：${selectedNode.key} 没有子项，显示详情面板`;
    }
  }

  onMount(() => {
    if ($jsonData) {
      initializeColumns();
    }
    
    // Add global click listener to hide context menu
    document.addEventListener('click', hideContextMenu);
    
    return () => {
      document.removeEventListener('click', hideContextMenu);
    };
  });
</script>

<div class="flex flex-col h-full bg-gray-900 text-white" bind:clientWidth={containerWidth}>
  <!-- Search Bar - Top -->
  <div class="bg-gray-800 border-b border-gray-700 px-4 py-3 z-10 flex-shrink-0">
    <div class="relative max-w-2xl mx-auto">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="搜索数据..."
        bind:value={searchQuery}
        class="w-full pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {#if searchQuery}
        <button 
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-lg"
          on:click={() => searchQuery = ''}
        >
          ×
        </button>
      {/if}
    </div>
  </div>

  <!-- Breadcrumb Navigation -->
  <div class="bg-gray-800 border-b border-gray-700 px-4 py-2 z-10 flex-shrink-0">
    <div class="flex items-center space-x-1 text-sm max-w-full mx-auto overflow-x-auto scrollbar-thin">
      <svelte:component 
        this={getOptionIcon($selectedSidebarOption)} 
        class="w-3 h-3 text-blue-400 flex-shrink-0" 
      />
      <span class="text-blue-400 text-xs flex-shrink-0">{getColumnTitle()}</span>
      {#each navigationPath as segment}
        <ChevronRight class="w-3 h-3 text-gray-500 flex-shrink-0" />
        <span class="text-gray-300 text-xs flex-shrink-0">{segment}</span>
      {/each}
    </div>
  </div>

  <!-- Main Content Area with Fixed Right Panel -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Parts List - Far Left -->
    <div class="w-48 bg-gray-800 border-r border-gray-700 flex flex-col flex-shrink-0">
      <!-- Header - Non-selectable title -->
      <div class="px-3 py-2 border-b border-gray-700 bg-gray-750 flex-shrink-0">
        <div class="flex items-center">
          <Folder class="w-3 h-3 text-blue-400 mr-2" />
          <h3 class="text-white font-medium text-xs">零件列表</h3>
          <span class="ml-auto text-xs text-gray-400">{$fileList[0]?.children?.length || 0}</span>
        </div>
      </div>
      
      <!-- Parts List - Selectable items -->
      <div class="flex-1 overflow-y-auto divide-y divide-gray-700 scrollbar-thin">
        {#each $fileList[0]?.children || [] as item}
          <button 
            class="w-full flex items-center px-3 py-2 text-left hover:bg-gray-700 transition-colors duration-150"
            class:bg-gray-700={selectedPartItem === item.name}
            on:click={() => selectPartItem(item.name)}
          >
            <FileText class="w-2 h-2 text-blue-400 mr-2 flex-shrink-0" />
            <span class="text-gray-300 text-xs truncate">{item.name}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Data Columns Container with Horizontal Scroll -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Scrollable Columns Area - Dynamic column display -->
      <div class="flex overflow-x-auto scrollbar-thin column-layout" style="flex: 1; min-width: 0;">
        {#each columns as column, columnIndex}
          <div class="min-w-52 w-52 bg-gray-800 border-r border-gray-700 overflow-y-auto scrollbar-thin flex-shrink-0">
            <!-- Column Header -->
            <div class="px-3 py-2 border-b border-gray-700 bg-gray-750 sticky top-0 z-10">
              <h3 class="text-white font-medium text-xs flex items-center">
                <svelte:component 
                  this={getOptionIcon($selectedSidebarOption)} 
                  class="w-2 h-2 text-blue-400 mr-2" 
                />
                <span class="truncate">{column.title}</span>
                <span class="ml-auto text-xs text-gray-400 flex-shrink-0">{column.items.length}</span>
              </h3>
            </div>
            
            <!-- Column Items with enhanced interaction -->
            <div class="divide-y divide-gray-700">
              {#each column.items as item, itemIndex}
                <button
                  class="w-full flex flex-col px-3 py-2 text-left hover:bg-gray-700 transition-colors duration-150 tree-item"
                  class:bg-gray-700={column.selectedIndex === itemIndex}
                  on:click={() => selectNode(item, columnIndex, itemIndex)}
                  on:contextmenu={(e) => handleRightClick(e, item)}
                >
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center min-w-0">
                      <!-- Enhanced icon based on item content -->
                      <svelte:component 
                        this={getItemIcon(item)} 
                        class="w-2 h-2 text-blue-400 mr-2 flex-shrink-0" 
                      />
                      <span class="text-gray-300 text-xs truncate font-medium">{item.key}</span>
                      <!-- Show chevron if item has non-empty children -->
                      {#if item.children && item.children.some(child => 
                        child.value !== null && 
                        child.value !== undefined && 
                        child.value !== '' &&
                        !(typeof child.value === 'object' && Object.keys(child.value).length === 0)
                      )}
                        <ChevronRight class="w-2 h-2 ml-1 text-green-400 flex-shrink-0" />
                      {/if}
                    </div>
                    {#if item.count !== undefined}
                      <span class="text-xs text-gray-400 ml-2 flex-shrink-0">{item.count}</span>
                    {/if}
                  </div>
                  
                  <!-- Show value preview for leaf nodes -->
                  {#if item.type !== 'object' && item.type !== 'array' && item.value !== null && item.value !== ''}
                    <div class="mt-1 text-xs text-gray-400 truncate">
                      {formatDisplayValue(item.value, item.type)}
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Fixed Right Panel - Show details ONLY when child attributes are empty -->
    <div class="w-80 bg-blue-900 overflow-y-auto scrollbar-thin flex-shrink-0 border-l border-gray-600">
      {#if showRightPanel && selectedNode}
        <!-- Show detailed information when child attributes are empty -->
        <div class="p-4 space-y-4">
          <!-- Header -->
          <div class="border-b border-blue-700 pb-3">
            <h2 class="text-lg font-semibold text-white flex items-center">
              <FileText class="w-4 h-4 mr-2" />
              详情信息
            </h2>
            <p class="text-blue-200 text-xs mt-1">选中项的子属性值为空，显示详细信息</p>
          </div>

          <!-- 交互行为说明 Section -->
          <div class="bg-green-800 rounded-lg p-3">
            <h3 class="text-sm font-semibold text-white mb-2 flex items-center">
              <Zap class="w-3 h-3 mr-2" />
              交互行为说明
            </h3>
            <div class="text-green-100 text-xs">
              {getInteractionDescription()}
            </div>
          </div>

          <!-- 当前选项 Section -->
          <div class="bg-blue-800 rounded-lg p-3">
            <h3 class="text-sm font-semibold text-white mb-2 flex items-center">
              <svelte:component 
                this={getOptionIcon($selectedSidebarOption)} 
                class="w-3 h-3 mr-2" 
              />
              当前选项
            </h3>
            <div class="text-blue-100 text-xs">
              {getColumnTitle()}
            </div>
          </div>

          <!-- 选中零件 Section -->
          <div class="bg-blue-800 rounded-lg p-3">
            <h3 class="text-sm font-semibold text-white mb-2">选中零件</h3>
            <div class="text-blue-100 text-xs">
              {selectedPartItem || '未选择'}
            </div>
          </div>

          <!-- 选中项目 Section -->
          <div class="bg-blue-800 rounded-lg p-3">
            <h3 class="text-sm font-semibold text-white mb-2">选中项目</h3>
            <div class="text-blue-100 text-xs font-medium">
              {selectedNode.key}
            </div>
            <div class="text-blue-200 text-xs mt-1">
              类型: {selectedNode.type}
            </div>
            <div class="text-blue-200 text-xs">
              路径: {selectedNode.path?.join(' → ') || 'root'}
            </div>
            <div class="text-blue-200 text-xs">
              列位置: 第 {columns.findIndex(col => col.items.includes(selectedNode)) + 1} 列
            </div>
          </div>
          
          <!-- 属性详情 Section - Show all properties when child values are empty -->
          <div class="bg-blue-800 rounded-lg p-3">
            <h3 class="text-sm font-semibold text-white mb-3">属性详情</h3>
            <div class="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
              {#each getSelectedNodeProperties() as prop}
                <div class="bg-blue-700 rounded p-2">
                  <div class="flex justify-between items-start mb-1">
                    <span class="text-blue-100 text-xs font-medium truncate">{prop.key}</span>
                    <span class="text-blue-300 text-xs ml-2 flex-shrink-0">{prop.type}</span>
                  </div>
                  <div class="text-blue-200 text-xs break-words">
                    {#if prop.value === null || prop.value === undefined || prop.value === ''}
                      <span class="text-gray-400 italic">空值</span>
                    {:else}
                      {formatDisplayValue(prop.value, prop.type)}
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- 统计信息 Section -->
          <div class="bg-blue-800 rounded-lg p-3">
            <h3 class="text-sm font-semibold text-white mb-2">统计信息</h3>
            <div class="text-blue-100 text-xs space-y-1">
              <p>当前列数: {columns.length}</p>
              <p>总属性数: {selectedNode.children?.length || 0}</p>
              <p>空值属性: {getSelectedNodeProperties().filter(p => p.value === null || p.value === undefined || p.value === '').length}</p>
              <p>非空属性: {getSelectedNodeProperties().filter(p => p.value !== null && p.value !== undefined && p.value !== '').length}</p>
            </div>
          </div>

          <!-- 操作说明 Section -->
          <div class="bg-blue-800 rounded-lg p-3 mt-4">
            <h3 class="text-sm font-semibold text-white mb-2">操作说明</h3>
            <div class="text-blue-100 text-xs space-y-1">
              <p>• 点击左侧选项切换数据类型</p>
              <p>• 点击零件列表选择不同零件</p>
              <p>• 点击列表项查看详细信息</p>
              <p>• 第四列及后续列支持动态展开</p>
              <p>• 选中项有非空子属性时自动添加新列</p>
              <p>• 绿色箭头表示可展开项目</p>
              <p>• 右键点击项目显示操作菜单</p>
              <p>• 使用搜索框快速定位数据</p>
              <p>• 列表支持水平滚动查看更多内容</p>
            </div>
          </div>
        </div>
      {:else}
        <!-- Empty state when child attributes are not empty - Keep panel completely blank -->
        <div class="h-full bg-blue-900">
          <!-- Completely empty - no content when child attributes are not empty -->
        </div>
      {/if}
    </div>
  </div>

  <!-- Context Menu -->
  {#if contextMenu.show}
    <div 
      class="fixed bg-gray-700 border border-gray-600 rounded-lg shadow-lg py-2 z-50"
      style="left: {contextMenu.x}px; top: {contextMenu.y}px;"
    >
      <button 
        class="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
        on:click={copyToClipboard}
      >
        <Copy class="w-4 h-4 mr-2" />
        复制
      </button>
      <button 
        class="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
        on:click={downloadItem}
      >
        <Download class="w-4 h-4 mr-2" />
        下载
      </button>
      {#if navigator.share}
        <button 
          class="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
          on:click={shareItem}
        >
          <Share class="w-4 h-4 mr-2" />
          分享
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .bg-gray-750 {
    background-color: #374151;
  }
  
  /* Enhanced scrollbar styles for better visibility */
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: #4b5563 #1f2937;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 4px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
    border: 1px solid #374151;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }

  .scrollbar-thin::-webkit-scrollbar-corner {
    background: #1f2937;
  }

  /* Enhanced column layout for smooth horizontal scrolling */
  .column-layout {
    display: flex;
    overflow-x: auto;
    height: 100%;
    min-width: 0;
    scroll-behavior: smooth;
  }

  .column-layout::-webkit-scrollbar {
    height: 8px;
  }

  .column-layout::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 4px;
  }

  .column-layout::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
    border: 1px solid #374151;
  }

  .column-layout::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }

  /* Smooth transitions for tree items */
  .tree-item {
    transition: all 0.2s ease;
  }

  .tree-item:hover {
    background-color: rgba(59, 130, 246, 0.1);
    transform: translateX(2px);
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .column-layout {
      overflow-x: scroll;
    }
  }
</style>