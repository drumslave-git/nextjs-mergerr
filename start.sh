#!/bin/sh
if [ ! -f /app/config/data.db ]; then
  echo "Database not found, creating..."
  npm run db:push
fi
echo "Starting server..."
node server.js