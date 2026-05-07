from PIL import Image
import os

input_path = r"d:\Work\pashuvaani26\pvadmin\public\pvhalflogo.png"
output_path = r"d:\Work\pashuvaani26\pvadmin\public\pvicon.png"

try:
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    print(f"Original size: {width}x{height}")
    
    # Get bounding box to remove extra whitespace/transparency
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        width, height = img.size
        print(f"Bbox size: {width}x{height}")
    
    # The icon is on the left. The text is on the right.
    # A standard horizontal logo has the icon fitting within a square on the left.
    # We'll crop a square of size `height x height` from the left edge.
    # We'll add a little margin to the right just in case.
    icon_width = int(height * 1.1)
    crop_box = (0, 0, min(width, icon_width), height)
    
    icon = img.crop(crop_box)
    icon.save(output_path)
    print("Successfully cropped and saved as pvicon.png")
except Exception as e:
    print("Error:", e)
