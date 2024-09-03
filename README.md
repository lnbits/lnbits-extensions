# LNbits Vetted Extensions

Official registry for vetted LNbits extensions

To submit an extension to this registry add your manifest into the [`extensions.json`](extensions.json) file in this repository.
### Important

Only submit fully working extensions, the review process is not intended to improve the extension code.

Do not add dependencies, LNbits has plenty of dependencies you can use.

The easier an extension is to review, the quicker the review process will be.

### Manifest format

The file MUST use the `extensions` format:

```json
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

```json
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

### Paid extensions
It is possible for developers to require a payment for their extensions. In order to do so an extension release must have this field:
```json
   "pay_link": "# payment URL"
```

**Example**:
```json
{
    "id": "testext",
    "repo": "https://github.com/lnbits/testext",
    "name": "Test Extension",
    "version": "0.5",
    "short_description": "Private Test Extension",
    "icon": "https://raw.githubusercontent.com/lnbits/example/main/static/bitcoin-extension.png",
    "archive": "https://demo.lnbits.com/paywall/download/m2FVCFktJzMcGKXTaHbyhi",
    "pay_link": "https://demo.lnbits.com/paywall/api/v1/paywalls/invoice/m2FVCFktJzMcGKXTaHbyhi",
    "hash": "455527407fcfdc5e8aba93f16802d1083d36dcdfdde829f919cee07420791d61"
}
```

The [Paywall LNbits Extension](https://github.com/lnbits/paywall/blob/main/README.md#file-paywall) can be used to serve the extension `zip` file.

If you do not want to use the [Paywall LNbits Extension](https://github.com/lnbits/paywall/) to server your extension, but instead you want to use your own paywall, then the `pay_link` endpoint must follow these specifications:

<table>
<tr>
<th>HTTP Request</th>
<th>HTTP Response</th>
<th>Description</th>
</tr>
<tr>
<td>

```HTTP
GET pay_link
```
</td>
<td>

```json
{
    "amount": 5
}
````

</td>
<td>Get the amount in `sats` required by this extension release.</td>
</tr>
<tr>
<td>

```HTTP
GET pay_link?amount=5
```

</td>
<td>

```json
{
    "payment_hash": "04c33f37d01aff...fd7c407a",
    "payment_request": "lnbc50n1pju...n7h8gucqn2cgau"
}
```

</td>
<td>Request an invoice for the specified amount (or higher).</td>
</tr>
<tr>
<td>

```HTTP
WS pay_link/{payment_hash}

```

</td>
<td>

```json
{"paid": true|false}
```

</td>
<td>Open a websocket to be notified when the invoice has been paid.</td>
</tr>
</table>

In order to download the file one must add the `payment_hash` and an `version` (optional) query parameters to the `archive` URL. Eg:

```HTTP
GET https://demo.lnbits.com/paywall/download/m2FVCFktJzMcGKXTaHbyhi?payment_hash=3bf...7ec&version=v0.1
```


### Getting sha256 checksum for a release

```console
$ wget -O - https://github.com/lnbits/withdraw/archive/refs/tags/0.1.1.zip 2> /dev/null | sha256sum | cut -d" " -f 1
baff0b6162ffb65cc0b4c721a4aa40a7d3d48acd55a3e344cba3eb1d35cf2074
```

### Lighter ZIP archive

-   documentation, tests and other type of files should not be included in the zip archive generated when a GitHub release is created
-   keep the `README.md` and `LICENSE` files in the zip as these are required!
-   in order to exclude these files one must:
    -   create a `.gitattributes` file (on the top level of the repo)
    -   add a line for the ignored files/dirs: `tests/ export-ignore`

### Checking the changes before sending a pull request

-   after editing the `manifest.json` file in this repo you should run `python3 check.py` as a sanity check
-   you can run `python3 check.py foo bar` only to run sanity checks on extensions named `foo` and `bar`

### util for cloning and pulling all extensions

cloning all extensions into `extensions` dir. requires `jq` to be installed.

```sh
sh util.sh clone
```

pulling all extensions from `extensions` dir

```sh
sh util.sh pull
```

get LNbits env variables for all extensions

```sh
sh util.sh env
```

update a extension in extensions.json with id and version

```sh
sh util.sh update_extension example v0.4.2
```

### Example video on how to release a extension into this repo

this uses a github workflow like this: https://github.com/lnbits/example/blob/main/.github/workflows/release.yml

https://github.com/lnbits/lnbits-extensions/assets/1743657/0d0a6626-655b-4528-9547-9fdc348cf9a6


# Integration Tests
## setup
```sh
make install-jmeter
```
## configure
make sure LNbits is running and start the mirror server
```sh
make start-mirror-server
```
## run
```sh
make test
```
