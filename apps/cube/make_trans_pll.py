import glob
from PIL import Image

def process_dir(directory):
    files = glob.glob(directory + '/*.png')
    if not files: return
    for f in files:
        try:
            img = Image.open(f).convert("RGBA")
            width, height = img.size
            pixels = img.load()
            corners = [(0,0), (width-1,0), (0,height-1), (width-1,height-1)]
            bg_colors = []
            for cx, cy in corners:
                c = pixels[cx, cy]
                if c[0] > 230 and c[1] > 230 and c[2] > 230:
                    bg_colors.append(c)
            if not bg_colors: continue
            bg_col = bg_colors[0]
            visited = set()
            queue = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
            translucent = (255, 255, 255, 0)
            while queue:
                x, y = queue.pop(0)
                if (x, y) in visited: continue
                visited.add((x, y))
                p = pixels[x, y]
                diff = abs(p[0] - bg_col[0]) + abs(p[1] - bg_col[1]) + abs(p[2] - bg_col[2])
                if diff < 30: 
                    pixels[x, y] = translucent
                    for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
                        if 0 <= nx < width and 0 <= ny < height:
                            if (nx, ny) not in visited: queue.append((nx, ny))
            img.save(f, "PNG")
        except Exception as e: pass

process_dir('/Users/loki/workspace/maotuwo/apps/cube/public/images/pll')
