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

echo "Starting server..."
exec su-exec nextjs "$@"