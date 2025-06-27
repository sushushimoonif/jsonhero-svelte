import { writable } from 'svelte/store';

export interface JsonNode {
  key: string;
  value: any;
  type: string;
  path: string[];
  children?: JsonNode[];
  count?: number;
  expanded?: boolean;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

export interface SidebarOption {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export const currentView = writable<'json' | 'assistant'>('json');
export const selectedSidebarOption = writable<string>('structure');
export const jsonData = writable<JsonNode | null>(null);
export const selectedPath = writable<string[]>([]);
export const breadcrumbs = writable<JsonNode[]>([]);

export const sidebarOptions = writable<SidebarOption[]>([
  { id: 'structure', name: '结构数', icon: 'tree', active: true },
  { id: 'info-compare', name: '信息对比', icon: 'compare', active: false },
  { id: 'point-extract', name: '点位提取', icon: 'extract', active: false },
  { id: 'point-compare', name: '点位对比', icon: 'point-compare', active: false },
  { id: 'geometry-compare', name: '几何对比', icon: 'geometry', active: false }
]);

export const fileList = writable<FileItem[]>([
  { name: '零件列表', path: '/', type: 'folder', children: [
    { name: 'W02-5312-1101-001', path: '/W02-5312-1101-001', type: 'file' },
    { name: 'W02-5312-1101-002', path: '/W02-5312-1101-002', type: 'file' },
    { name: 'W02-5312-1101-003', path: '/W02-5312-1101-003', type: 'file' },
    { name: 'W02-5312-1101-004', path: '/W02-5312-1101-004', type: 'file' },
    { name: 'W02-5312-1101-005', path: '/W02-5312-1101-005', type: 'file' },
    { name: 'W02-5312-1101-006', path: '/W02-5312-1101-006', type: 'file' },
    { name: 'W02-5312-1101-007', path: '/W02-5312-1101-007', type: 'file' },
    { name: 'W02-5312-1101-008', path: '/W02-5312-1101-008', type: 'file' },
    { name: 'W02-5312-1101-009', path: '/W02-5312-1101-009', type: 'file' },
    { name: 'W02-5312-1101-010', path: '/W02-5312-1101-010', type: 'file' },
    { name: 'W02-5312-1101-011', path: '/W02-5312-1101-011', type: 'file' },
    { name: 'W02-5312-1101-012', path: '/W02-5312-1101-012', type: 'file' },
    { name: 'W02-5312-1101-013', path: '/W02-5312-1101-013', type: 'file' },
    { name: 'W02-5312-1101-014', path: '/W02-5312-1101-014', type: 'file' },
    { name: 'W02-5312-1101-015', path: '/W02-5312-1101-015', type: 'file' },
    { name: 'W02-5312-1101-016', path: '/W02-5312-1101-016', type: 'file' },
    { name: 'W02-5312-1101-017', path: '/W02-5312-1101-017', type: 'file' },
    { name: 'W02-5312-1101-018', path: '/W02-5312-1101-018', type: 'file' },
    { name: 'W02-5312-1101-019', path: '/W02-5312-1101-019', type: 'file' },
    { name: 'W02-5312-1101-020', path: '/W02-5312-1101-020', type: 'file' },
    { name: 'W02-5312-1101-021', path: '/W02-5312-1101-021', type: 'file' },
    { name: 'W02-5312-1101-022', path: '/W02-5312-1101-022', type: 'file' },
    { name: 'W02-5312-1101-023', path: '/W02-5312-1101-023', type: 'file' },
    { name: 'W02-5312-1101-024', path: '/W02-5312-1101-024', type: 'file' },
    { name: 'W02-5312-1101-025', path: '/W02-5312-1101-025', type: 'file' },
    { name: 'W02-5312-1101-026', path: '/W02-5312-1101-026', type: 'file' },
    { name: 'W02-5312-1101-027', path: '/W02-5312-1101-027', type: 'file' },
    { name: 'W02-5312-1101-028', path: '/W02-5312-1101-028', type: 'file' },
    { name: 'W02-5312-1101-029', path: '/W02-5312-1101-029', type: 'file' },
    { name: 'W02-5312-1101-030', path: '/W02-5312-1101-030', type: 'file' }
  ]}
]);

function buildJsonNode(key: string, value: any, path: string[] = []): JsonNode {
  const type = getValueType(value);
  const node: JsonNode = {
    key,
    value,
    type,
    path: [...path, key]
  };

  if (type === 'object' && value !== null) {
    const entries = Object.entries(value);
    node.children = entries.map(([childKey, childValue]) => 
      buildJsonNode(childKey, childValue, node.path)
    );
    node.count = entries.length;
  } else if (type === 'array') {
    node.children = value.map((item: any, index: number) => 
      buildJsonNode(`[${index}]`, item, node.path)
    );
    node.count = value.length;
  }

  return node;
}

function getValueType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'unknown';
}

// Enhanced sample data with comprehensive examples for dynamic column interaction
const sampleDataStructures = {
  structure: {
    'W02-5312-1101-001': {
      PartBody: {
        GeometrySets: {
          // Add empty geometrySets field as requested
          geometrySets: null,
          A_模型属性: {
            // 示例1 - 有子项的情况：产品A
            产品A: {
              型号X: {
                规格1: {
                  详细参数: {
                    长度: '200mm',
                    宽度: '150mm',
                    高度: '80mm',
                    重量: '2.5kg'
                  },
                  材料信息: {
                    主材料: '铝合金7075',
                    表面处理: '阳极氧化',
                    硬度: 'HB150-180'
                  }
                },
                规格2: {
                  详细参数: {
                    长度: '220mm',
                    宽度: '160mm',
                    高度: '85mm',
                    重量: '2.8kg'
                  },
                  材料信息: {
                    主材料: '铝合金6061',
                    表面处理: '喷砂氧化',
                    硬度: 'HB120-150'
                  }
                }
              },
              型号Y: {
                规格A: {
                  详细参数: {
                    长度: '180mm',
                    宽度: '140mm',
                    高度: '75mm',
                    重量: '2.2kg'
                  }
                },
                规格B: {
                  详细参数: {
                    长度: '190mm',
                    宽度: '145mm',
                    高度: '78mm',
                    重量: '2.4kg'
                  }
                }
              },
              型号Z: {
                基础版: {
                  核心组件: {
                    主体结构: '一体式铸造',
                    连接方式: '螺栓连接',
                    密封等级: 'IP65'
                  },
                  性能参数: {
                    工作温度: '-40°C~+85°C',
                    抗拉强度: '≥540MPa',
                    疲劳寿命: '≥50000次'
                  }
                },
                增强版: {
                  核心组件: {
                    主体结构: '锻造+机加工',
                    连接方式: '焊接+螺栓',
                    密封等级: 'IP67'
                  },
                  性能参数: {
                    工作温度: '-55°C~+125°C',
                    抗拉强度: '≥580MPa',
                    疲劳寿命: '≥80000次'
                  }
                }
              }
            },
            
            // 示例2 - 无子项的情况：产品B
            产品B: {
              // 这些属性没有进一步的子项，值为最终数据
              基本信息: '单一产品型号',
              技术规格: '标准配置',
              应用场景: '通用型应用',
              认证状态: '已通过CE认证',
              供应商: '航空制造公司',
              价格: '¥15000',
              库存状态: '现货供应',
              交付周期: '7-10个工作日'
            },
            
            // 示例3 - 多级递归的情况：产品C
            产品C: {
              型号Z: {
                规格1: {
                  子规格A: {
                    详细配置: {
                      处理器: 'ARM Cortex-M4',
                      内存: '512KB Flash',
                      接口: 'CAN/RS485/Ethernet',
                      电源: '12-24V DC'
                    },
                    环境参数: {
                      工作温度: '-40°C~+70°C',
                      存储温度: '-55°C~+85°C',
                      湿度: '5%~95% RH',
                      防护等级: 'IP65'
                    },
                    认证信息: {
                      CE认证: '已通过',
                      FCC认证: '已通过',
                      RoHS认证: '符合标准',
                      ISO9001: '质量体系认证'
                    }
                  },
                  子规格B: {
                    详细配置: {
                      处理器: 'ARM Cortex-M7',
                      内存: '1MB Flash',
                      接口: 'CAN/RS485/Ethernet/WiFi',
                      电源: '9-36V DC'
                    },
                    环境参数: {
                      工作温度: '-40°C~+85°C',
                      存储温度: '-55°C~+125°C',
                      湿度: '5%~95% RH',
                      防护等级: 'IP67'
                    }
                  }
                },
                规格2: {
                  子规格X: {
                    硬件配置: {
                      主控芯片: 'STM32F407',
                      通信模块: '4G/WiFi/蓝牙',
                      存储容量: '32GB eMMC',
                      显示屏: '7寸触摸屏'
                    },
                    软件功能: {
                      操作系统: 'Linux 4.19',
                      应用框架: 'Qt 5.12',
                      数据库: 'SQLite',
                      通信协议: 'Modbus/OPC-UA'
                    },
                    扩展接口: {
                      USB接口: '2个USB 3.0',
                      串口: '4路RS485',
                      网络接口: '2路千兆以太网',
                      IO接口: '16路数字IO'
                    }
                  },
                  子规格Y: {
                    硬件配置: {
                      主控芯片: 'RK3568',
                      通信模块: '5G/WiFi6/蓝牙5.0',
                      存储容量: '64GB eMMC',
                      显示屏: '10寸触摸屏'
                    }
                  }
                }
              }
            },
            
            // 示例4 - 混合情况：部分有子项，部分无子项
            产品D: {
              标准型: {
                // 有子项
                配置选项: {
                  基础配置: '标准功能包',
                  高级配置: '增强功能包',
                  定制配置: '客户定制'
                }
              },
              经济型: {
                // 无子项，直接显示值
                基本参数: '简化版本',
                适用场景: '成本敏感应用',
                技术支持: '基础技术支持'
              },
              旗舰型: {
                // 有多层子项
                核心技术: {
                  AI算法: {
                    机器学习: 'TensorFlow Lite',
                    图像识别: 'OpenCV 4.5',
                    语音识别: 'PocketSphinx',
                    自然语言: 'NLTK'
                  },
                  硬件加速: {
                    GPU加速: 'Mali-G52',
                    NPU加速: '2TOPS算力',
                    DSP加速: 'HiFi4 DSP'
                  }
                }
              }
            },
            
            // 示例5 - 深层嵌套示例
            产品E: {
              工业级: {
                系列A: {
                  型号A1: {
                    版本V1: {
                      硬件版本: {
                        主板: 'Rev 2.1',
                        电源板: 'Rev 1.3',
                        接口板: 'Rev 1.0'
                      },
                      软件版本: {
                        固件: 'V2.1.5',
                        驱动: 'V1.8.2',
                        应用: 'V3.2.1'
                      }
                    },
                    版本V2: {
                      硬件版本: {
                        主板: 'Rev 3.0',
                        电源板: 'Rev 2.0',
                        接口板: 'Rev 1.5'
                      }
                    }
                  },
                  型号A2: {
                    版本V1: {
                      特殊功能: {
                        加密模块: 'AES-256',
                        安全芯片: 'TPM 2.0',
                        防篡改: '硬件级保护'
                      }
                    }
                  }
                },
                系列B: {
                  型号B1: {
                    标准配置: '基础功能集',
                    可选配置: '扩展功能包'
                  }
                }
              }
            },

            // 原有的基础属性（无子项，显示在右侧面板）
            A001_型号: 'W02-5312-1101-001',
            A002_名称: '发动机支架',
            A004_零部件类型: '结构件',
            A005_重量代码: 'W001',
            A006_单件单装重量: '2.5kg',
            A007_工艺方法: 'CNC加工',
            A008_特性分类: 'A级',
            A009_互换性: '完全互换',
            A010_使用寿命: '10000小时',
            A011_外廓尺寸: '200x150x80mm',
            A012_强度值: '450MPa',
            A013_物料代码: 'MAT001',
            A014_供应商: '航空制造公司',
            A015_设计版本: 'V2.1',
            A016_审核状态: '已批准',
            A017_制造日期: '2024-01-15',
            A018_检验标准: 'AS9100',
            A019_存储条件: '常温干燥',
            A020_包装要求: '防震包装'
          },
          外部参考: {
            REF001: '参考文件1.dwg',
            REF002: '参考文件2.step',
            REF003: '参考文件3.iges',
            REF004: '参考文件4.pdf',
            REF005: '技术规范.doc',
            REF006: '检验标准.pdf',
            REF007: '工艺卡片.xlsx',
            REF008: '质量计划.doc'
          },
          连接定义: {
            CONN001: '螺栓连接M8x25',
            CONN002: '螺栓连接M10x30',
            CONN003: '焊接连接WLD001',
            CONN004: '铆接连接RIV001',
            CONN005: '胶接连接ADH001',
            CONN006: '卡扣连接CLP001',
            CONN007: '插接连接PLG001',
            CONN008: '压配连接PRS001',
            CONN009: '螺纹连接THR001',
            CONN010: '销连接PIN001',
            CONN011: '键连接KEY001',
            CONN012: '焊缝连接WLD002',
            CONN013: '铆钉连接RIV002',
            CONN014: '螺母连接NUT001',
            CONN015: '垫圈连接WSH001'
          },
          工程几何: {
            GEO001: '主体结构',
            GEO002: '安装孔φ8',
            GEO003: '安装孔φ10',
            GEO004: '定位销孔φ6',
            GEO005: '螺纹孔M8',
            GEO006: '螺纹孔M10',
            GEO007: '倒角C2',
            GEO008: '圆角R5',
            GEO009: '沉头孔φ12',
            GEO010: '键槽8x7',
            GEO011: '表面粗糙度Ra3.2',
            GEO012: '平面度0.02',
            GEO013: '圆度0.01',
            GEO014: '垂直度0.05',
            GEO015: '同轴度0.03'
          },
          构造几何: {
            CONST001: '基准面A',
            CONST002: '基准面B',
            CONST003: '基准面C',
            CONST004: '基准轴X',
            CONST005: '基准轴Y',
            CONST006: '基准轴Z',
            CONST007: '辅助线L1',
            CONST008: '辅助线L2',
            CONST009: '辅助点P1',
            CONST010: '辅助点P2'
          },
          标注辅助几何: {
            DIM001: '长度标注200±0.1',
            DIM002: '宽度标注150±0.1',
            DIM003: '高度标注80±0.1',
            DIM004: '孔径标注φ8+0.02/0',
            DIM005: '孔径标注φ10+0.02/0',
            DIM006: '角度标注45°±30′',
            DIM007: '半径标注R5±0.05',
            DIM008: '倒角标注C2±0.1',
            DIM009: '螺纹标注M8x1.25',
            DIM010: '螺纹标注M10x1.5'
          }
        },
        B_对标信息: {
          对标零件: 'REF-ENGINE-BRACKET-001',
          对标厂家: '波音公司',
          技术等级: '航空级',
          认证标准: 'FAA-PMA',
          性能指标: {
            强度: '480MPa',
            疲劳寿命: '50000次',
            耐温范围: '-55°C~+125°C',
            重量: '2.3kg'
          }
        },
        D_通用注释: {
          NOTE001: '所有尺寸单位为毫米',
          NOTE002: '未注公差按IT14级',
          NOTE003: '表面粗糙度Ra6.3',
          NOTE004: '去除毛刺锐边',
          NOTE005: '热处理后机加工',
          NOTE006: '检验按图纸要求',
          NOTE007: '包装运输注意防护',
          NOTE008: '存储环境要求干燥'
        },
        I_质法说明: {
          检验方法: '三坐标测量',
          检验频次: '首件+巡检',
          检验工具: 'CMM+量具',
          质量标准: 'AS9100D',
          不合格处理: '返工或报废',
          记录要求: '完整可追溯'
        },
        E_零件注释: {
          材料要求: '铝合金7075-T6',
          热处理: 'T6时效处理',
          表面处理: '阳极氧化',
          精度等级: 'IT7',
          检验要求: '100%检验',
          包装要求: '单件包装'
        },
        F_主材料注释: {
          材料牌号: '7075-T6',
          供应商: '西南铝业',
          材料证书: 'TC-2024-001',
          化学成分: 'Al-Zn-Mg-Cu',
          力学性能: '抗拉强度≥540MPa',
          热处理状态: 'T6'
        },
        G_辅助材料注释: {
          螺栓: '不锈钢A4-80',
          垫圈: '不锈钢A4',
          密封胶: '航空密封胶',
          涂层: '防腐涂层',
          标识: '激光打标',
          包装材料: '防静电袋'
        },
        J_热表处理注释: {
          热处理工艺: 'T6时效处理',
          处理温度: '120°C±5°C',
          保温时间: '24小时',
          冷却方式: '空冷',
          硬度要求: 'HB150-180',
          检验方法: '洛氏硬度'
        }
      }
    }
  },
  'info-compare': {
    '对比项目': {
      基本信息: {
        零件A: {
          型号: 'W02-5312-1101-001',
          名称: '发动机支架',
          重量: '2.5kg',
          材料: '铝合金7075'
        },
        零件B: {
          型号: 'W02-5312-1101-002',
          名称: '发动机支架改进版',
          重量: '2.3kg',
          材料: '铝合金7075-T6'
        }
      },
      尺寸对比: {
        长度: { A: '200mm', B: '195mm', 差异: '-5mm' },
        宽度: { A: '150mm', B: '150mm', 差异: '0mm' },
        高度: { A: '80mm', B: '75mm', 差异: '-5mm' }
      },
      性能对比: {
        强度: { A: '450MPa', B: '480MPa', 差异: '+30MPa' },
        重量: { A: '2.5kg', B: '2.3kg', 差异: '-0.2kg' },
        成本: { A: '¥1200', B: '¥1350', 差异: '+¥150' }
      }
    }
  },
  'point-extract': {
    '提取点位': {
      关键点: {
        P001: { x: 0, y: 0, z: 0, 描述: '原点' },
        P002: { x: 100, y: 0, z: 0, 描述: '安装点1' },
        P003: { x: 200, y: 0, z: 0, 描述: '安装点2' },
        P004: { x: 0, y: 75, z: 0, 描述: '安装点3' },
        P005: { x: 100, y: 75, z: 0, 描述: '中心点' }
      },
      测量点: {
        M001: { x: 50, y: 25, z: 10, 描述: '测量点1' },
        M002: { x: 150, y: 25, z: 10, 描述: '测量点2' },
        M003: { x: 50, y: 50, z: 20, 描述: '测量点3' },
        M004: { x: 150, y: 50, z: 20, 描述: '测量点4' }
      },
      检验点: {
        I001: { x: 25, y: 12.5, z: 5, 描述: '检验点1' },
        I002: { x: 175, y: 12.5, z: 5, 描述: '检验点2' },
        I003: { x: 25, y: 62.5, z: 15, 描述: '检验点3' }
      }
    }
  },
  'point-compare': {
    '点位对比': {
      设计点位: {
        P001_设计: { x: 0, y: 0, z: 0, 公差: '±0.1' },
        P002_设计: { x: 100, y: 0, z: 0, 公差: '±0.1' },
        P003_设计: { x: 200, y: 0, z: 0, 公差: '±0.1' }
      },
      实际点位: {
        P001_实际: { x: 0.05, y: -0.02, z: 0.01, 偏差: '0.054mm' },
        P002_实际: { x: 99.98, y: 0.03, z: -0.01, 偏差: '0.036mm' },
        P003_实际: { x: 200.02, y: -0.01, z: 0.02, 偏差: '0.028mm' }
      },
      偏差分析: {
        最大偏差: '0.054mm',
        平均偏差: '0.039mm',
        合格率: '100%',
        超差点数: '0'
      }
    }
  },
  'geometry-compare': {
    '几何对比': {
      基础几何: {
        圆柱体: { 直径: '50mm', 高度: '100mm', 体积: '196350mm³' },
        长方体: { 长: '200mm', 宽: '150mm', 高: '80mm', 体积: '2400000mm³' },
        圆锥体: { 底径: '30mm', 高: '60mm', 体积: '14137mm³' }
      },
      复杂几何: {
        自由曲面: { 面积: '15000mm²', 曲率: '0.02/mm', 光顺度: '0.001' },
        螺旋面: { 螺距: '5mm', 圈数: '10', 长度: '314mm' },
        倒角面: { 角度: '45°', 宽度: '2mm', 长度: '800mm' }
      },
      几何精度: {
        平面度: '0.02mm',
        圆度: '0.01mm',
        圆柱度: '0.015mm',
        直线度: '0.008mm',
        垂直度: '0.02mm'
      }
    }
  }
};

export const sampleJsonData = buildJsonNode('W02-5312-1101-001', sampleDataStructures.structure['W02-5312-1101-001'], []);
jsonData.set(sampleJsonData);

// Function to update data based on selected sidebar option
export function updateDataForOption(optionId: string) {
  const data = sampleDataStructures[optionId as keyof typeof sampleDataStructures];
  if (data) {
    const rootKey = Object.keys(data)[0];
    const newData = buildJsonNode(rootKey, data[rootKey], []);
    jsonData.set(newData);
  }
}