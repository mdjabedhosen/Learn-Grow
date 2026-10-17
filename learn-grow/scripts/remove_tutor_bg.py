import sys
import os
import numpy as np
from PIL import Image, ImageFilter

def remove_white_background(input_path, output_path, threshold=242, feather_radius=1.5):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # Calculate distance to pure white (255, 255, 255)
    # Background is clean white
    min_val = np.minimum(np.minimum(r, g), b)
    color_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(g - b)), np.abs(r - b))
    
    # White background detection: high brightness and very low saturation/color difference
    is_white = (min_val >= threshold) & (color_diff <= 15)
    
    # Convert to binary mask: 255 = foreground, 0 = background
    mask = np.where(is_white, 0, 255).astype(np.uint8)
    mask_img = Image.fromarray(mask, mode="L")
    
    # Clean up any isolated pinhole noise inside character
    mask_img = mask_img.filter(ImageFilter.MedianFilter(size=3))
    
    # Smooth edges with slight Gaussian blur for antialiasing
    mask_blur = mask_img.filter(ImageFilter.GaussianBlur(radius=feather_radius))
    
    # Apply mask as alpha channel
    img.putalpha(mask_blur)
    
    # Save optimized transparent PNG
    img.save(output_path, "PNG", optimize=True)
    print(f"Processed: {input_path} -> {output_path} (Size: {img.size})")

if __name__ == "__main__":
    tutors = [
        "tutor-tanvir",
        "tutor-marko",
        "tutor-antonia",
        "tutor-nenad",
        "tutor-antonella"
    ]
    
    base_dir = "public/images/tutors"
    for name in tutors:
        in_file = os.path.join(base_dir, f"{name}.jpg")
        out_file = os.path.join(base_dir, f"{name}.png")
        if os.path.exists(in_file):
            remove_white_background(in_file, out_file)
        else:
            print(f"File not found: {in_file}")
