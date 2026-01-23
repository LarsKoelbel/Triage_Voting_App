import qrcode
from PIL import Image
import os

urls = [
    "https://theater.lk-vt.de/triage"
]

qr_size = 300
output_folder = "qr_codes/"
os.makedirs(output_folder, exist_ok=True)

for i, url in enumerate(urls, start=1):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    # Fix for Pillow v10+
    img = img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)

    filename = f"{output_folder}qr_{i}.png"
    img.save(filename)
    print(f"Saved QR code for {url} as {filename}")
