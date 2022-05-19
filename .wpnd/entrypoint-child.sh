#!/bin/bash
set -euo pipefail

for dir in themes plugins
do
  echo "Linking $dir"
  for f in "/usr/src/wpnd/$dir"/*;
  do
    if [ ! -d "/usr/src/wordpress/wp-content/$dir/$f" ] && [ -d "$f" ]; then
      ln -s "$f" "/usr/src/wordpress/wp-content/$dir";
    fi
  done;
done

exec docker-entrypoint.sh "$@"
