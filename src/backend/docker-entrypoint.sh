#!/bin/bash

# Default to port 80 if PORT is not set
PORT=${PORT:-80}

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
