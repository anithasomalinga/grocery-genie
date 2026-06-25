import pytesseract
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()


def extract_text(image_path: str) -> str:
    image = Image.open(image_path)
    # Apply EXIF rotation so portrait iPhone photos are upright
    image = ImageOps.exif_transpose(image)
    # Convert to RGB/L for Tesseract
    if image.mode not in ("RGB", "L"):
        image = image.convert("RGB")
    text = pytesseract.image_to_string(image, config="--psm 6")
    return text.strip()
