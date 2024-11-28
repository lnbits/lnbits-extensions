#!/bin/sh

# clones all extensions from extensions.json into extensions folder
jq_ext_cmd='[.extensions[] | .repo + " " + .id] | unique | .[]'
clone() {
    mkdir -p extensions
    cd extensions
    jq -r "$jq_ext_cmd" ../extensions.json | while read -r line
    do
        repo=$(echo $line | cut -f1 -d" " | sed 's/https:\/\//git@/' | sed 's/\//:/')
        id=$(echo $line | cut -f2 -d" ")
        git clone $repo $id
    done
    cd ..
}

# pulls all extensions from extensions.json
pull() {
    cd extensions
    jq -r "$jq_ext_cmd" ../extensions.json | while read -r line
    do
        # repo=$(echo $line | cut -f1 -d" " | sed 's/https:\/\//git@/' | sed 's/\//:/')
        id=$(echo $line | cut -f2 -d" ")
        cd $id
        git pull
        cd ..
    done
    cd ..
}

# gives you LNbits env variables for all extensions
env() {
    env=$(jq -rj '[.extensions[].id] | unique | .[]+","' ./extensions.json | sed 's/.$//')
    echo "LNBITS_EXTENSIONS_DEFAULT_INSTALL=\"$env\""
}

# param: extension id (example)
# param: version (v0.0.0)
update_extension() {
    python update_version.py $1 $2
}

# execute functions
$@

# example
# sh util.sh clone
# sh util.sh pull
# sh util.sh update_extension example "v0.0.0"
