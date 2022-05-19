FROM wordpress:5.9.3-php8.0-apache

<<<<<<< HEAD
COPY custom.ini* $PHP_INI_DIR/conf.d/

# Applying the execution right on the folders for apache
COPY entrypoint-child.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint-child.sh
ENTRYPOINT ["entrypoint-child.sh"]

CMD ["apache2-foreground"]
=======
# remove pre-existing themes and include our own default parent theme
RUN rm -R $(ls -1 -d /usr/src/wordpress/wp-content/themes/*)

COPY custom.ini $PHP_INI_DIR/conf.d/
>>>>>>> 8616894 (naive approach to invoke docker, leveraging the fact that the .wpnd folder exists)
