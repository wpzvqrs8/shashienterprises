import os
import sys
import json
import base64
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

API_KEY = "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"
INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

img_path = os.path.abspath("scratch/collages/collage_batch_01.jpg")
print("Testing NVIDIA Vision API on image:", img_path)

if not os.path.exists(img_path):
    print("Image file does not exist!")
    sys.exit(1)

with open(img_path, "rb") as f:
    base64_img = base64.b64encode(f.read()).decode("utf-8")

prompt_text = """
You are an expert e-commerce catalog manager for an anime action figure & collectible store.
Analyze the 10 product items in this grid image.

CRITICAL INSTRUCTIONS:
1. IGNORE any text written under/inside each card. Identify each figure purely from visual image recognition.
2. For each numbered item (#1 to #10), provide:
   - "correct_catalog_name": "[Anime/Franchise] [Character Name] [Pose/Variant] [Figure/Statue]"
   - "keywords": list of high-converting search tags

Output ONLY a JSON array like:
[
  {
    "item_number": 1,
    "correct_catalog_name": "...",
    "keywords": ["..."]
  }
]
"""

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json",
}

payload = {
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt_text},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_img}"
                    }
                }
            ]
        }
    ],
    "model": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
    "max_tokens": 4096,
    "temperature": 0.2
}

print("[*] Sending request to NVIDIA API...")
response = requests.post(INVOKE_URL, headers=headers, json=payload)
print("Status Code:", response.status_code)

try:
    data = response.json()
    print("API Response Output:")
    print(json.dumps(data, indent=2))
except Exception as e:
    print("Raw Response Text:", response.text)
