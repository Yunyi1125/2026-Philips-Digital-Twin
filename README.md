# Philips Field Project 数字孪生看板

本仓库中的前端看板用于 **2026 Philips Field Project / 数字孪生** 场景：把产线各工位（S1–S5）的 **CTQ（关键质量特性）** 随「每台产品（unit）」演化的过程可视化，便于对照规格、观察趋势与异常。

## 这个 Dashboard 做什么

- **按样本回放**：沿 `Sample` 序号逐台推进（可播放/暂停、调节速度），模拟产线时间推进。
- **规格与超差**：CTQ 的目标值、LSL/USL 来自文档 *FieldProject_DigitalTwin_2026* 中的 **Table 1**；对当前样本自动标出 **未落在规格内的 CTQ**。
- **主视图**：中间区域用动画展示当前样本的关键信息；下方用 **Plotly** 绘制各 CTQ 在 **滑动时间窗**（最近若干台已完工 unit）内的分布与轨迹，便于看短期波动与是否贴边、超差。
- **侧栏**：当前样本号、失败 CTQ 列表、图表窗口长度等控制项。

数据列对应 `src/ctqSpecs.ts` 中定义的工位与指标（如 S1_Q1、S2_Q1…，单位含 μm、Hz 等）。

## 数据说明（仓库不含原始数据）

应用从 **`/dataset_Philips_FieldProject_2026.csv`** 加载数据（开发时对应 **`public/dataset_Philips_FieldProject_2026.csv`**）。  
出于合规与体积考虑，**原始 CSV 不会提交到 Git**（见 `.gitignore`）。

本地运行前请自行将符合列名的 CSV 放入 `public/` 目录，文件名与上述一致；CSV 需包含表头，且至少包含 `Sample` 与各 CTQ 列（与 `ctqSpecs.ts` 中键名一致）。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 技术栈

React 18、TypeScript、Vite、Papa Parse（CSV）、Plotly.js（图表）。

## 与主项目的关系

本看板作为 **[Yunyi1125/2026-Philips-Digital-Twin](https://github.com/Yunyi1125/2026-Philips-Digital-Twin)** 仓库中的前端部分，用于数字孪生/现场项目数据的可视化探索；**业务结论仍以正式数据与文档为准。**
