#!/bin/bash

# make sure files directory exist to hold all csv files
DIR="$(dirname "$0")"
if [ ! -d "$DIR/files" ]; then
  mkdir "$DIR/files"
fi

# make a files dictionary to download multiple csv files
declare -A files

files["answers_photos"]="1TbhRZ_sKBAu2Z0-sppE55D051G3MVP9I"
files["questions"]="1yvXuqx6gT1ugD3vbVh6_tH8xEGx3Cwlb"
files["answers"]="1xVnfJGxq0If2d3rJI1IUWTC1RLigik1l"

for fileName in "${!files[@]}"; do
  prefix="https://drive.google.com/uc?export=download"
  wget "${prefix}&id=${files[$fileName]}&confirm=yes" \
  -O "${DIR}/files/${fileName}.csv"
done
