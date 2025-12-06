# Mini Ad Wall Web

Mini Ad Wall 的前端项目，一个基于 **Vue 3 + Vite + TypeScript + Element Plus + Tailwind CSS** 的小型广告墙管理与展示应用。

前端通过 REST API 与后端交互，实现广告的创建、编辑、复制、删除和点击统计等功能。

---

## 功能特性

- **广告列表展示**
  - 按卡片形式展示广告标题、内容、出价、点击量等信息
  - 点击卡片自动打开 `landingUrl` 并上报点击

- **广告创建 / 编辑 / 复制**
  - 通过弹窗表单创建广告
  - 支持编辑已有广告
  - 一键复制广告数据（不带 `id`），快速创建相似广告

- **动态表单配置**
  - 表单字段由后端接口 `/ads/form-config` 下发
  - 支持字段校验（必填、长度、数字、URL 等）

- **基础统计能力**
  - 展示每条广告的点击量 `clicks`
  - 点击行为会触发 `/ads/click/:id` 接口

---

## 技术栈

- **构建工具**：Vite 7
- **框架**：Vue 3（`<script setup>` + TypeScript）
- **UI 组件库**：Element Plus（简体中文 locale）
- **样式**：Tailwind CSS 4
- **语言**：TypeScript
- **网络请求**：自封装的 `request`（基于 Axios）

---

## 快速开始

### 环境要求

- Node.js：`^20.19.0 || >=22.12.0`
- 包管理工具建议：`pnpm`（项目脚手架默认命令为 `pnpm`）

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

### 构建生产包

```bash
pnpm build
```

### 本地预览生产包

```bash
pnpm preview
```

### 代码检查与格式化

```bash
# ESLint 自动修复 & 缓存
pnpm lint

# Prettier 格式化 src 目录
pnpm format
```

---

## 目录结构（核心部分）

```text
mini-ad-wall-web/
├─ package.json           # 项目依赖与脚本
├─ vite.config.ts         # Vite 配置（含 base 路径、插件等）
├─ src/
│  ├─ main.ts             # 入口文件，挂载 Vue 应用
│  ├─ App.vue             # 根组件，广告墙主界面与逻辑
│  ├─ api/
│  │  └─ ad.ts            # 广告相关 API 封装（列表、创建、删除、点击、表单配置）
│  ├─ types/
│  │  ├─ ad.ts            # Ad / AdForm 类型定义
│  │  └─ formConfig.ts    # 动态表单配置类型定义
│  ├─ components/
│  │  ├─ AdCard.vue       # 广告卡片组件（展示 & 操作按钮）
│  │  └─ AdDialog.vue     # 创建/编辑广告弹窗表单组件
│  └─ utils/
│     └─ request.ts       # Axios 封装（baseURL、拦截器等）
```

## 与后端的接口约定（摘要）

前端通过 `src/api/ad.ts` 与后端交互，主要接口：

- `GET /ads`
  - 获取广告列表
- `POST /ads/create`
  - 创建广告，入参类型为 `AdForm`
- `DELETE /ads/delete/:id`
  - 删除指定 `id` 的广告
- `POST /ads/click/:id`
  - 记录广告点击并更新点击量
- `GET /ads/form-config`
  - 获取表单配置（字段、校验规则等）

对应的 TypeScript 类型在：

- `src/types/ad.ts` 中定义了：
  - `AdForm`：提交表单类型
  - `Ad`：广告实体类型
- `src/types/formConfig.ts` 中定义了：
  - `FormFieldConfig` / `FormConfig`：动态表单字段及校验规则描述

---

## 部署说明

在 `vite.config.ts` 中配置了：

```ts
export default defineConfig({
  base: '/mini-ad-wall/',
  // ...
})
```

因此：

- 若部署到某域名的子路径，例如 `https://example.com/mini-ad-wall/`，此配置可直接使用。
- 若需要部署在根路径 `/`，请修改 `base` 为 `'/'` 或删除该字段后重新构建。

构建产物在 `dist/` 目录，按常规静态资源方式部署到任意静态服务器（如 Nginx、静态托管平台等）。
