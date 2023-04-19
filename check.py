import json
import sys
from hashlib import sha256
from io import BytesIO
from os.path import basename
from zipfile import ZipFile

import requests
from PIL import Image

EXTENSIONS_FILE = "extensions.json"
UNPACK_ZIP_CONTENTS = False
CHECK_ZIP_CONTENTS = True

MANDATORY_FILES = [
    "LICENSE",
    "README.md",
    "__init__.py",
    "config.json",
    "manifest.json",
]

# set to True to enable caching of downloaded files, useful for debug
CACHE_DOWNLOADS = False
if CACHE_DOWNLOADS:
    import requests_cache

    requests_cache.install_cache("lnbits-extensions-cache")


def get_remote_file(url):
    r = requests.get(url)
    return r.content


def get_remote_zip(url):
    d = get_remote_file(url)
    z = ZipFile(BytesIO(d))
    return sha256(d).hexdigest(), z


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

    def validate(self) -> (bool, str):
        print(f"Checking '{self.name}' extension ({self.id} {self.version})")

        # sanity checks
        if not self.name[0].isupper():
            return False, "name does not start with uppercase letter"
        if not self.short_description[0].isupper():
            return False, "short_description does not start with uppercase letter"
        if self.short_description.endswith("."):
            return False, "short_description should not end with '.'"
        if not self.id == self.id.lower():
            return False, "id has mixed casing"
        if not self.archive.startswith(self.repo):
            return False, "archive URL does not start with repo URL"
        if not self.archive.endswith(f"{self.version}.zip"):
            bn = basename(self.archive)
            return False, "archive name '{bn}' doesn't end with {self.version}.zip"

        # print archive info from json
        archive_hash, archive_zip = get_remote_zip(self.archive)
        print(f"- url  : {self.archive}")
        print(f"- hash : {self.hash} (expected)")
        print(f"- hash : {archive_hash} (real)")

        # check downloaded zip
        bad_file = archive_zip.testzip()
        if bad_file is not None:
            return False, f"archive check for file {bad_file} failed"

        if UNPACK_ZIP_CONTENTS:
            archive_zip.extractall("extensions")

        if CHECK_ZIP_CONTENTS:
            filelist = archive_zip.namelist()
            print('### filelist', filelist)
            prefix = f"{basename(self.repo)}-{self.version}"

            mandatory_files = MANDATORY_FILES.copy()
            # these are known to not include the LICENSE file in their latest release
            # this is fixed in master, but we are waiting for the upcoming release
            if self.id in [
                "bleskomat",
                "boltcards",
                "deezy",
                "discordbot",
                "events",
                "hivemind",
                "livestream",
                "market",
                "nostrnip5",
                "offlineshop",
                "paywall",
                "satsdice",
                "smtp",
                "streamalerts",
                "subdomains",
                "withdraw",
            ]:
                mandatory_files.remove("LICENSE")

            # these are known to not include the manifest.json file in their latest release
            # this is fixed in master, but we are waiting for the upcoming release
            if self.id in [
                "bleskomat",
                "smtp",
                "subdomains",
            ]:
                mandatory_files.remove("manifest.json")

            for f in mandatory_files:
                fn = f"{prefix}/{f}"
                if fn not in filelist:
                    return False, f"file {fn} not contained in the archive"

        # check icon
        try:
            icon = get_remote_file(self.icon)
            img = Image.open(BytesIO(icon))
            print(f"- icon : OK {img.size[0]}x{img.size[1]} @ {img.mode} ({self.icon})")
        except Exception as ex:
            print(f"- icon : broken ({self.icon})")
            return False, f"broken icon ({self.icon})"

        return True, ""


def main(args):
    # load stuff from json
    try:
        print(f"Loading {EXTENSIONS_FILE}")
        j = json.load(open(EXTENSIONS_FILE, "rt"))
        extensions = j["extensions"]
        featured = j["featured"]
        print("OK")
    except Exception as ex:
        print(f"FAILED: {ex}")
        return False
    print()

    # check whether extensions listed in featured exist
    try:
        print("Checking whether featured extensions exist")
        extensions_ids = [e["id"] for e in extensions]
        for f in featured:
            assert f in extensions_ids
        print("OK")
    except Exception as ex:
        print(f"FAILED: {ex}")
        return False
    print()

    failed = {}
    for ext in extensions:
        # skip extension if args are provided and extension mentioned
        if args and ext["id"] not in args:
            continue
        e = Extension(ext)
        ok, err = e.validate()
        if ok:
            print("OK")
        else:
            print(f"FAILED: {err}")
            failed[ext["id"]] = err
        print()

    print("Failed extensions:")
    if not failed:
        print("NONE, ALL GOOD!")
    else:
        for k, v in failed.items():
            print(f"- {k}: {v}")

    return not failed


if __name__ == "__main__":
    if not main(sys.argv[1:]):
        sys.exit(1)
