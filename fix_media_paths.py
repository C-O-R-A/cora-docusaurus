import re
from pathlib import Path

BASE_URL = "/cora-docusaurus"

ATTR_PATTERN = re.compile(r'''(src|href)=(["'])(/(?!cora-docusaurus|http))''')
MD_IMG_PATTERN = re.compile(r'''(!\[[^\]]*\]\()(/(?!cora-docusaurus|http))''')

def fix_file(path: Path):
    text = path.read_text(encoding="utf-8")
    original = text
    text = ATTR_PATTERN.sub(lambda m: f'{m.group(1)}={m.group(2)}{BASE_URL}/', text)
    text = MD_IMG_PATTERN.sub(lambda m: f'{m.group(1)}{BASE_URL}/', text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"fixed: {path}")

for root in ("docs", "blog"):
    root_path = Path(root)
    if not root_path.exists():
        continue
    for pattern in ("*.md", "*.mdx"):
        for path in root_path.rglob(pattern):
            fix_file(path)
