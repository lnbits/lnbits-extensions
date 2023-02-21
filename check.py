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

        # sanity checks
        if not self.name[0].isupper():
            print(f"- ERROR: name does not start with uppercase letter")
            assert False
        if not self.short_description[0].isupper():
            print(f"- ERROR: short_description does not start with uppercase letter")
            assert False
        if self.short_description.endswith("."):
            print(f"- ERROR: short_description does end with '.'")
            assert False
        if not self.id == self.id.lower():
            print(f"- ERROR: id has mixed casing")
            assert False
        if not self.archive.startswith(self.repo):
            print(f"- ERROR: archive URL does not start with repo URL")
            assert False
        if not self.archive.endswith(f"{self.version}.zip"):
            bn = basename(self.archive)
            print(f"- ERROR: archive '{bn}' does not end with version (expected: {self.version}.zip)")
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


def main(args):
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

    failed = []
    for ext in extensions:
        # skip extension if args are provided and extension mentioned
        if args and ext["id"] not in args:
            continue
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
    if not main(sys.argv[1:]):
        sys.exit(1)
