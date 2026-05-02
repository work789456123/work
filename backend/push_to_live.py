import requests

# Local product data (Masti-Care)
data = {
    'category': 'Health & Supplements',
    'name': 'Masti-Care 60gms, 1 kg',
    'description': '''Vitamin A                 50000 IU
Lactobacillus           1000 million spores
Amino Nitrogen      1667 mg
with Chelated Copper, Cobalt, lodine,
Manganese, Zinc and conjugated protein
in a fortified base.

INDICATIONS:
To over come subclinical mastitis and its ill
effects in livestock and to restore the
normal milk production.

USAGE INSTRUCTIONS:
Cattle & Buffalos:
20 gms thrice daily for 3-5 days or 1 kg per
ton of feed regularly. Or as recommended
by Veterinarian.''',
    'contact': '7878787878'
}

# The image path inside the docker container
image_path = "/app/uploads/products/38cf26aea0d24d3da22af7366df99692.webp"

print("Uploading to main website...")
try:
    with open(image_path, 'rb') as f:
        files = {'image1': ('masti-care.webp', f, 'image/webp')}
        response = requests.post('https://pashuvaani.com/api/products', data=data, files=files)
except FileNotFoundError:
    print("Could not find the image inside docker. Trying without image.")
    response = requests.post('https://pashuvaani.com/api/products', data=data)

if response.status_code == 200:
    print("Success! Product is now on pashuvaani.com")
else:
    print("Failed to upload:", response.status_code, response.text)
