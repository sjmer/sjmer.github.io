#!/usr/bin/env python3
"""把一张人像照裁成圆形头像用的方块 PNG（去白底 + 底部渐隐）。

用法：
    python tools/gen_avatar.py 原图.png [输出路径]

默认输出 assets/img/avatar.png，尺寸 320x320。
只依赖 Pillow / numpy / scipy：
    pip install pillow numpy scipy
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / "assets" / "img" / "avatar.png"

# ── 裁剪参数（原图坐标，按实际照片调整） ──────────────────────────────
CROP_X = 194        # 方块左边界
CROP_Y = -30        # 方块上边界（负数＝在上方补透明留白）
CROP_SIZE = 720     # 方块边长
FADE_FROM = 0.84    # 从这个高度开始往透明过渡
OUT_SIZE = 320      # 输出边长

WHITE_TOL = 12.0    # 与白底差异小于它 → 视为背景候选（沿边缘向内漫水）
FEATHER = 1.1       # 边缘羽化半径（像素）
BG = np.array([252.0, 252.0, 252.0])


def background_mask(rgb: np.ndarray) -> np.ndarray:
    """只把「与图片边缘连通的白」当作背景，人物内部的高光不会被挖掉。"""
    diff = np.abs(rgb.astype(np.float32) - BG).mean(axis=2)
    free = diff < WHITE_TOL
    lab, n = ndi.label(free)
    edge_labels = np.unique(np.concatenate([
        lab[0, :], lab[-1, :], lab[:, 0], lab[:, -1],
    ]))
    edge_labels = edge_labels[edge_labels > 0]
    return np.isin(lab, edge_labels)


def unpremultiply(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """边缘像素 = 前景色与白色的混合，反解出前景色，避免深色背景上的白色描边。"""
    a = np.clip(alpha, 1e-3, 1.0)[..., None]
    fg = (rgb.astype(np.float32) - (1.0 - a) * BG) / a
    return np.clip(fg, 0.0, 255.0)


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if src is None:
        print(__doc__)
        return 2
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_OUT

    rgb = np.asarray(Image.open(src).convert("RGB"))
    outside = background_mask(rgb)
    alpha = np.clip(1.0 - ndi.gaussian_filter(outside.astype(np.float32), FEATHER), 0.0, 1.0)
    fg = unpremultiply(rgb, alpha)
    print(f"subject coverage {1.0 - outside.mean():.3f}")

    # 在源图上裁方块（负数边界先裁到图像内，剩下的用透明补齐）
    h, w = alpha.shape
    x0, y0 = CROP_X, CROP_Y
    x1, y1 = x0 + CROP_SIZE, y0 + CROP_SIZE
    cx0, cy0, cx1, cy1 = max(x0, 0), max(y0, 0), min(x1, w), min(y1, h)

    canvas_rgb = np.zeros((CROP_SIZE, CROP_SIZE, 3), dtype=np.float32)
    canvas_a = np.zeros((CROP_SIZE, CROP_SIZE), dtype=np.float32)
    dx, dy = cx0 - x0, cy0 - y0
    canvas_rgb[dy:dy + (cy1 - cy0), dx:dx + (cx1 - cx0)] = fg[cy0:cy1, cx0:cx1]
    canvas_a[dy:dy + (cy1 - cy0), dx:dx + (cx1 - cx0)] = alpha[cy0:cy1, cx0:cx1]

    # 底部渐隐，让半身在深色背景里自然淡出
    ys = np.linspace(0.0, 1.0, CROP_SIZE, dtype=np.float32)
    fade = np.clip((1.0 - ys) / (1.0 - FADE_FROM), 0.0, 1.0)
    fade = fade * fade * (3.0 - 2.0 * fade)          # smoothstep
    canvas_a *= fade[:, None]

    img = Image.fromarray(np.dstack([canvas_rgb, canvas_a * 255.0]).astype(np.uint8), "RGBA")
    img = img.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    print(f"saved {out} ({out.stat().st_size} bytes, {OUT_SIZE}x{OUT_SIZE})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
