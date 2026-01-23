import os

guests = [
    ("elon", "blue"),
    ("bill", "green"),
    ("roger", "gray"),
    ("stan", "red"),
    ("laura", "orange"),
    ("george", "brown"),
    ("ryerson", "indigo")
]

base_path = "/home/ubuntu/AskMarilyn/client/public/images/guests"

for name, color in guests:
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="{color}" opacity="0.2"/>
  <circle cx="100" cy="80" r="40" fill="{color}"/>
  <path d="M40,180 Q100,120 160,180" fill="{color}"/>
  <text x="100" y="190" font-family="Arial" font-size="20" text-anchor="middle" fill="white">{name.title()}</text>
</svg>'''
    
    with open(f"{base_path}/{name}.png", "w") as f:
        # Note: Saving as .png extension but content is SVG for browser compatibility in img tags 
        # (browsers often handle this, or we can rename to .svg)
        # For safety, let's actually save as .svg and I'll update the code references if needed, 
        # but the code references .png. 
        # To keep it simple for this mock, I'll save as .svg and update the code to use .svg or 
        # just rely on the fact that I can't easily generate real PNGs without PIL/libraries installed.
        # Wait, I have PIL installed in the sandbox. Let's use python to generate real PNGs.
        pass

# Re-writing script to use PIL for real PNGs
