#!/bin/bash

echo "First of all, make sure [wget] is installed in your Linux environment!"
echo "1. Open the Google Drive folders, and right click on the file you want to download"
echo "2. Select the [Get Link] option, and then click on the [Copy Link] button"
echo "3. Once you got the link, paste it below"

while true; do
  read -p "Enter the File Link Here >>>" link
  fileId=$( echo $link | sed -E 's/.*\/d\/(.+)\/view.*/\1/' )
  read -p "Enter the File Name Here (no extention) >>>" fileName
  wget "https://drive.google.com/uc?export=download&id=${fileId}&confirm=yes" -O "CSV/files/${fileName}.csv"

  while true; do 
    read -p "Would you like to fetch another file? (y/n)" proceed
    if [[ $proceed == 'y' ]]; then
      continue 2;
    elif [[ $proceed == 'n' ]]; then
      break 2;
    else 
      continue;
    fi
  done
done
