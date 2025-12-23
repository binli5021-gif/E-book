# 部署指南

## 方法一：使用 Vercel 部署（推荐，最简单）

### 步骤：

1. **准备 GitHub 仓库**
   - 确保代码已推送到 GitHub（已完成 ✅）

2. **注册 Vercel 账号**
   - 访问：https://vercel.com
   - 使用 GitHub 账号登录（推荐）

3. **部署项目**
   - 登录后，点击 "Add New Project"（添加新项目）
   - 选择你的 GitHub 仓库 `binli5021-gif/E-book`
   - 点击 "Import"（导入）

4. **配置项目**
   - **Framework Preset（框架预设）：** 选择 "Vite"
   - **Root Directory（根目录）：** 留空（默认）
   - **Build Command（构建命令）：** `npm run build`（默认）
   - **Output Directory（输出目录）：** `dist`（默认）

5. **配置环境变量**
   - 在 "Environment Variables"（环境变量）部分，添加：
     - **Name:** `VITE_SUPABASE_URL`
     - **Value:** `https://qwuzhtxxhxwazlegcoxc.supabase.co`
   - 点击 "Add Another"（添加另一个）
     - **Name:** `VITE_SUPABASE_ANON_KEY`
     - **Value:** `sb_publishable_fb4y64jEBeDbRQrP5d855g_N69jMUHm`

6. **部署**
   - 点击 "Deploy"（部署）按钮
   - 等待部署完成（通常 1-2 分钟）

7. **访问你的网站**
   - 部署完成后，Vercel 会给你一个网址，类似：`https://e-book-xxx.vercel.app`
   - 点击这个网址就可以访问你的书架应用了！

### 后续更新
- 每次你推送代码到 GitHub，Vercel 会自动重新部署
- 无需手动操作

---

## 方法二：使用 Netlify 部署

### 步骤：

1. **注册 Netlify 账号**
   - 访问：https://www.netlify.com
   - 使用 GitHub 账号登录

2. **部署项目**
   - 点击 "Add new site" → "Import an existing project"
   - 选择你的 GitHub 仓库

3. **配置构建设置**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **配置环境变量**
   - 点击 "Site settings" → "Environment variables"
   - 添加：
     - `VITE_SUPABASE_URL` = `https://qwuzhtxxhxwazlegcoxc.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_fb4y64jEBeDbRQrP5d855g_N69jMUHm`

5. **部署**
   - 点击 "Deploy site"
   - 等待部署完成

---

## 方法三：使用 GitHub Pages（需要额外配置）

如果你想要使用 GitHub Pages，需要修改 `vite.config.js` 添加 `base` 配置。

---

## 注意事项

1. **环境变量安全**
   - ✅ `.env` 文件已经在 `.gitignore` 中，不会上传到 GitHub
   - ✅ 在部署平台配置环境变量时，确保使用正确的值

2. **Supabase 数据库**
   - 确保数据库表已经创建（已完成 ✅）
   - 确保 RLS（Row Level Security）策略已配置（已完成 ✅）

3. **自定义域名（可选）**
   - Vercel 和 Netlify 都支持免费自定义域名
   - 在项目设置中可以配置

---

## 推荐方案

**推荐使用 Vercel**，因为：
- ✅ 对 Vite 项目支持最好
- ✅ 自动检测配置
- ✅ 部署速度快
- ✅ 有免费 HTTPS
- ✅ 自动从 GitHub 部署

