#!/bin/bash
set -euo pipefail

# Explicitly define the directories that get symlinked from wpnd directory
# into wordpress installation directory
allowed_directories=("themes" "plugins" "mu-plugins")

for record in "/usr/src/wpnd"/*; do
  if [[ "${allowed_directories[*]}" =~ ${record} ]]; then
    # whatever you want to do when array contains value
    dir=$record
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

        ln -s "$f" "$mount_path_parent_dir"

      elif [[ -d "$f" && ! -d "$mount_path" && ! "$dir" = mu-plugins ]]; then

        echo "Linking $(basename "$f") to $mount_path_parent_dir"

        ln -s "$f" "$mount_path_parent_dir"
      fi
    done
  elif [[ -f "$record" && ! -f "$record" ]]; then
    #TODO: decide how single files will be handled
    echo "found $record"
  fi
done

exec docker-entrypoint.sh "$@"
