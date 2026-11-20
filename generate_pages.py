import json
import os
import re
import shutil

def slugify(s):
    if not s:
        return ""
    s = s.strip().lower()
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'\.', '-', s)
    s = re.sub(r'[^a-z0-9\-]', '', s)
    return s

def parse_indicator(ind):
    text = ind if isinstance(ind, str) else ind.get("text", "")
    m = re.match(r'^((?:\d+(?:\.[a-zA-Z0-9]+)+(?:\s+to\s+\d+(?:\.[a-zA-Z0-9]+)+)?)|[A-Z]\.)\s*(.*)$', text)
    if m:
        return {
            "number": m.group(1),
            "title": m.group(2) or m.group(1),
            "raw": text,
            "subItems": ind.get("subItems", []) if isinstance(ind, dict) else []
        }
    return {
        "number": "",
        "title": text,
        "raw": text,
        "subItems": ind.get("subItems", []) if isinstance(ind, dict) else []
    }

def main():
    dist_dir = "dist"
    index_path = os.path.join(dist_dir, "index.html")
    if not os.path.exists(index_path):
        print("dist/index.html not found, run vite build first.")
        return

    with open(index_path, "r", encoding="utf-8") as f:
        template = f.read()

    with open("sdg_data.json", "r", encoding="utf-8") as f:
        raw_json = f.read()
        sdgs = json.loads(raw_json)

    # Embed data script tag
    embedded_tag = f'<script id="sdg-embedded-data" type="application/json">{raw_json}</script>\n'
    if '<script type="module"' in template:
        template = template.replace('<script type="module"', embedded_tag + '  <script type="module"')
    else:
        template = template.replace('</body>', embedded_tag + '</body>')

    # Update base index.html with embedded data
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(template)

    # Ensure images directory is synced to dist/images
    if os.path.exists("images"):
        dist_images = os.path.join(dist_dir, "images")
        shutil.copytree("images", dist_images, dirs_exist_ok=True)

    # For every SDG, create directory in dist/sdg/{sdg_id}/
    for sdg_id, sdg in sdgs.items():
        sdg_dir = os.path.join(dist_dir, "sdg", str(sdg_id))
        os.makedirs(sdg_dir, exist_ok=True)

        sdg_html = template.replace(
            f'data-sdg="{sdg_id}" class="sdg-nav-card"',
            f'data-sdg="{sdg_id}" class="sdg-nav-card active"'
        )

        with open(os.path.join(sdg_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(sdg_html)

        for target in sdg.get("targets", []):
            target_id = str(target.get("id"))
            target_slug = slugify(target_id)
            target_dir = os.path.join(sdg_dir, target_slug)
            os.makedirs(target_dir, exist_ok=True)

            with open(os.path.join(target_dir, "index.html"), "w", encoding="utf-8") as f:
                f.write(sdg_html)

            for ind in target.get("indicators", []):
                parsed = parse_indicator(ind)
                ind_id = parsed["number"] or parsed["title"]
                ind_slug = slugify(ind_id)
                if not ind_slug:
                    continue

                ind_dir = os.path.join(target_dir, ind_slug)
                os.makedirs(ind_dir, exist_ok=True)

                with open(os.path.join(ind_dir, "index.html"), "w", encoding="utf-8") as f:
                    f.write(sdg_html)

    print("Static HTML pages generated and data embedded successfully!")

if __name__ == "__main__":
    main()
