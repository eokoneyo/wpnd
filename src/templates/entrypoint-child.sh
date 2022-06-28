#!/bin/bash
set -euo pipefail

for dir in themes plugins mu-plugins
do
  echo "Linking $dir"
  for f in "/usr/src/wpnd/$dir"/*;
  do
    if [[ ! -d "/usr/src/wordpress/wp-content/$dir/$f"  &&  -d "$f" ]] || [ "$dir" = mu-plugins ]; then

      # cover case where parent directory doesn't exist; i.e mu-plugins
      if [ ! -d "/usr/src/wordpress/wp-content/$dir" ]; then
        mkdir "/usr/src/wordpress/wp-content/$dir"
      fi

      ln -s "$f" "/usr/src/wordpress/wp-content/$dir";
    fi
  done;
done

exec docker-entrypoint.sh "$@"
