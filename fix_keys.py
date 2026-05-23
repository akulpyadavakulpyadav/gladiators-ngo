import re

with open(r'src\utils\translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace lines like:
#     12_digit_aadhaar_num: '12-digit Aadhaar number',
# with:
#     "12_digit_aadhaar_num": '12-digit Aadhaar number',
# For any key that starts with a number.
# Or just quote all keys that were just added without quotes.
def quote_keys(match):
    key = match.group(1)
    val = match.group(2)
    return f'    "{key}": {val}'

content = re.sub(r'^\s*([a-zA-Z0-9_]+)\s*:\s*([\'"].*?[\'"]\s*,?)\s*$', quote_keys, content, flags=re.MULTILINE)

with open(r'src\utils\translations.js', 'w', encoding='utf-8') as f:
    f.write(content)
