"""Exercise manifest updates with local fake release archives, without networking."""

import hashlib
import io
import json
import os
import runpy
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from zipfile import ZipFile

SCRIPT = Path(__file__).with_name("update_version.py")


class UpdateVersionTests(unittest.TestCase):
    def update(self, manifest, config, repo="example", version="v2.0.0"):
        archive = io.BytesIO()
        with ZipFile(archive, "w") as zipped:
            zipped.writestr(
                f"{repo}-{version.removeprefix('v')}/config.json", json.dumps(config)
            )
        payload = archive.getvalue()
        original_directory = Path.cwd()
        with tempfile.TemporaryDirectory() as folder:
            try:
                os.chdir(folder)
                Path("extensions.json").write_text(json.dumps(manifest))
                with (
                    patch("sys.argv", [str(SCRIPT), repo, version]),
                    patch("urllib.request.urlopen", return_value=io.BytesIO(payload)),
                ):
                    runpy.run_path(str(SCRIPT), run_name="__main__")
                result = json.loads(Path("extensions.json").read_text())
            finally:
                os.chdir(original_directory)
        return result, hashlib.sha256(payload).hexdigest()

    def test_replaces_all_previous_versions_and_preserves_other_entries(self):
        other = {"id": "other", "version": "1.0.0"}
        older = {
            "id": "example",
            "version": "0.1.0",
            "min_lnbits_version": "0.12.0",
            "max_lnbits_version": "1.0.0",
        }
        previous = {
            "id": "example",
            "version": "1.0.0",
            "min_lnbits_version": "1.0.0",
            "max_lnbits_version": "1.6.0",
            "pay_link": "https://example.invalid/invoice",
            "icon": "kept-icon",
        }
        manifest = {
            "extensions": [older, other, previous],
            "featured": ["example"],
            "categories": {"tools": ["example", "other"]},
        }
        for minimum in ("1.0.0", "1.7.0"):
            with self.subTest(minimum=minimum):
                config = {
                    "name": "New name",
                    "short_description": "New description",
                    "min_lnbits_version": minimum,
                }
                result, checksum = self.update(manifest, config)
                self.assertEqual(len(result["extensions"]), 2)
                release, untouched = result["extensions"]
                self.assertEqual(untouched, other)
                self.assertEqual(release["version"], "2.0.0")
                self.assertEqual(release["hash"], checksum)
                self.assertEqual(release["min_lnbits_version"], minimum)
                self.assertEqual(release["name"], "New name")
                self.assertNotIn("max_lnbits_version", release)
                self.assertEqual(release["pay_link"], previous["pay_link"])
                self.assertEqual(release["icon"], previous["icon"])
                self.assertTrue(release["archive"].endswith("/v2.0.0.zip"))
                for key in ("featured", "categories"):
                    self.assertEqual(result[key], manifest[key])

    def test_first_entry_and_submitted_maximum_are_preserved(self):
        manifest = {"extensions": [{"id": "example", "icon": "kept-icon"}]}
        result, _ = self.update(
            manifest,
            {
                "min_lnbits_version": "1.7.0",
                "max_lnbits_version": "2.0.0",
            },
        )
        self.assertEqual(len(result["extensions"]), 1)
        self.assertEqual(result["extensions"][0]["icon"], "kept-icon")
        self.assertEqual(result["extensions"][0]["max_lnbits_version"], "2.0.0")

    def test_new_extension_is_appended_with_its_configured_id(self):
        other = {"id": "other", "version": "1.0.0"}
        result, _ = self.update(
            {"extensions": [other]},
            {
                "id": "custom_id",
                "name": "Example",
                "min_lnbits_version": "1.7.0",
                "tile": "/example/static/icon.png",
            },
        )
        self.assertEqual(result["extensions"][0], other)
        release = result["extensions"][1]
        self.assertEqual(release["id"], "custom_id")
        self.assertEqual(release["repo"], "https://github.com/lnbits/example")
        self.assertEqual(
            release["icon"],
            "https://raw.githubusercontent.com/lnbits/example/main/static/icon.png",
        )

    def test_real_catalog_update_only_replaces_the_submitted_extension(self):
        manifest = json.loads(SCRIPT.with_name("extensions.json").read_text())
        result, _ = self.update(
            manifest,
            {
                "id": "paywall",
                "name": "Paywall",
                "min_lnbits_version": "1.7.0",
            },
            repo="paywall",
        )
        self.assertEqual(sum(e["id"] == "paywall" for e in result["extensions"]), 1)
        self.assertEqual(
            [e for e in result["extensions"] if e["id"] != "paywall"],
            [e for e in manifest["extensions"] if e["id"] != "paywall"],
        )
        self.assertEqual(
            {k: v for k, v in result.items() if k != "extensions"},
            {k: v for k, v in manifest.items() if k != "extensions"},
        )


if __name__ == "__main__":
    unittest.main()
