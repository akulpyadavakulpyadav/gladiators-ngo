import re

with open(r'src\utils\translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find any line that ends with a quote (single or double) and is followed by a line starting with a quoted key, and insert a comma.
content = re.sub(r"(['\"])\s*\n\s*(\"[a-zA-Z0-9_]+\"\s*:)", r"\1,\n    \2", content)

with open(r'src\utils\translations.js', 'w', encoding='utf-8') as f:
    f.write(content)
