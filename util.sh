#!/bin/sh

# clones all extensions from extensions.json into extensions folder
clone() {
    mkdir -p extensions
    cd extensions
    jq -r '.extensions[] | .repo + " " + .id' ../extensions.json | while read -r line
    do
        repo=$(echo $line | cut -f1 -d" " | sed 's/https:\/\//git@/' | sed 's/\//:/')
        id=$(echo $line | cut -f2 -d" ")
        git clone $repo $id
    done
}

# pulls all extensions from extensions.json
pull() {
    cd extensions
    jq -r '.extensions[] | .repo + " " + .id' ../extensions.json | while read -r line
    do
        # repo=$(echo $line | cut -f1 -d" " | sed 's/https:\/\//git@/' | sed 's/\//:/')
        id=$(echo $line | cut -f2 -d" ")
        cd $id
        git pull
        cd ..
    done
}

# gives you lnbits env variables for all extensions
env() {
    env=$(jq -rj '.extensions[].id+","' ./extensions.json | sed 's/.$//')
    echo "LNBITS_EXTENSIONS_DEFAULT_INSTALL=\"$env\""
}

# param: extension id (example)
# param: key (version)
# param: value (v0.0.0)
update_extension_attribute(){
    tmp=$(mktemp)
    jq --indent 4 --arg id $1 --arg key $2 --arg value $3 '( .extensions[] | select(.min_lnbits_version != null) | select(.id == $id) ) |= with_entries(if .key == $key then .value = $value else . end)' extensions.json > "$tmp" && mv "$tmp" extensions.json
}

# param: extension id (example)
# param: version (v0.0.0)
update_extension() {
    archive="https://github.com/lnbits/$1/archive/refs/tags/$2.zip"
    wget -q --spider $archive || { echo "ERROR: release does not exist" ; exit 1 ; }
    update_extension_attribute $1 version $(echo $2 | sed -r "s/v//")
    update_extension_attribute $1 archive $archive
    update_extension_attribute $1 hash $(wget -O - $archive 2> /dev/null | sha256sum | cut -d" " -f 1)
}

# execute functions
$@

# example
# sh util.sh clone
# sh util.sh pull
# sh util.sh update_extension example "v0.0.0"
