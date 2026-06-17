"""Generate tabBar icons + route theme fallback images. All abstract, no photos."""
from PIL import Image, ImageDraw
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TABBAR = os.path.join(ROOT, 'miniprogram', 'assets', 'icons', 'tabbar')
ROUTES = os.path.join(ROOT, 'miniprogram', 'assets', 'images', 'routes')

os.makedirs(TABBAR, exist_ok=True)
os.makedirs(ROUTES, exist_ok=True)

NORMAL = (138, 154, 145)    # #8a9a91
ACTIVE = (31, 143, 95)      # #1f8f5f

def save_png(path, img):
    img.save(path, 'PNG', optimize=True)
    print(f'  {os.path.basename(path)} ({os.path.getsize(path)} bytes)')

def icon_home(d, c):
    d.polygon([(40, 8), (8, 36), (72, 36)], fill=c)
    d.rectangle([(18, 34), (62, 68)], fill=c)
    d.rectangle([(32, 48), (48, 68)], fill=(0, 0, 0, 0))

def icon_ai(d, c):
    d.rectangle([(8, 12), (66, 56)], fill=c)
    # rounded corners via pieslice
    r = 10
    for cx, cy in [(18, 22), (56, 22), (18, 46), (56, 46)]:
        d.pieslice([cx - r, cy - r, cx + r, cy + r], 0, 360, fill=c)
    d.rectangle([(8, 12 + r), (66, 56 - r)], fill=c)
    d.rectangle([(8 + r, 12), (66 - r, 56)], fill=c)
    d.polygon([(14, 56), (4, 70), (26, 54)], fill=c)
    ex, ey = 55, 42
    d.ellipse([ex - 2, ey - 2, ex + 2, ey + 2], fill=(0, 0, 0, 0), outline=c, width=2)

def icon_trips(d, c):
    for i in range(3):
        y = 18 + i * 16
        d.rectangle([(10, y), (58, y + 6)], fill=c)
    d.line([(60, 58), (60, 12)], fill=c, width=3)
    d.polygon([(60, 10), (76, 10), (60, 24)], fill=c)

print('=== TabBar icons (81x81) ===')
for name, fn, color in [
    ('home.png', icon_home, NORMAL), ('home-active.png', icon_home, ACTIVE),
    ('ai.png', icon_ai, NORMAL), ('ai-active.png', icon_ai, ACTIVE),
    ('trips.png', icon_trips, NORMAL), ('trips-active.png', icon_trips, ACTIVE),
]:
    img = Image.new('RGBA', (81, 81), (0, 0, 0, 0))
    fn(ImageDraw.Draw(img), color)
    save_png(os.path.join(TABBAR, name), img)

# --- Route theme images (400x240) ---

THEME_COLORS = {
    'default': [(228, 240, 232), (200, 224, 210), (175, 210, 190)],
    'waterfall': [(200, 230, 240), (175, 215, 235), (150, 200, 225)],
    'mountain': [(220, 235, 225), (195, 218, 205), (170, 200, 185)],
    'village': [(235, 220, 210), (220, 200, 185), (210, 185, 170)],
    'cave': [(210, 215, 225), (185, 190, 205), (160, 170, 190)],
    'ancient-town': [(232, 225, 215), (215, 205, 190), (200, 190, 172)],
    'forest': [(210, 235, 215), (180, 215, 190), (155, 195, 168)],
    'culture': [(225, 215, 235), (205, 190, 220), (190, 170, 210)],
}

def draw_route(name, colors, fn):
    img = Image.new('RGBA', (400, 240), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle([(0, 0), (400, 240)], fill=colors[0])
    fn(d, colors)
    save_png(os.path.join(ROUTES, 'route-' + name + '.png'), img)

print('\n=== Route fallback images (400x240) ===')

def r_default(d, cs):
    d.polygon([(0, 160), (100, 50), (200, 160)], fill=cs[1])
    d.polygon([(130, 160), (280, 30), (400, 160)], fill=cs[2])
    d.line([(20, 220), (160, 190), (310, 200), (400, 170)], fill=cs[2], width=5)

def r_waterfall(d, cs):
    d.rectangle([(70, 20), (130, 170)], fill=cs[1])
    d.rectangle([(210, 30), (270, 170)], fill=cs[2])
    for x in [95, 110]: d.line([(x, 50), (x, 210)], fill=(47, 107, 255, 110), width=5)
    d.ellipse([(60, 180), (310, 240)], fill=cs[2])

def r_mountain(d, cs):
    d.polygon([(0, 170), (70, 70), (160, 170)], fill=cs[1])
    d.polygon([(90, 170), (220, 25), (340, 170)], fill=cs[2])
    d.polygon([(260, 170), (360, 55), (400, 170)], fill=cs[1])
    for y in [125, 145]: d.ellipse([(120, y), (280, y + 20)], fill=cs[2])

def r_village(d, cs):
    d.polygon([(0, 200), (200, 100), (400, 200)], fill=cs[1])
    for bx, bw in [(50, 70), (170, 80), (290, 70)]:
        d.polygon([(bx, 165), (bx + bw // 2, 125), (bx + bw, 165)], fill=cs[2])
        d.rectangle([(bx + 8, 145), (bx + bw - 8, 165)], fill=cs[2])

def r_cave(d, cs):
    d.rectangle([(0, 20), (400, 240)], fill=cs[1])
    d.pieslice([(100, -40), (300, 190)], 180, 360, fill=cs[2])
    d.ellipse([(160, 80), (240, 145)], fill=(255, 220, 150, 70))
    for x in [130, 180, 230]: d.polygon([(x, 110), (x - 5, 75), (x + 5, 75)], fill=cs[1])

def r_ancient_town(d, cs):
    for i, y in enumerate([45, 95]):
        c2 = cs[1 + i % 2]
        for x in range(20, 400, 60):
            d.polygon([(x, y + 40), (x + 30, y), (x + 55, y + 40)], fill=c2)
            d.rectangle([(x + 5, y + 30), (x + 50, y + 40)], fill=c2)
    for i in range(5): d.rectangle([(50 + i * 70, 205), (80 + i * 70, 235)], fill=cs[2])

def r_forest(d, cs):
    for x in [30, 110, 190, 270, 350]:
        d.rectangle([(x - 5, 60), (x + 5, 210)], fill=cs[2])
    for cx, r in [(30, 45), (110, 55), (190, 50), (270, 58), (350, 45)]:
        d.ellipse([(cx - r, 20), (cx + r, 90)], fill=cs[1])

def r_culture(d, cs):
    d.rectangle([(165, 45), (235, 200)], fill=cs[1])
    d.polygon([(145, 45), (200, 5), (255, 45)], fill=cs[2])
    for y in [45, 85, 125]: d.rectangle([(155, y), (245, y + 6)], fill=cs[2])
    for x in range(35, 370, 30): d.ellipse([(x, 205), (x + 14, 219)], fill=cs[1])

for name, fn in [
    ('default', r_default), ('waterfall', r_waterfall), ('mountain', r_mountain),
    ('village', r_village), ('cave', r_cave), ('ancient-town', r_ancient_town),
    ('forest', r_forest), ('culture', r_culture),
]:
    draw_route(name, THEME_COLORS[name], fn)

print('\nAll images generated.')
