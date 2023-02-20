import io
import json
from hashlib import sha256
from os.path import basename
import sys

from PIL import Image
import requests

EXTENSIONS_FILE = "extensions.json"


def get_remote_file(url):
    r = requests.get(url)
    return r.content


def get_remote_hash(url):
    d = get_remote_file(url)
    return sha256(d).hexdigest()


class Extension:
    def __init__(self, ext):
        self.id = ext["id"]
        self.repo = ext["repo"]
        self.name = ext["name"]
        self.version = ext["version"]
        self.short_description = ext["short_description"]
        self.icon = ext["icon"]
        self.archive = ext["archive"]
        self.hash = ext["hash"]

    def validate(self):
        print(f"Checking '{self.name}' extension ({self.id} {self.version})")

        # check for typos
        if not self.name[0].isupper():
            print(f"{self.name}: name does not start with uppercase letter")
            assert False

        if not self.short_description[0].isupper():
            print(f"{self.name}: short_description does not start with uppercase letter")
            assert False
        if self.short_description.endswith("."):
            print(f"{self.name}: short_description does end with .")
            assert False
        if not self.id == self.id.lower():
            print(f"{self.name}: id has mixed casing")
            assert False

        # print archive info from json
        hash_archive = get_remote_hash(self.archive)
        print(f"- url  : {self.archive}")
        print(f"- hash : {self.hash} (expected)")
        print(f"- hash : {hash_archive} (real)")

        # check icon
        try:
            icon = get_remote_file(self.icon)
            img = Image.open(io.BytesIO(icon))
            status = f"OK {img.size[0]}x{img.size[1]} @ {img.mode}"
            icon_ok = True
        except:
            status = "BROKEN"
            icon_ok = False
        print(f"- icon : {status} ({self.icon})")

        return self.hash == hash_archive and icon_ok


def main():
    # load stuff from json
    try:
        print(f"Loading {EXTENSIONS_FILE}")
        j = json.load(open(EXTENSIONS_FILE, "rt"))
        extensions = j["extensions"]
        featured = j["featured"]
        print("OK")
    except:
        print("FAILED")
        return False
    print()

    # check whether extensions listed in featured exist
    try:
        print("Checking whether featured extensions exist")
        extensions_ids = [e["id"] for e in extensions]
        for f in featured:
            assert f in extensions_ids
        print("OK")
    except:
        print("FAILED")
        return False
    print()

    # check all extensions
    failed = []
    for ext in extensions:
        e = Extension(ext)
        try:
            assert e.validate()
            print("OK")
        except:
            print("FAILED")
            failed.append(ext["id"])
        print()

    print("Failed extensions: ", end="")
    if not failed:
        print("NONE, ALL GOOD!")
    else:
        print(" ".join(failed))

    return not failed


if __name__ == "__main__":
    if not main():
        sys.exit(1)
