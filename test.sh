#!/bin/bash
files=$( ls ./integration/*.jmx)
echo "Files: $files"
for file in $files; do
    echo "Cleaning logs"
    rm -r reports logs
    echo "Running test with $file"
    date
    filename=$(basename "$file" ".jmx")
    echo "Using Extension Manifest: $EXTENSIONS_MANIFEST_PATH"
    ./apache-jmeter-5.6.3/bin/jmeter -DextensionsManifestPath="$EXTENSIONS_MANIFEST_PATH" -n -t $file -l logs/$filename.log -e -o reports ;
    error_count=$(cat jmeter.log | grep "summary =" | grep "Err:     1" | wc -l)
    echo "Error count: '$error_count'"
    echo "##########"
    echo "$error_count" == "0"
    echo "###########$error_count ###########"
    if [ "$error_count" = "0" ]; then
        echo "Test $filename OK."
    else
        echo "Test $filename failed. Error count: '$error_count'."
        cat logs/$filename.log
        exit 1
    fi
done
echo "Done"
date
