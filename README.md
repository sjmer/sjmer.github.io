# AJM · 个人主页

一个单页个人名片站：深色宇宙背景、星场动画、克制的细边框排版，风格参考 OpenAI / ChatGPT 官网。
纯静态 Jekyll 站点，不依赖任何外部 CDN 与在线字体，可以直接托管在 GitHub Pages 上。

- 页面：首页 + 404
- 技术：Jekyll 4（Liquid 模板）+ 原生 CSS + 无依赖 JS
- 部署：GitHub Actions 自动构建发布，推送到 `main` 即上线
- 线上地址：<https://sjmer.top>

---

## 一、部署

### 1. 仓库与域名

仓库 `sjmer/sjmer.github.io`，绑定自定义域名 **`sjmer.top`**
（由仓库根目录的 `CNAME` 文件指定）。因此站点地址是 `https://sjmer.top`，
`_config.yml` 里的 `baseurl` 必须保持为空。

> **不要删 `CNAME` 文件。** 它和 Settings → Pages 里的 Custom domain 一起决定域名绑定；
> 删掉会让站点退回 `https://sjmer.github.io`。

### 2. 推送代码

```bash
git add .
git commit -m "更新个人主页"
git push
```

> `git push` 偶尔会因为代理时通时断而报 TLS 错误，重试一次通常就好；
> 如果一直失败，检查代理设置和 Git 已保存的凭据。

### 3. 开启 Pages

仓库 → **Settings** → **Pages** → *Build and deployment* 的 **Source** 选择 **GitHub Actions**。

之后每次推送到 `main`，[`.github/workflows/pages.yml`](.github/workflows/pages.yml) 都会自动构建并发布，
约 1 分钟后生效；也可以在 Actions 页面手动点 **Run workflow**，用 `build`、`deploy` 两个任务的绿灯确认成功。

### 4. 以后换域名

两处一起改：根目录 `CNAME` 文件的内容、`_config.yml` 里的 `url`。

---

## 二、改成你自己的内容

**90% 的文字都在一个文件里**：[`_data/profile.yml`](_data/profile.yml)

| 字段 | 含义 |
| --- | --- |
| `name` | 显示用名字 |
| `tagline` | 名字下面那句身份描述 |
| `status` / `location` | 顶部状态小标签 |
| `intro` | 首页那段自我介绍 |
| `links` | 「找到我」里的卡片（label / handle / url / icon） |

其中 `icon` 可选 `github`、`bilibili`、`mail`，图标定义在
[`_includes/icon.html`](_includes/icon.html)，想加别的平台就在里面再写一个 `when` 分支。

其它位置：

- **网址**：`_config.yml` 里的 `url` 改成你的实际地址。
- **换头像**：把自己的照片丢给 [`tools/gen_avatar.py`](tools/gen_avatar.py)（自动去白底 + 底部渐隐，
  输出 `assets/img/avatar.png`）：
  ```bash
  python tools/gen_avatar.py 原图.png        # 需要 pillow、numpy、scipy
  ```
  换照片后如果裁剪位置不合适，改脚本顶部的 `CROP_X` / `CROP_Y` / `CROP_SIZE` 再跑一次即可；
  不想去背景也可以直接用任意方形照片覆盖 `assets/img/avatar.png`。
- **换图标颜色**：`assets/css/style.css` 里 `.link-card__badge` 的 `color`（默认 `#b9c6ff`）。
- **换配色**：`assets/css/style.css` 顶部 `:root` 里的 `--accent`、`--bg` 等变量。
  想把整站改成浅色，把 `color-scheme: dark` 改成 `light` 并调整 `--bg` / `--fg` 即可，
  背景层（星场、星云）建议同时隐藏。
- **调整字号**：全站字号由 `style.css` 里 `html { font-size: 17px }` 统一控制，
  改这一个数字就整体放大/缩小。
- **换分享图**：`assets/img/og.png` 由 `tools/gen_og.py` 生成，
  改完名字后执行 `python tools/gen_og.py` 重新生成（需要 Pillow）。

---

## 三、本地预览（可选，需要 Ruby 3.x）

改文案时可以本地起服务看效果，不必等线上构建：

```bash
bundle install
bundle exec jekyll serve
# 打开 http://127.0.0.1:4000
```

Windows 上装 Ruby 推荐 [RubyInstaller](https://rubyinstaller.org/)（勾选 MSYS2 那一步）。
没有 Ruby 也不影响部署——直接推送，GitHub Actions 会帮你构建。

---

## 四、目录结构

```
.
├── _config.yml              # 站点配置（网址、标题、排除文件）
├── _data/profile.yml        # ★ 个人信息，改这个文件就够了
├── _layouts/default.html    # 页面骨架（head、背景层、页脚）
├── _includes/icon.html      # 链接卡片用的图标（GitHub / Bilibili / 邮箱）
├── index.html               # 首页内容
├── 404.html                 # 404 页面
├── CNAME                    # 自定义域名 sjmer.top（别删）
├── assets/
│   ├── css/style.css        # 全部样式
│   ├── js/starfield.js      # 星场 / 流星 / 光标光晕
│   └── img/                 # avatar.png、favicon.svg、og.png
├── tools/gen_avatar.py      # 裁头像（不参与构建）
├── tools/gen_og.py          # 生成分享图（不参与构建）
└── .github/workflows/pages.yml  # 自动部署
```

---

## 五、常见问题

**样式没加载 / 点进内页变 404**
`baseurl` 不对。绑了独立域名（`sjmer.top`）时 `baseurl` 必须是空字符串；
如果哪天改用 `sjmer.github.io`，同样保持为空。只有项目主页（`用户名.github.io/仓库名`）
才需要 `baseurl`，而那种情况下 Actions 里的 `configure-pages` 会自动传入正确值，不用手写。

**`sjmer.top` 提示证书错误 / 打不开**

> 仓库迁到新账号（`sjmer`）后，域名要重新绑定、证书要重新签发，按下面的步骤做一遍，
> 并在证书就绪后重新勾选 **Enforce HTTPS**。

浏览器看到的是 `*.github.io` 的证书而不是 `sjmer.top` 的，于是被判定为「证书与域名不匹配」。
**这是 GitHub 侧的签发状态问题，不是站点代码问题**，先用 `http://sjmer.top/assets/css/style.css`
（纯 HTTP 绕过证书）确认部署本身是好的。

关键经验：**重复提交同一个 Custom domain 不会重新触发签发**，要把域名改成一个别的值再改回来
（API 上就是两次 `PUT /repos/{owner}/{repo}/pages`），几分钟内就能 `approved`。

DNS 记录（`@` 的四条 A 记录不变，`www` 的 CNAME 要指向新账号）：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `sjmer.github.io` |

证书由 GitHub 自动申请，一般在 DNS 检查通过后几分钟内完成，最长 24 小时。若长时间没动静：

1. Settings → Pages，在 Custom domain 里先 **Remove**，再重新填 `sjmer.top` 并 **Save**，
   强制重新触发一次签发；
2. 等 Custom domain 旁边出现绿色的 `DNS check successful`；
3. 证书就绪后勾选 **Enforce HTTPS**（证书没好之前这个勾选框是灰的）。

只要证书没签发，`https://sjmer.github.io` 也不能作为临时替代地址——
它会 301 跳到 `sjmer.top`，同样卡在证书上。

**Actions 报错 `Get Pages site failed`**
说明仓库还没开启 Pages。先去 Settings → Pages 把 Source 选成 **GitHub Actions**，再重跑。

**`bundle install` 很慢或失败**
Gemfile 只需要 `jekyll` 和 `webrick`。国内网络可换源：
`bundle config mirror.https://rubygems.org https://mirrors.tuna.tsinghua.edu.cn/rubygems/`

**404 页面看不到**
GitHub Pages 的 404 只在线上生效，本地 `jekyll serve` 不会走它。

**想加博客/文章**
`_config.yml` 里加 `collections: { posts: ... }` 或用 `_posts/` 目录，
再把 `permalink` 保持为默认的 `/:title/` 即可，现有页面不受影响。

---

## 许可

页面代码随意取用。个人信息（姓名、邮箱、社交账号）归本人所有，请勿套用。
