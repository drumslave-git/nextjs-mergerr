#!/bin/sh

PUID=${PUID:-1001}
PGID=${PGID:-1001}

usermod -o -u "$PUID" nextjs
groupmod -o -g "$PGID" nodejs

echo "
User UID:    $(id -u nextjs)
User GID:    $(id -g nextjs)
───────────────────────────────────────"

echo "Setting ownership..."
chown -R $PUID:$PGID /app

if [ ! -f /app/config/data.db ]; then
  echo "Database not found, creating..."
  exec su-exec nextjs touch /app/config/data.db
  exec su-exec nextjs npx --yes prisma db push
fi

echo "Starting server..."
exec su-exec nextjs "$@"