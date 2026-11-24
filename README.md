# 行业英语词库 (industry-vocab)

输入行业名称，自动收集该行业内**高频常用英语词汇**。

支持 **CLI**、**移动端 Web**（可打包为 iOS/Android APK），以及戒指/手杖快捷操作。

## 功能

- 支持中文或英文行业名（如 `金融`、`healthcare`、`科技`）
- 多数据源聚合排序：
  - **种子库**：20+ 行业 curated 高频词（离线可用）
  - **Datamuse**：语义相关词 + 主题触发词
  - **Wikipedia**：行业术语文章抽取
- 按综合得分排序，显示来源与分数
- 点击词条复制；导出 TXT 词汇表

## 命令

```bash
cd active/industry-vocab
npm install
npm test
npm run build
npm start          # 本地预览 http://localhost:5180

# CLI
npm run collect -- 金融
npm run collect -- finance --limit 50
npm run collect -- healthcare --json
npm run collect -- 科技 --offline
npm run collect -- --list
```

## 预置行业

金融、医疗、科技、营销、法律、教育、制造、物流、酒店旅游、能源、房地产、会计、人力资源、建筑、农业、传媒、零售、汽车、航空航天、生物医药等。

## 穿戴操作

- **戒指晃动**：重新收集
- **手杖敲击**：导出词汇表
- 点击「启用戒指/手杖」授权传感器（iOS 需用户手势）

## 移动端打包

```bash
npm run sync:android    # 构建 www 并同步到 Android
npm run apk:debug       # 打出 debug APK
npm run mobile:android  # 同步并用 Android Studio 打开
```

APK 输出：`android/app/build/outputs/apk/debug/app-debug.apk`

HTML / `src/` 变更后先执行 `npm run build`，再 `npx cap sync`。

## 架构

```
src/
  collect.js        # 收集编排
  industry-map.js   # 行业名归一化
  seeds.js          # 离线种子词库
  sources/remote.js # Datamuse + Wikipedia
  rank.js           # 打分合并
  tokenize.js       # 英文词条提取
  app.js            # 移动端 UI
```
