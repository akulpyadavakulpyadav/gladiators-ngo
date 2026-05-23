import os
import re
import json

src_dir = r"d:\VIDYA VARDHAKA COLLEGE OF ENGINEERING\GITHUB REEPOS\gladiators-ngo\src"
translations_file = os.path.join(src_dir, 'utils', 'translations.js')

with open(translations_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract EN dictionary
en_dict_match = re.search(r'EN:\s*\{([^}]*)\}', content, re.DOTALL)
en_dict_str = en_dict_match.group(1)

en_dict = {}
for line in en_dict_str.split('\n'):
    match = re.match(r"\s*'?(.*?)'?\s*:\s*['\"](.*?)['\"],?", line)
    if match:
        key, val = match.groups()
        en_dict[val] = key

# We also need a way to add new translations
new_translations = {}

def get_or_create_key(text):
    text_clean = text.strip()
    if text_clean in en_dict:
        return en_dict[text_clean]
    # Create new key
    base_key = re.sub(r'[^a-zA-Z0-9]+', '_', text_clean).strip('_').lower()
    if len(base_key) > 20:
        base_key = base_key[:20]
    if not base_key:
        return None
    key = base_key
    counter = 1
    while key in en_dict.values() or key in new_translations:
        key = f"{base_key}_{counter}"
        counter += 1
    new_translations[key] = text_clean
    return key

# We'll use a naive regex approach to find text in JSX elements.
# JSX text: >Text<
jsx_text_pattern = re.compile(r'>([^<>{}\n]+)<')

# Also strings in placeholders and buttons
placeholder_pattern = re.compile(r'placeholder=["\']([^"\']+)["\']')

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        file_content = f.read()

    original_content = file_content
    
    # Check if `useLanguage` and `t` are imported, if not, add them.
    needs_imports = False
    
    def repl_jsx_text(m):
        text = m.group(1)
        if text.strip() and re.search(r'[a-zA-Z]', text):
            key = get_or_create_key(text)
            if key:
                nonlocal needs_imports
                needs_imports = True
                # Replace with {t('key', language)}
                # but keep the surrounding spaces
                leading_spaces = text[:len(text)-len(text.lstrip())]
                trailing_spaces = text[len(text.rstrip()):]
                return f">{leading_spaces}{{t('{key}', language)}}{trailing_spaces}<"
        return m.group(0)

    def repl_placeholder(m):
        text = m.group(1)
        if text.strip() and re.search(r'[a-zA-Z]', text):
            key = get_or_create_key(text)
            if key:
                nonlocal needs_imports
                needs_imports = True
                return f"placeholder={{t('{key}', language)}}"
        return m.group(0)

    file_content = jsx_text_pattern.sub(repl_jsx_text, file_content)
    file_content = placeholder_pattern.sub(repl_placeholder, file_content)
    
    if needs_imports and "useLanguage" not in file_content:
        # Determine relative path to context
        depth = filepath.count(os.sep) - src_dir.count(os.sep)
        prefix = "../" * (depth - 1) if depth > 1 else "./"
        if filepath.endswith('App.jsx'):
            pass # App.jsx shouldn't use useLanguage inside components like that unless it's a provider
        else:
            imports = f"import {{ useLanguage }} from '{prefix}context/LanguageContext';\nimport {{ t }} from '{prefix}utils/translations';\n"
            # insert after React import
            file_content = re.sub(r'(import React.*?;\n)', r'\1' + imports, file_content, count=1)
            # also insert `const { language } = useLanguage();` inside the component
            # This is hard to automate perfectly, so we might skip automatic import for some files or print a warning.
            
    if file_content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(file_content)
        return True
    return False

modified_files = []
for root, _, files in os.walk(os.path.join(src_dir, 'components')):
    for file in files:
        if file.endswith('.jsx'):
            if process_file(os.path.join(root, file)):
                modified_files.append(file)

print(f"Modified files: {modified_files}")
print(f"New translations to add: {len(new_translations)}")

if new_translations:
    with open('new_translations.json', 'w') as f:
        json.dump(new_translations, f, indent=2)
