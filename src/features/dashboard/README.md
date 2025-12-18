# Dashboard 组件架构文档

> 📍 **位置**: `src/features/dashboard/`
>
> **当前范围**: Part 1 (Internal Exception Radar)
> **技术栈**: Ant Design v5 + TypeScript + React Hooks (Props-driven)
> **数据层**: Mock DB + Frontend Analytics

---

## 核心架构设计 (Refactored)

### 1. 数据流架构 (Data Flow)
本次重构采用了 **Smart Container + Dumb Components** 的模式，移除了子组件对全局 Store 的直接依赖。

- **数据源 (Data Source)**:
  - `src/data/mockContractDb.ts`: 包含约 100 条模拟合同数据，涵盖各类异常场景（Zombie, Late, Blocked）。
- **逻辑层 (Analytics Layer)**:
  - `src/utils/dashboardAnalytics.ts`: 纯函数集合，负责从 Raw Data 计算 KPI、筛选关键合同、统计数据质量等。
  - 主要函数: `calculateKPIs`, `getKeyContracts`, `getDataQualityStats`, `getZombieInventory`.
- **容器层 (Container)**:
  - `InternalExceptionRadar.tsx`: 负责获取数据 (`useMemo`)、管理筛选状态 (`useState`)，并将计算好的数据通过 **Props** 传递给子组件。

### 2. 组件职责详情

#### 2.1 统一容器 (`InternalExceptionRadar.tsx`)
- **角色**: Controller / Coordinator
- **职责**:
  - 维护 `selectedFilter` 状态 (点击 KPI 卡片触发)。
  - 调用 Analytics 函数计算当前视图所需的数据 (`kpiData`, `keyContracts`, `zombieStats`, `dataQualityStats`)。
  - 向下分发数据和回调函数。

#### 2.2 KPI 概览 (`KPISummary.tsx`)
- **角色**: Dumb Component (UI Only)
- **Props**: `{ kpis: DashboardKPI[], selectedFilter: string, onFilterSelect: fn }`
- **变化**: 不再读取全局 Store，完全由父组件驱动高亮和点击事件。

#### 2.3 关键合同列表 (`KeyContractsOverview.tsx`)
- **角色**: Dumb Component (UI + Local View Control)
- **Props**: `{ contracts: KeyContractView[] }`
- **逻辑**:
  - 接收已经由父组件基于 KPI 筛选过的 `contracts` 列表。
  - **内部筛选**: 仅维护 UI 相关的二级筛选 (Blocker / Severe Delay) 和视图切换 (List / Graph)，不影响全局数据。

#### 2.4 僵尸与数据质量 (`ZombieInventory.tsx` / `DataQualityMonitor.tsx`)
- **角色**: Dumb Components
- **Props**: `{ data: ZombieStats }` / `{ data: DataQualityStat }`
- **逻辑**: 纯展示组件，根据传入的统计对象渲染图表和列表。

---

## 目录索引

```
src/features/dashboard/Part1/
├── InternalExceptionRadar.tsx   # [Smart] 容器组件，数据入口
├── KPISummary.tsx               # [Dumb] KPI 指标展示
├── KeyContractsOverview.tsx     # [Dumb] 核心合同列表
├── ZombieInventory.tsx          # [Dumb] 僵尸库存/合同展示
└── DataQualityMonitor.tsx       # [Dumb] 数据质量监控面板

src/utils/
└── dashboardAnalytics.ts        # [Logic] 数据聚合与计算逻辑

src/data/
└── mockContractDb.ts            # [Data] 模拟数据库
```
