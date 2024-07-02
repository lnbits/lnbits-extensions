#!/bin/sh

CONFS=$(cat extensions.json \
	| jq -r '[.extensions[].repo] | unique | .[]' \
    | sed -e 's/https:\/\/github.com\//https:\/\/raw.githubusercontent.com\//' -e 's/$/\/main\/config.json/')

for conf in $CONFS; do
    name=$(echo $conf | cut -d'/' -f5)
    echo "Downloading $conf"
    curl -s $conf | jq --arg name $name '. + {id: $name}' >> metadata.tmp.json
done

cat metadata.tmp.json | jq -s . > metadata.json
rm metadata.tmp.json
