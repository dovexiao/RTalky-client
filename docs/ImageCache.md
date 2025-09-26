# ImageCache（头像缓存）

位置：`src/utils/ImageCache.ts`

## 职责
- 将 base64 图片（头像）持久化到缓存目录，返回本地文件路径供 UI 渲染。
- 提供头像缓存的查询、清理与统计能力。

## 目录与分组
- 缓存根：`RNFS.CachesDirectoryPath/images/`
- 分组：当前仅 `AVATARS` → `images/avatars/`

## 能力
- `saveImageToFile(base64, group)`：
  - 生成 base64 的 sha256 作为文件名，避免重复写入。
  - 若文件已存在直接返回路径；否则写入新文件，返回本地路径。
  - 自动初始化分组目录。
- `getCachedAvatarPath(base64)`：检查同源 base64 是否已有缓存文件，存在则返回路径。
- `cleanAvatarCacheByAge(maxAgeDays=7)`：删除超过指定天数未更新的头像文件。
- `cleanAllAvatarCache()`：清理分组内全部头像文件。
- `getAvatarCacheSize()`：统计头像缓存占用体积（字节）。

## 使用与场景
- 登录/拉取用户信息后，将远程头像（base64）落盘，再将本地路径写回到用户资料，避免重复网络渲染与闪烁。
- 用户更换头像时，可先 `saveImageToFile` 再更新资料；或定期调用清理方法控制占用。

## 注意事项
- 输入需为 base64 数据，可自动去除 `data:image/jpeg;base64,` 前缀。
- 文件后缀固定为 `.jpg`；如需支持 WEBP/PNG，可在哈希命名策略中携带 mime 信息。
- 清理接口会直接删除文件，请确保文件不在使用中。
