#!/bin/bash

# Default to port 80 if PORT is not set
PORT=${PORT:-80}

# Fix Apache MPM Configuration
# Ensure only mpm_prefork is enabled to avoid "More than one MPM loaded" error
rm -f /etc/apache2/mods-enabled/mpm_event.load
rm -f /etc/apache2/mods-enabled/mpm_event.conf
rm -f /etc/apache2/mods-enabled/mpm_worker.load
rm -f /etc/apache2/mods-enabled/mpm_worker.conf
# Ensure mpm_prefork is enabled
if [ ! -e /etc/apache2/mods-enabled/mpm_prefork.load ]; then
    ln -s /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load
    ln -s /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf
fi

# Configure Apache to listen on the correct port
sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
sed -i "s/:80/:$PORT/" /etc/apache2/sites-available/000-default.conf

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Cache config/routes/views
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Apache
echo "Starting Apache on port $PORT..."
exec apache2-foreground
