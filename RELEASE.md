# 发布说明（Release）

## Release 资产
- `StarMapAI_vX.Y.Z.zip`：可直接在 Chrome / Edge 通过“加载解压缩”使用的打包文件（解压后选择文件夹，通常放在 `starmap-ai-release/`）。

## 如何打包
在 Windows PowerShell 中执行（建议在仓库根目录）：

```powershell
New-Item -ItemType Directory -Force -Path .\starmap-ai-release | Out-Null
if (Test-Path .\starmap-ai-release\StarMapAI.zip) { Remove-Item .\starmap-ai-release\StarMapAI.zip -Force }
Compress-Archive -Path .\starmap-ai-extension\* -DestinationPath .\starmap-ai-release\StarMapAI.zip -Force
```

## 安装（Chrome / Edge）
1. 打开扩展管理页  
   - Chrome：`chrome://extensions/`  
   - Edge：`edge://extensions/`
2. 开启“开发者模式”
3. 点击“加载解压缩”
4. 选择 `starmap-ai-extension` 文件夹（或 Release zip 解压后的文件夹）
