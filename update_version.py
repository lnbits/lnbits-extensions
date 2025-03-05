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

# find lastest version of extension
latest_extension = None
latest_index = None
for i, extension in enumerate(extensions["extensions"]):
    if extension["id"] == ext_name:
        latest_extension = extension
        latest_index = i

# if not found create a new extension
if not latest_extension or not latest_index:
    raw_url = f"https://raw.githubusercontent.com/lnbits/{repo_name}/main"
    icon = config.get("tile")
    if icon:
        icon = raw_url + icon.replace(f"/{repo_name}", "")
    else:
        icon = raw_url + "/static/image/icon.png"
    new_ext = {
        "id": ext_name,
        "repo": repo,
        "version": version.replace("v", ""),
        "archive": archive,
        "hash": archive_hash,
        "min_lnbits_version": config.get("min_lnbits_version"),
        "name": config.get("name"),
        "short_description": config.get("short_description"),
        "icon": icon,
        "details_link": f"{raw_url}/config.json",
    }
    extensions["extensions"].append(new_ext)
# check if min_lnbits_version is different
elif latest_extension["min_lnbits_version"] != config.get("min_lnbits_version"):
    new_ext = latest_extension.copy()
    new_ext["version"] = version.replace("v", "")
    new_ext["archive"] = archive
    new_ext["hash"] = archive_hash
    new_ext["min_lnbits_version"] = config.get("min_lnbits_version")
    new_ext["name"] = config.get("name")
    new_ext["short_description"] = config.get("short_description")
    # remove max version from latest release
    new_ext.pop("max_lnbits_version", None)
    # include the new extension in the list at the proper index
    _extensions = extensions["extensions"][:]
    _extensions.insert(latest_index+1, new_ext)
    extensions["extensions"] = _extensions
    # update the max version of the previous release
    extensions["extensions"][latest_index]["max_lnbits_version"] = version.replace("v", "")
else:
    # else its not a breaking change, just update the version and archive
    extensions["extensions"][latest_index]["version"] = version.replace("v", "")
    extensions["extensions"][latest_index]["archive"] = archive
    extensions["extensions"][latest_index]["hash"] = archive_hash
    # update the config.json into the next release
    extensions["extensions"][latest_index]["name"] = config.get("name")
    extensions["extensions"][latest_index]["short_description"] = config.get("short_description")

# update the extension.json file
with open("extensions.json", "w") as ext_json:
    ext_json.write(json.dumps(extensions, indent=4))
    ext_json.close()
