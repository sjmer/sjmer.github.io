"""生成 og.png（社交分享预览图，1200x630）。

用法：python tools/gen_og.py
改完 _data/profile.yml 里的名字后可以重新跑一次，让分享图跟上。
"""

import math
import os
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "og.png"

# 找中文字体和等宽字体（Windows / macOS / Linux 常见位置）
FONT_DIRS = [
    Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts",
    Path("/System/Library/Fonts"),
    Path("/usr/share/fonts"),
]


def find_font(names, required=True):
    for d in FONT_DIRS:
        for name in names:
            p = d / name
            if p.exists():
                return str(p)
        for p in d.rglob(names[-1]) if d.exists() else []:
            return str(p)
    if required:
        sys.exit(f"找不到字体 {names}，请修改 FONT_DIRS 或字体文件名。")
    return None


BOLD = find_font(["msyhbd.ttc", "msyhbd.ttf", "PingFang.ttc", "NotoSansCJK-Bold.ttc"])
REG = find_font(["msyh.ttc", "msyh.ttf", "PingFang.ttc", "NotoSansCJK-Regular.ttc"])
# 等宽字体没有中文字形，只能用来写英文和数字；含中文的文字一律用 REG / BOLD
MONO = find_font(["consola.ttf", "Menlo.ttc", "DejaVuSansMono.ttf"])
# Noto Sans CJK 的 .ttc 里依次是 JP / KR / SC / TC / HK，简体中文取下标 2；其余字体取 0
CJK_IDX = 2 if "NotoSansCJK" in REG else 0

BG_TOP = (0x05, 0x06, 0x0A)
BG_BOT = (0x0A, 0x0C, 0x16)
FG = (0xF2, 0xF4, 0xF8)
MUTED = (0xA7, 0xB0, 0xC0)
MUTED2 = (0x71, 0x79, 0x8A)
ACCENT = (0x9D, 0xB2, 0xFF)


def vgrad(top, bot, h=H):
    img = Image.new("RGB", (W, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(h - 1, 1)
        c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (W, y)], fill=c)
    return img


def glow(size, center, radius, color, strength=1.0):
    """返回一张带径向光晕的 RGBA 图层。"""
    r, g, b = color
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    steps = 26
    for i in range(steps, 0, -1):
        t = i / steps
        rad = int(radius * t)
        alpha = int(strength * 34 * (1 - t) ** 2.1)
        d.ellipse(
            [center[0] - rad, center[1] - rad, center[0] + rad, center[1] + rad],
            fill=(r, g, b, alpha),
        )
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.28))


def tracked(draw, xy, text, font, fill, tracking=0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def tracked_width(draw, text, font, tracking=0):
    total = sum(draw.textlength(ch, font=font) for ch in text)
    return total + tracking * (len(text) - 1)


base = vgrad(BG_TOP, BG_BOT).convert("RGBA")

# 星云光晕
base.alpha_composite(glow((W, H), (520, -140), 620, (70, 92, 210), 1.0))
base.alpha_composite(glow((W, H), (1180, 620), 540, (150, 84, 220), 0.9))
base.alpha_composite(glow((W, H), (140, 700), 420, (52, 176, 196), 0.7))

# 星点
random.seed(7)
stars = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(stars)
for _ in range(170):
    x = random.uniform(0, W)
    y = random.uniform(0, H)
    rad = random.choice([0.6, 0.8, 0.9, 1.1, 1.3, 1.7, 2.2])
    a = int(random.uniform(0.18, 0.85) * 255)
    tint = random.random()
    col = (255, 255, 255) if tint > 0.28 else ((168, 192, 255) if tint > 0.14 else (206, 176, 255))
    sd.ellipse([x - rad, y - rad, x + rad, y + rad], fill=col + (a,))
stars = stars.filter(ImageFilter.GaussianBlur(0.4))
base.alpha_composite(stars)

# 顶部高光细线
edge = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ed = ImageDraw.Draw(edge)
ed.line([(W * 0.18, 0), (W * 0.82, 0)], fill=(255, 255, 255, 90), width=2)
base.alpha_composite(edge.filter(ImageFilter.GaussianBlur(1.2)))

draw = ImageDraw.Draw(base)
PX = 96

# ── 顶部小标签
f_label = ImageFont.truetype(MONO, 21, index=0)
d = ImageDraw.Draw(base)
tw = tracked_width(d, "PERSONAL SITE", f_label, 5)
tracked(d, (PX - 8, 74), "PERSONAL SITE", f_label, MUTED2, 5)

# 标签前的星形小图标
sx, sy = PX - 46, 84
for ang in (0, 90, 180, 270):
    rad = math.radians(ang)
    d.line(
        [(sx + math.cos(rad) * 3, sy + math.sin(rad) * 3),
         (sx + math.cos(rad) * 9, sy + math.sin(rad) * 9)],
        fill=ACCENT, width=2,
    )

# ── 大标题 AJM（渐变填充）
f_big = ImageFont.truetype(BOLD, 148, index=CJK_IDX)
title_mask = Image.new("L", (W, H), 0)
td = ImageDraw.Draw(title_mask)
td.text((PX - 6, 132), "AJM", font=f_big, fill=255)

grad = Image.new("RGB", (W, H))
gd = ImageDraw.Draw(grad)
for y in range(H):
    t = min(max((y - 150) / 300, 0), 1)
    c = tuple(int(FG[i] + ((0xB7, 0xC3, 0xFF)[i] - FG[i]) * t) for i in range(3))
    gd.line([(0, y), (W, y)], fill=c)
glowtxt = Image.new("RGBA", (W, H), (0, 0, 0, 0))
glowtxt.paste(grad, (0, 0), title_mask)
glowtxt = glowtxt.filter(ImageFilter.GaussianBlur(1))
base.alpha_composite(glowtxt)

# ── 副标题
f_sub = ImageFont.truetype(REG, 38, index=CJK_IDX)
d = ImageDraw.Draw(base)
d.text((PX, 330), "一个在读大二的普通学生", font=f_sub, fill=MUTED)

# ── 分隔线
d.line([(PX, 412), (PX + 420, 412)], fill=(255, 255, 255, 46), width=2)

# ── 底部信息
# 这一行含中文，必须用中文字体（之前用 MONO，中文会变成方块）
f_meta = ImageFont.truetype(REG, 23, index=CJK_IDX)
d.text((PX, 456), "在读大二  ·  中国 · 宁波", font=f_meta, fill=MUTED2)

# 域名放在右下角，避开头像外圈（圈的下沿在 y≈486）
f_meta2 = ImageFont.truetype(MONO, 21, index=0)
right = "sjmer.top"
rw = tracked_width(d, right, f_meta2, 2)
tracked(d, (W - PX - rw, 552), right, f_meta2, (0x8B, 0x93, 0xA5), 2)

# ── 右侧头像
avatar = Image.open(ROOT / "assets" / "img" / "avatar.png").convert("RGBA")
avatar = avatar.resize((320, 320), Image.LANCZOS)
base.alpha_composite(glow((W, H), (900, 300), 300, (108, 122, 255), 0.95))

ring = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rd = ImageDraw.Draw(ring)
rd.ellipse([900 - 186, 300 - 186, 900 + 186, 300 + 186], outline=(160, 180, 255, 70), width=2)
base.alpha_composite(ring)
base.alpha_composite(avatar, (740, 140))

# ── 四角轻微压暗
vig = Image.new("RGBA", (W, H), (0, 0, 0, 0))
vd = ImageDraw.Draw(vig)
for i in range(0, 40):
    a = int(6 * (1 - i / 40))
    vd.rectangle([i, i, W - i, H - i], outline=(0, 0, 0, a), width=1)
base.alpha_composite(vig)

OUT.parent.mkdir(parents=True, exist_ok=True)
base.convert("RGB").save(OUT, "PNG", optimize=True)
print("written:", OUT, base.size)
