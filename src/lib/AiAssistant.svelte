<script lang="ts">
  import { onMount } from 'svelte';
  import { Send, RotateCcw, FileText, Folder, Upload, CreditCard as Edit3, Lock } from 'lucide-svelte';
  import { selectedSidebarOption, fileList } from './store';
  
  let messages = [
    {
      id: 1,
      text: "我想了解一下飞机零件加工工艺有哪些主要方法？",
      sender: "user",
      timestamp: new Date()
    },
    {
      id: 2,
      text: "飞机零件加工工艺因其高精度和高可靠性要求，涉及多种先进技术，主要方法包括以下几种：\n\n1. 数控加工（CNC）：通过计算机控制机床进行精确切削，适合复杂几何的金属和复合材料零件，如机身框片、机身框架。\n\n2. 增材制造（3D打印）：用于快速原型制作或复杂几何的轻量化零件，常用材料包括钛合金和高温合金。\n\n3. 精密铸造：通过熔模铸造或陶瓷型铸造生产高温合金零件，如发动机涡轮盘。\n\n4. 电火花加工（EDM）：用于硬质材料或复杂微结构的加工，如模具孔洞。\n\n5. 表面处理：如喷丸强化、镀层或热处理，提升零件耐腐蚀性和疲劳寿命。",
      sender: "assistant",
      timestamp: new Date()
    }
  ];
  
  let currentMessage = '';
  let newUserMessage = "在飞机零件加工中，精密铸造和数控加工相比，哪个更适合生产发动机轮盘？为什么？";
  
  // Excel table data - expanded with more examples
  let excelData = [
    { 序号: 1, 工艺名称: "数控铣削", 适用材料: "铝合金7075", 精度等级: "±0.02mm", 表面粗糙度: "Ra1.6", 备注: "主要工艺，适用于复杂型面" },
    { 序号: 2, 工艺名称: "数控车削", 适用材料: "钛合金TC4", 精度等级: "±0.01mm", 表面粗糙度: "Ra0.8", 备注: "精密加工，回转体零件" },
    { 序号: 3, 工艺名称: "电火花加工", 适用材料: "高温合金GH4169", 精度等级: "±0.005mm", 表面粗糙度: "Ra3.2", 备注: "特殊工艺，深孔加工" },
    { 序号: 4, 工艺名称: "激光切割", 适用材料: "复合材料CFRP", 精度等级: "±0.05mm", 表面粗糙度: "Ra6.3", 备注: "快速成型，薄板切割" },
    { 序号: 5, 工艺名称: "3D打印", 适用材料: "钛合金Ti6Al4V", 精度等级: "±0.1mm", 表面粗糙度: "Ra12.5", 备注: "增材制造，复杂结构" },
    { 序号: 6, 工艺名称: "精密铸造", 适用材料: "高温合金K417G", 精度等级: "±0.2mm", 表面粗糙度: "Ra25", 备注: "批量生产，涡轮叶片" },
    { 序号: 7, 工艺名称: "表面处理", 适用材料: "所有金属材料", 精度等级: "±0.01mm", 表面粗糙度: "Ra0.4", 备注: "后处理，提升性能" },
    { 序号: 8, 工艺名称: "热处理", 适用材料: "合金钢40CrNiMoA", 精度等级: "±0.05mm", 表面粗糙度: "Ra3.2", 备注: "性能改善，应力消除" },
    { 序号: 9, 工艺名称: "超声波加工", 适用材料: "陶瓷Si3N4", 精度等级: "±0.003mm", 表面粗糙度: "Ra1.2", 备注: "特种加工，硬脆材料" },
    { 序号: 10, 工艺名称: "化学蚀刻", 适用材料: "薄板不锈钢", 精度等级: "±0.02mm", 表面粗糙度: "Ra2.5", 备注: "微细加工，批量生产" },
    { 序号: 11, 工艺名称: "磨削加工", 适用材料: "硬质合金YG8", 精度等级: "±0.005mm", 表面粗糙度: "Ra0.2", 备注: "精密磨削，刀具制造" },
    { 序号: 12, 工艺名称: "抛光处理", 适用材料: "不锈钢316L", 精度等级: "±0.001mm", 表面粗糙度: "Ra0.1", 备注: "表面光整，镜面效果" },
    { 序号: 13, 工艺名称: "线切割", 适用材料: "模具钢H13", 精度等级: "±0.01mm", 表面粗糙度: "Ra1.6", 备注: "精密切割，复杂轮廓" },
    { 序号: 14, 工艺名称: "深孔钻削", 适用材料: "合金钢35CrMo", 精度等级: "±0.02mm", 表面粗糙度: "Ra3.2", 备注: "深孔加工，L/D>10" },
    { 序号: 15, 工艺名称: "滚压成形", 适用材料: "铝合金2024", 精度等级: "±0.1mm", 表面粗糙度: "Ra6.3", 备注: "塑性成形，薄壁件" },
    { 序号: 16, 工艺名称: "喷丸强化", 适用材料: "钛合金TC11", 精度等级: "±0.05mm", 表面粗糙度: "Ra12.5", 备注: "表面强化，疲劳性能" },
    { 序号: 17, 工艺名称: "阳极氧化", 适用材料: "铝合金6061", 精度等级: "±0.02mm", 表面粗糙度: "Ra1.6", 备注: "表面防护，装饰性" },
    { 序号: 18, 工艺名称: "真空热处理", 适用材料: "高速钢W18Cr4V", 精度等级: "±0.03mm", 表面粗糙度: "Ra3.2", 备注: "无氧化热处理" },
    { 序号: 19, 工艺名称: "超精密车削", 适用材料: "光学玻璃", 精度等级: "±0.001mm", 表面粗糙度: "Ra0.05", 备注: "光学元件加工" },
    { 序号: 20, 工艺名称: "复合加工", 适用材料: "钛合金+CFRP", 精度等级: "±0.05mm", 表面粗糙度: "Ra3.2", 备注: "多材料一体化" }
  ];
  
  // Excel editing state - initially disabled
  let isExcelEditable = false;
  let editingCell = { row: -1, col: '' };
  let fileInput: HTMLInputElement;
  let selectedPartItem: string = '';
  
  function sendMessage() {
    if (currentMessage.trim()) {
      messages = [...messages, {
        id: messages.length + 1,
        text: currentMessage,
        sender: "user",
        timestamp: new Date()
      }];
      currentMessage = '';
    }
  }
  
  function insertPredefinedMessage() {
    currentMessage = newUserMessage;
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function selectPartItem(partName: string) {
    selectedPartItem = partName;
  }

  // Excel editing functions
  function enableExcelEditing() {
    isExcelEditable = true;
  }

  function startCellEdit(rowIndex: number, colKey: string) {
    if (isExcelEditable) {
      editingCell = { row: rowIndex, col: colKey };
    }
  }

  function finishCellEdit() {
    editingCell = { row: -1, col: '' };
  }

  function updateCellValue(rowIndex: number, colKey: string, value: string) {
    excelData[rowIndex][colKey] = value;
    excelData = [...excelData]; // Trigger reactivity
  }

  // File upload functions
  function triggerFileUpload(type: 'process-prep' | 'process') {
    if (fileInput) {
      fileInput.setAttribute('data-upload-type', type);
      fileInput.click();
    }
  }

  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    const uploadType = input.getAttribute('data-upload-type');
    
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Uploading ${uploadType} file:`, file.name);
      
      // Here you would typically handle the file upload
      // For now, we'll just show a message
      messages = [...messages, {
        id: messages.length + 1,
        text: `已上传${uploadType === 'process-prep' ? '工艺准备' : '工艺'}文件: ${file.name}`,
        sender: "assistant",
        timestamp: new Date()
      }];
    }
    
    // Reset the input
    input.value = '';
  }

  // Function to handle adding process file and enabling Excel editing
  function handleAddProcessFile() {
    triggerFileUpload('process');
    enableExcelEditing();
  }
</script>

<div class="flex flex-1 h-full">
  <!-- Parts List - Left side -->
  <div class="w-48 bg-gray-800 border-r border-gray-700 flex flex-col">
    <!-- Header - Non-selectable title -->
    <div class="px-3 py-2 border-b border-gray-700 bg-gray-750">
      <div class="flex items-center">
        <Folder class="w-3 h-3 text-blue-400 mr-2" />
        <h3 class="text-white font-medium text-xs">零件列表</h3>
        <span class="ml-auto text-xs text-gray-400">{$fileList[0]?.children?.length || 0}</span>
      </div>
    </div>
    
    <!-- Parts List - Selectable items that show child attributes when selected -->
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

  <!-- Main Content Area -->
  <div class="flex-1 bg-gray-800 p-6 pb-20 overflow-y-auto scrollbar-thin">
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-white mb-2">工艺数据分析</h2>
          <p class="text-gray-400 text-sm">基于当前选择的数据类型进行智能分析</p>
        </div>
        <div class="flex items-center space-x-2">
          {#if isExcelEditable}
            <div class="flex items-center text-green-400 text-sm">
              <Edit3 class="w-4 h-4 mr-1" />
              编辑模式
            </div>
          {:else}
            <div class="flex items-center text-gray-400 text-sm">
              <Lock class="w-4 h-4 mr-1" />
              只读模式
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Excel Table - Conditionally editable based on state -->
    <div class="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden {!isExcelEditable ? 'opacity-60 pointer-events-none' : ''}">
      <div class="px-6 py-4 border-b border-gray-600 bg-gray-750">
        <h3 class="text-lg font-medium text-white">工艺参数表</h3>
        {#if !isExcelEditable}
          <p class="text-sm text-gray-400 mt-1">点击"添加工艺文件"按钮启用编辑功能</p>
        {/if}
      </div>
      
      <div class="overflow-auto max-h-96 scrollbar-thin">
        <table class="w-full text-sm">
          <thead class="bg-gray-600 sticky top-0">
            <tr>
              <th class="px-4 py-3 text-left text-white font-medium">序号</th>
              <th class="px-4 py-3 text-left text-white font-medium">工艺名称</th>
              <th class="px-4 py-3 text-left text-white font-medium">适用材料</th>
              <th class="px-4 py-3 text-left text-white font-medium">精度等级</th>
              <th class="px-4 py-3 text-left text-white font-medium">表面粗糙度</th>
              <th class="px-4 py-3 text-left text-white font-medium">备注</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-600">
            {#each excelData as row, rowIndex}
              <tr class="{isExcelEditable ? 'hover:bg-gray-600' : ''} transition-colors">
                <td class="px-4 py-3 text-gray-300">{row.序号}</td>
                {#each ['工艺名称', '适用材料', '精度等级', '表面粗糙度', '备注'] as colKey}
                  <td class="px-4 py-3">
                    {#if isExcelEditable && editingCell.row === rowIndex && editingCell.col === colKey}
                      <input
                        type="text"
                        value={row[colKey]}
                        on:blur={finishCellEdit}
                        on:keydown={(e) => {
                          if (e.key === 'Enter') {
                            finishCellEdit();
                          }
                        }}
                        on:input={(e) => updateCellValue(rowIndex, colKey, e.target.value)}
                        class="w-full bg-gray-800 text-white px-2 py-1 rounded border border-blue-500 focus:outline-none"
                        autofocus
                      />
                    {:else}
                      <span 
                        class="text-gray-300 {isExcelEditable ? 'cursor-pointer hover:bg-gray-500 px-2 py-1 rounded' : 'cursor-not-allowed'} {colKey === '备注' ? 'text-xs' : ''}"
                        class:font-medium={colKey === '工艺名称'}
                        on:click={() => isExcelEditable && startCellEdit(rowIndex, colKey)}
                      >
                        {row[colKey]}
                      </span>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Bottom Action Buttons -->
    <div class="flex justify-center mt-8 space-x-4">
      <button 
        class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        on:click={() => triggerFileUpload('process-prep')}
      >
        <Upload class="w-4 h-4 mr-2" />
        添加工艺准备文件
      </button>
      <button 
        class="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
        on:click={handleAddProcessFile}
      >
        <Upload class="w-4 h-4 mr-2" />
        添加工艺文件
      </button>
      <button class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
        替换
      </button>
    </div>
  </div>

  <!-- Right Panel - AI Assistant -->
  <div class="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
    <!-- Header -->
    <div class="bg-gray-700 px-4 py-3 border-b border-gray-600 flex items-center justify-between">
      <h3 class="text-white font-medium">AI 智能助手</h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
        <span class="text-xs text-gray-400">在线</span>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
      {#each messages as message}
        <div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
          <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg {message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}">
            <p class="text-sm whitespace-pre-wrap">{message.text}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Suggested Message -->
    <div class="px-4 py-2 border-t border-gray-600">
      <button 
        class="w-full text-left p-3 bg-gray-700 rounded-lg text-gray-300 text-sm hover:bg-gray-600 transition-colors"
        on:click={insertPredefinedMessage}
      >
        💡 {newUserMessage}
      </button>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-gray-600">
      <div class="flex items-end space-x-2">
        <div class="flex-1">
          <textarea
            bind:value={currentMessage}
            on:keypress={handleKeyPress}
            placeholder="询问关于当前数据的问题..."
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
          ></textarea>
        </div>
        <button
          on:click={sendMessage}
          disabled={!currentMessage.trim()}
          class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send class="w-4 h-4" />
        </button>
        <button class="p-2 text-gray-400 hover:text-white transition-colors">
          <RotateCcw class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>

  <!-- Hidden file input for uploads -->
  <input
    type="file"
    bind:this={fileInput}
    on:change={handleFileUpload}
    accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
    class="hidden"
  />
</div>

<style>
  .bg-gray-750 {
    background-color: #374151;
  }
</style>