# CAVXX

Vue 3 + Vite 视频前端，使用 AppleCMS API PHP 中转。

## 配置文件

### 分类

编辑 `public/class.json`，分类从本地 JSON 加载。

### 广告

编辑 `public/ads.json`：

```json
{
  "enabled": true,
  "slots": {
    "top": [
      {
        "id": "top-banner",
        "enabled": true,
        "type": "image",
        "image": "/ads/banner.webp",
        "alt": "站点广告",
        "href": "https://example.com/"
      }
    ],
    "bottom": []
  }
}
```

支持 `image`、`text`、`html` 三种类型。HTML 类型通过 `v-html` 渲染，只能放置可信任代码。全局 `enabled` 为 `false` 时不显示广告。广告位：`top` 位于导航下方，`bottom` 位于页面内容下方。修改配置后重新部署；SPA 页面切换会更新广告展示。

### 友情链接

编辑 `public/links.json`，按照浏览器实际访问的域名分别配置：

```json
{
  "site-a.example": [
    { "name": "站点A导航", "url": "https://nav-a.example/" }
  ],
  "site-b.example": [
    { "name": "站点B导航", "url": "https://nav-b.example/" }
  ],
  "*.example.net": [
    { "name": "通用导航", "url": "https://nav.example.net/" }
  ]
}
```

精确域名优先于通配符；支持 www 规范化；未匹配域名不显示友情链接。通配符只匹配配置域名的子域名。链接只接受 HTTP/HTTPS 地址。

## 开发与构建

```bash
npm install
npm run dev
npm run build
```

Cloudflare Pages 构建命令：`npm run build`；输出目录：`dist`。
