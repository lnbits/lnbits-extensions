$ wget -O - https://github.com/DFXswiss/DFXswiss/archive/refs/tags/0.1.2.zip 2> /dev/null | sha256sum | cut -d" " -f 1

# LNbits Vetted Extensions

Official registry for vetted LNbits extensions

To submit an extension to this registry add your manifest into the [`extensions.json`](extensions.json) file in this repository.

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

```console
$ wget -O - https://github.com/lnbits/withdraw/archive/refs/tags/0.1.1.zip 2> /dev/null | sha256sum | cut -d" " -f 1
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


### util for cloning and pulling all extensions
cloning all extensions into `extensions` dir. requires `jq` to be installed.
```sh
sh util.sh clone
```
pulling all extensions from `extensions` dir
```sh
sh util.sh pull
```
get lnbits env variables for all extensions
```sh
sh util.sh env
```

### Example video on how to release a extension into this repo
this uses a github workflow like this: https://github.com/lnbits/example/blob/main/.github/workflows/release.yml

https://github.com/lnbits/lnbits-extensions/assets/1743657/0d0a6626-655b-4528-9547-9fdc348cf9a6
