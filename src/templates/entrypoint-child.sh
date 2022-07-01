#!/bin/bash
set -euo pipefail

for dir in themes plugins mu-plugins
do
  for f in "/usr/src/wpnd/$dir"/*;
  do
    mount_path="/usr/src/wordpress/wp-content/$dir/$(basename "$f")"
    mount_path_parent_dir=$(dirname "$mount_path")

    # for files that will be mounted to mu-plugins directory confirm that theres neither a file or directory already pre-existing
    if [[ $dir = mu-plugins ]] && ! [[ -d "$mount_path" || -f "$mount_path" ]]; then

     # cover case where parent directory doesn't exist; i.e mu-plugins
      if [[ ! -d "$mount_path_parent_dir" ]]; then
        mkdir "$mount_path_parent_dir"
      fi

      echo "Linking $(basename "$f") to $mount_path_parent_dir"

      ln -s "$f" "$mount_path_parent_dir";

    elif [[ -d "$f" && ! -d "$mount_path" && ! "$dir" = mu-plugins ]]; then

      echo "Linking $(basename "$f") to $mount_path_parent_dir"

      ln -s "$f" "$mount_path_parent_dir";
    fi
  done;
done

exec docker-entrypoint.sh "$@"
