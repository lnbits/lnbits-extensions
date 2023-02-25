# LNbits Vetted Extensions

Official registry for vetted LNbits extensions

To submit an extension to this registry add your manifest into the [`manifest.json`](extensions.json) file in this repository.

The file MUST use the `extensions` format:

``` json
{
    "id": "gerty",
    "repo": "https://github.com/lnbits/gerty",
    "name": "Gerty",
    "version": "0.1.2",
    "short_description": "Your bitcoin assistant",
    "icon": "https://raw.githubusercontent.com/lnbits/gerty/main/static/gerty.png",
    "archive": "https://github.com/lnbits/gerty/archive/refs/tags/0.1.2.zip",
    "hash": "baff0b6162ffb65cc0b4c721a4aa40a7d3d48acd55a3e344cba3eb1d35cf2074"
},
```

For an exensions local [`manifest.json`](https://github.com/lnbits/gerty/blob/main/manifest.json) use the `repos` format:

``` json
{
    "repos": [
        {
            "id": "gerty",
            "organisation": "lnbits",
            "repository": "gerty"
        }
    ]
}
```

### Getting sha256 checksum for a release

``` bash
curl -L https://github.com/lnbits/gerty/archive/refs/tags/0.1.2.zip | sha256sum | cut -d " " -f 1
baff0b6162ffb65cc0b4c721a4aa40a7d3d48acd55a3e344cba3eb1d35cf2074
```

### Lighter ZIP archive

- documentation, tests and other type of files should not be included in the zip archive generated when a GitHub release is created
- keep the `README.md` and `LICENSE` files in the zip as these are required!
- in order to exclude these files one must:
    - create a `.gitattributes` file (on the top level of the repo)
    - add a line for the ignored files/dirs: `tests/ export-ignore`

### Checking the changes before sending a pull request

- after editing the `manifest.json` file in this repo you should run `python3 check.py` as a sanity check
- you can run `python3 check.py foo bar` only to run sanity checks on extensions named `foo` and `bar`
