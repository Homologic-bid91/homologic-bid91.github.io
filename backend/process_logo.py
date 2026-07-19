import os
from PIL import Image

INPUT_PATH = "/Users/macbook/.gemini/antigravity-ide/brain/a04bb785-3ef9-4477-b0dd-de533dde0649/media__1784443853868.jpg"
OUTPUT_DIR_FRONTEND = "/Users/macbook/Documents/June/VGyans/frontend/src/assets"
OUTPUT_DIR_PUBLIC = "/Users/macbook/Documents/June/VGyans/frontend/public"

def flood_fill_transparency(img_path, tolerance=35):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    data = img.load()
    
    # Target color to replace (white background: 255, 255, 255)
    target_color = (255, 255, 255)
    
    # Queue for BFS flood fill
    queue = []
    visited = set()
    
    # Start BFS from the 4 corners and the outer border
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
        visited.add((x, 0))
        visited.add((x, height - 1))
        
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
        visited.add((0, y))
        visited.add((width - 1, y))
        
    # BFS traversal
    while queue:
        cx, cy = queue.pop(0)
        
        # Get current pixel color
        r, g, b, a = data[cx, cy]
        
        # Calculate Euclidean distance from target color (white)
        color_dist = (r - target_color[0])**2 + (g - target_color[1])**2 + (b - target_color[2])**2
        
        # If the pixel is close enough to white, make it transparent
        if color_dist <= 3 * (tolerance ** 2):
            data[cx, cy] = (0, 0, 0, 0)  # Fully transparent
            
            # Check 4-way neighbors
            for nx, ny in [(cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)]:
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    return img

def main():
    if not os.path.exists(INPUT_PATH):
        print(f"Error: Input logo not found at {INPUT_PATH}")
        return
        
    print("Processing logo to remove outer white background...")
    processed_img = flood_fill_transparency(INPUT_PATH, tolerance=40)
    
    # Save to frontend/src/assets/logo.png
    os.makedirs(OUTPUT_DIR_FRONTEND, exist_ok=True)
    out_path_src = os.path.join(OUTPUT_DIR_FRONTEND, "logo.png")
    processed_img.save(out_path_src, "PNG")
    print(f"Saved logo to: {out_path_src}")
    
    # Save to frontend/public/logo.png
    os.makedirs(OUTPUT_DIR_PUBLIC, exist_ok=True)
    out_path_pub = os.path.join(OUTPUT_DIR_PUBLIC, "logo.png")
    processed_img.save(out_path_pub, "PNG")
    print(f"Saved logo to: {out_path_pub}")

if __name__ == "__main__":
    main()
