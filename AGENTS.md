# industry-vocab

行业英语词库 (industry-vocab) 输入行业名称，自动收集该行业内**高频常用英语词汇**。 支持 **CLI**、**移动端 Web**（可打包为 iOS/Android APK），以及戒指/手杖快捷操作。 功能 - 支持中文或英文行业名（如 `金融`、`healthcare`、`科技`） - 多数据源聚合排序： - **种子库**：20+ 行业 curated 高频词（离线可用） - **Datamuse**：语义相关词 + 主题触发词

## 用途与 Target 判定

行业英语词库（CLI + 可打包移动端）

- 移动端：需要
- 智能硬件：可选（可搁置）

## 目标平台

| 平台 | 方式 | 产出 |
|------|------|------|
| 🤖 Android | Capacitor → Gradle | APK |
| 🍎 iOS | Capacitor（若已加 ios/） | IPA |
| 智能硬件 | 可选（非当前里程碑硬门槛） | 戒指/手杖/手表 |

## 技术栈信号

- 检测到：android, capacitor, node

## 命令

```bash
npm install
npm test
npm run build
npm run start
npm run sync:android
npm run apk:debug
```

## 同步说明

改 Web 源码后执行 `npm run build`（或 `build:web`），再 `npx cap sync android`。打 APK 建议使用 **JDK 17**（`JAVA_HOME` 指向 openjdk@17）。

## 助手约束

- Loop：先定可验证 Done 与停止条件；每切片过验证环；失败回灌；详见 docs/LOOP_ENGINEERING.md
- Harness：遵循根 AGENTS「Harness Engineering」；Guide=本文件，Sensor=测试/CI；同类失误二次须沉淀规则或测试（棘轮）。详见 docs/HARNESS_ENGINEERING.md
- 遵循仓库根 `AGENTS.md`：通用性/扩展性、分阶段里程碑、默认双 Target（**仅当用途适合**）
- 可选 Target 未做时可搁置；不要为不适用形态硬加 APK/穿戴
- 改动保持聚焦；公共逻辑抽到 shared/`tools/`，禁止静默失败

## 验证环 / Done

```bash
npm install
npm test          # 若有
npm run build     # 或 build:web
npx cap sync android   # 若有 android/
# 可选：JAVA_HOME=…/openjdk@17 npm run apk:debug
```

**Done 示例**：测试通过（若有）+ web 产物进 `www/`/`dist/` + `cap sync` 无报错。可选穿戴未做可搁置，不纳入强制 Done。
