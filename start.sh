#!/bin/sh
if [ ! -f /app/config/data.db ]; then
  echo "Database not found, creating..."
  touch /app/config/data.db
  ls -la /app/config
  echo "data.db created"
  npx --yes prisma db push
fi
echo "Starting server..."
node server.js