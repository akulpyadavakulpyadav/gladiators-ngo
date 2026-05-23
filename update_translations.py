import json
import re

with open('new_translations.json', 'r', encoding='utf-8') as f:
    new_translations = json.load(f)

with open(r'src\utils\translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

# For EN, HI, KN
for lang in ['EN', 'HI', 'KN']:
    match = re.search(f'{lang}:\\s*{{(.*?)\\n\\s*}},', content, re.DOTALL)
    if not match:
        # try without trailing comma
        match = re.search(f'{lang}:\\s*{{(.*?)\\n\\s*}}', content, re.DOTALL)
    
    if match:
        dict_str = match.group(1)
        insertion_str = ""
        for k, v in new_translations.items():
            # Escape single quotes
            val = v.replace("'", "\\'")
            insertion_str += f"\n    {k}: '{val}',"
        
        new_dict_str = dict_str + insertion_str
        content = content.replace(match.group(0), match.group(0).replace(dict_str, new_dict_str))

with open(r'src\utils\translations.js', 'w', encoding='utf-8') as f:
    f.write(content)
