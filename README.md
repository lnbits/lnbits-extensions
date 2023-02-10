# LNbits Vetted Extensions
Official registry for vetted LNbits extensions<br/>
To submit an extension to this registry upload the extension release `.zip` <a href="https://github.com/lnbits/lnbits-extensions/tree/main/extensions">here</a>, add add your manifest <a href="https://github.com/lnbits/lnbits-extensions/blob/main/extensions.json">here</a>.

For an exensions local <a href="https://github.com/lnbits/gerty-extension/blob/main/manifest.json">manifest.json</a> use the `repo` format:
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
For the <a href="https://github.com/lnbits/lnbits-extensions/blob/main/extensions.json">manfest.json</a> file in this repo use the `extension` format:
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
To get the hash of your relase `.zip` in terminal run: <br/>
`shasum -a 256 'usermanager-extension.zip' `
