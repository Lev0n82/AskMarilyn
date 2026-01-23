from PIL import Image, ImageDraw, ImageFont
import os

guests = [
    ("elon", (59, 130, 246)), # Blue
    ("bill", (34, 197, 94)),  # Green
    ("roger", (107, 114, 128)), # Gray
    ("stan", (239, 68, 68)),    # Red
    ("laura", (245, 158, 11)),  # Amber
    ("george", (120, 113, 108)), # Stone
    ("ryerson", (99, 102, 241))  # Indigo
]

base_path = "/home/ubuntu/AskMarilyn/client/public/images/guests"
os.makedirs(base_path, exist_ok=True)

for name, color in guests:
    img = Image.new('RGB', (200, 200), color=color)
    d = ImageDraw.Draw(img)
    
    # Draw a simple face
    d.ellipse((50, 30, 150, 130), fill=(255, 255, 255)) # Head
    d.ellipse((70, 60, 80, 70), fill=(0, 0, 0)) # Left Eye
    d.ellipse((120, 60, 130, 70), fill=(0, 0, 0)) # Right Eye
    d.arc((70, 80, 130, 110), start=0, end=180, fill=(0, 0, 0), width=3) # Smile
    
    # Save
    img.save(f"{base_path}/{name}.png")
    print(f"Generated {name}.png")

# Also generate the cracked glass effect for feedback
glass_img = Image.new('RGBA', (400, 400), (0, 0, 0, 0))
d_glass = ImageDraw.Draw(glass_img)
d_glass.line((0, 0, 400, 400), fill=(255, 255, 255, 128), width=2)
d_glass.line((400, 0, 0, 400), fill=(255, 255, 255, 128), width=2)
glass_img.save("/home/ubuntu/AskMarilyn/client/public/images/cracked-glass.png")
print("Generated cracked-glass.png")
