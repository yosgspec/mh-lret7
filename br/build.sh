dotnet publish -c Release -o out
rm -r ../lret/mhwi-br
mv ./out/mh-lret/dist ../lret/mhwi-br
rm -r ./out
patch -u ../lret/mhwi-br/index.html ./base.patch
read -p "done."
