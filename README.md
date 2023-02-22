# LNbits Vetted Extensions
Official registry for vetted LNbits extensions<br/>
To submit an extension to this registry upload the extension release `.zip` <a href="https://github.com/lnbits/lnbits-extensions/tree/main/extensions">here</a>, add add your manifest <a href="https://github.com/lnbits/lnbits-extensions/blob/main/extensions.json">here</a>.


The <a href="https://github.com/lnbits/lnbits-extensions/blob/main/extensions.json">manfest.json</a> file in this repo MUST use the `extensions` format:
```
 {
    "id": "copilot",
    "repo": "https://github.com/lnbits/copilot",
    "name": "Streamer Copilot",
    "version": "0.4",
    "short_description": "For streamers to accept sats and trigger gifs",
    "icon": "https://raw.githubusercontent.com/lnbits/copilot/main/static/bitcoin-streaming.png",
    "archive": "https://github.com/lnbits/lnbits-extensions/raw/main/extensions/copilot/copilot.zip",
    "hash": "b7912ebfdb7bd5043e9781ce9e2e74db77e748d8de188573ffcdd7420085a5da"
},
```
For an exensions local <a href="https://github.com/lnbits/gerty-extension/blob/main/manifest.json">manifest.json</a> use the `repos` format:
```
{
    "repos": [
        {
            "id": "gerty",
            "organisation": "lnbits",
            "repository": "gerty-extension"
        }
    ]
}
```

### Getting sha256 checksum for your release

To get the hash of your relase `.zip` in terminal run: <br/>
```console
shasum -a 256 usermanager-extension.zip
```
or
```console
sha256sum usermanager-extension.zip
```

#### sha256 of github releases
```console
$ wget -O - https://github.com/dni/lnbits-smtp-extension/archive/refs/tags/0.1.zip 2> /dev/null | sha256sum | cut -d" " -f 1
074b1c557c92927c17cbffce9c98de652c4f152e89ebd809a465fe40d23efa31
```

### Lighter zip archive
 - documentation, tests and other type of files should not be included in the `zip` archive generated when a GitHub release is created
 - in order to exclude these files one must:
    - create a `.gitattributes` file (on the top level of the repo)
    - add a line for the ignored files/dirs: `README.md export-ignore`
    - see example [here](https://github.com/lnbits/nostr-relay-extension/blob/main/.gitattributes)
