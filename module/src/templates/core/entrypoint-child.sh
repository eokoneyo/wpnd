#!/bin/bash
set -euo pipefail

# Explicitly define the directories that get symlinked from wpnd directory
# into wordpress installation directory
allowed_directories=("themes" "plugins" "mu-plugins")
docker_wp_content_path="/usr/src/wordpress/wp-content"

for record in "/usr/src/wpnd"/*; do
  record_name=$(basename "$record")
  if [[ "${allowed_directories[*]}" =~ $record_name ]]; then
    for f in "/usr/src/wpnd/$record_name"/*; do
      mount_path="$docker_wp_content_path/$record_name/$(basename "$f")"
      mount_path_parent_dir=$(dirname "$mount_path")

      # for files that will be mounted to mu-plugins directory confirm that theres neither a file or directory already pre-existing
      if [[ $record_name = "mu-plugins" ]] && ! [[ -d "$mount_path" || -f "$mount_path" ]]; then

        # cover case where parent directory doesn't exist; i.e mu-plugins
        if [[ ! -d "$mount_path_parent_dir" ]]; then
          mkdir "$mount_path_parent_dir"
        fi

        echo "Linking $(basename "$f") to $mount_path_parent_dir"

        ln -s "$f" "$mount_path_parent_dir"

      elif [[ -d "$f" && ! -d "$mount_path" && ! "$record_name" = "mu-plugins" ]]; then

        echo "Linking $(basename "$f") directory to $mount_path_parent_dir"

        ln -s "$f" "$mount_path_parent_dir"
      fi
    done
  elif [[ -f "$record" && ! -f "$docker_wp_content_path/$record_name" ]]; then
    echo "linking $record_name to $docker_wp_content_path"
    ln -s "$record" "$docker_wp_content_path"
  fi
done

# pass along command to start container,
# see https://github.com/docker-library/wordpress/blob/master/Dockerfile.template#L261 for possible values
exec docker-entrypoint.sh "apache2-foreground"
