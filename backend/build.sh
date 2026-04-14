#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies from requirements.txt
pip install -r requirements.txt

# Collect static files (e.g. Django admin panel graphics/CSS)
python manage.py collectstatic --no-input

# Run database migrations automatically
python manage.py migrate
