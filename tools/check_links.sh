#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <html_file>"
    exit 1
fi

HTML_FILE="$1"

if [ ! -f "$HTML_FILE" ]; then
    echo "File not found: $HTML_FILE"
    exit 1
fi

links=$(grep -oP 'href="\K[^"]+' "$HTML_FILE")

for link in $links; do
    http_status=$(curl -o /dev/null -s -w "%{http_code}\n" "$link")

    if [ "$http_status" -eq 200 ]; then
        echo -e "\033[32mValid link: $link\033[0m"
    else
        echo -e "\033[31mInvalid link: $link (HTTP status: $http_status)\033[0m"
    fi
done

