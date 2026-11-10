import json
import sys
from hashlib import sha256
from io import BytesIO
from os.path import basename
from zipfile import ZipFile
import urllib.request

if len(sys.argv) < 3:
    print("Usage: python update_version.py <repo_name> <version>")
    sys.exit(1)

repo_name = sys.argv[1]
version = sys.argv[2]

repo = f"https://github.com/lnbits/{repo_name}"
archive = f"{repo}/archive/refs/tags/{version}.zip"
with urllib.request.urlopen(archive) as f:
    data = f.read()

archive_zip = ZipFile(BytesIO(data))
archive_hash = sha256(data).hexdigest()

prefix = f"{basename(repo_name)}-{version.replace('v', '')}"
config = json.load(archive_zip.open(f"{prefix}/config.json"))

ext_name = config.get("id") or basename(repo_name)

with open("extensions.json", "r+") as ext_json:
    extensions = json.load(ext_json)

# Preserve release-specific metadata, such as paid-extension links.
previous = [e for e in extensions["extensions"] if e["id"] == ext_name]
if previous:
    new_ext = previous[-1].copy()
else:
    raw_url = f"https://raw.githubusercontent.com/lnbits/{repo_name}/main"
    icon = config.get("tile")
    if icon:
        icon = raw_url + icon.replace(f"/{repo_name}", "", 1)
    else:
        icon = raw_url + "/static/image/icon.png"
    new_ext = {
        "id": ext_name,
        "repo": repo,
        "icon": icon,
        "details_link": f"{raw_url}/config.json",
    }

new_ext.update(
    {
        "version": version.removeprefix("v"),
        "archive": archive,
        "hash": archive_hash,
        "min_lnbits_version": config.get("min_lnbits_version"),
        "name": config.get("name"),
        "short_description": config.get("short_description"),
    }
)
# Use the submitted release's bounds, never an older entry's compatibility cap.
if config.get("max_lnbits_version"):
    new_ext["max_lnbits_version"] = config["max_lnbits_version"]
else:
    new_ext.pop("max_lnbits_version", None)

# Replace all older entries for this extension at its original position.
# Other extensions and manifest sections remain unchanged.
entries = []
inserted = False
for extension in extensions["extensions"]:
    if extension["id"] == ext_name:
        if not inserted:
            entries.append(new_ext)
            inserted = True
    else:
        entries.append(extension)
if not inserted:
    entries.append(new_ext)
extensions["extensions"] = entries

# update the extension.json file
with open("extensions.json", "w") as ext_json:
    ext_json.write(json.dumps(extensions, indent=4))
    ext_json.close()
