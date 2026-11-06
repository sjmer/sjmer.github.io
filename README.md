# sjmer.top

Sjm 的个人小角落：写点喜欢的，展示正在做的东西。

🌐 **https://sjmer.top**

## 技术

- 纯静态：HTML + CSS + 少量原生 JS，无框架、无构建步骤
- 暗色单栏布局，全站唯一强调色 `#FF7A3D`
- 首次访问播放约 2.4 秒的开场动画，尊重系统"减少动态效果"设置
- 通过 GitHub Actions 部署到 GitHub Pages，域名托管在 Cloudflare

## 目录结构

```
.
├── index.html              # 主页
├── 404.html                # 404 页面
├── CNAME                   # 自定义域名
├── assets/
│   ├── css/style.css       # 全部样式（顶部 :root 为设计变量）
│   ├── js/main.js          # 开场动画收尾
│   └── img/                # 头像、网站图标
└── .github/workflows/
    └── pages.yml           # 自动部署
```

## 本地预览

```bash
python -m http.server 8080
# 打开 http://localhost:8080/
```

> 想重看开场动画：用无痕窗口打开，或在 DevTools → Application → Local Storage 中删除 `sjmer-intro`。

## 改配色

修改 `assets/css/style.css` 中的 `--accent` 变量即可。
