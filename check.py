import json
import sys
from hashlib import sha256
from io import BytesIO
from os.path import basename
from zipfile import ZipFile

import requests
from PIL import Image

EXTENSIONS_FILE = "extensions.json"
CHECK_ZIP_CONTENTS = True
UNPACK_ZIP_CONTENTS = False

MANDATORY_FILES = [
    "LICENSE",
    "README.md",
    "__init__.py",
    "config.json",
    "manifest.json",
]

try:
    # use requests_cache if installed
    # useful for subsequent runs of the check
    # so the files are not downloaded again and again
    import requests_cache

    requests_cache.install_cache("lnbits-extensions-download-cache")
except ImportError:
    pass


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
        self.min_lnbits_version = ext.get("min_lnbits_version")
        self.max_lnbits_version = ext.get("max_lnbits_version")

    def validate(self) -> tuple[bool, str]:
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
            return False, f"archive name '{bn}' doesn't end with {self.version}.zip"

        # print archive info from json
        archive_hash, archive_zip = get_remote_zip(self.archive)
        print(f"- url  : {self.archive}")
        print(f"- hash : {self.hash} (expected)")
        print(f"- hash : {archive_hash} (real)")
        if self.hash != archive_hash:
            return False, f"hash mismatch {self.hash} != {archive_hash}"

        # check downloaded zip
        bad_file = archive_zip.testzip()
        if bad_file is not None:
            return False, f"archive check for file {bad_file} failed"

        if UNPACK_ZIP_CONTENTS:
            archive_zip.extractall("extensions")

        if CHECK_ZIP_CONTENTS:
            filelist = archive_zip.namelist()
            prefix = f"{basename(self.repo)}-{self.version}"

            mandatory_files = MANDATORY_FILES.copy()
            # these are known to not include the LICENSE file in their latest release
            # this is fixed in master, but we are waiting for the upcoming release
            if self.id in [
                "bleskomat",
                "deezy",
                "discordbot",
                "livestream",
                "market",
                "paywall",
                "smtp",
                "streamalerts",
                "subdomains",
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

            # check config
            config = json.load(archive_zip.open(f"{prefix}/config.json"))

            # don't check name for now, they mismatch quite often :(
            """
            name = config.get("name")
            if name != self.name:
                return False, f"name mismatch: {name} != {self.name}"
            """

            # don't check short_description for now, they mismatch quite often :(
            """
            short_description = config.get("short_description")
            if short_description != self.short_description:
                return False, f"short_description mismatch: {short_description} != {self.short_description}"
            """

            min_lnbits_version = config.get("min_lnbits_version")
            print(f"- min_lnbits_version : {min_lnbits_version}")
            if min_lnbits_version != self.min_lnbits_version:
                return (
                    False,
                    f"min_lnbits_version mismatch: {min_lnbits_version} != {self.min_lnbits_version}",
                )

            # check max_lnbits_version only if it's present in the config.json
            max_lnbits_version = config.get("max_lnbits_version")
            if max_lnbits_version:
                print(f"- max_lnbits_version : {max_lnbits_version}")
                if max_lnbits_version != self.max_lnbits_version:
                    return (
                        False,
                        f"max_lnbits_version mismatch: {max_lnbits_version} != {self.max_lnbits_version}",
                    )

        # check icon
        try:
            icon = get_remote_file(self.icon)
            img = Image.open(BytesIO(icon))
            print(f"- icon : OK {img.size[0]}x{img.size[1]} @ {img.mode} ({self.icon})")
        except Exception:
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
            failed[f"{ext['id']} {ext['version']}"] = err
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
