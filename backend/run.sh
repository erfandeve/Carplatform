#!/bin/bash
# راه‌اندازی بک‌اند اتوگلکسی — venv + مونگو + مهاجرت + سرور
# نکته: روی پورت ۸۰۰۱ اجرا می‌شود تا با پروژه‌های دیگر روی ۸۰۰۰ تداخل نکند.
set -e
cd "$(dirname "$0")"

PORT=8001

# 1) مطمئن شو MongoDB بالاست
if ! nc -z localhost 27017 2>/dev/null; then
  echo "▶ MongoDB بالا نیست — در حال اجرا…"
  brew services start mongodb-community || mongod --config /opt/homebrew/etc/mongod.conf --fork || true
  sleep 2
fi

# 2) اگر پورت اشغال است، فقط پراسس runserver خودمان را ببند (به پروژه‌های دیگر کاری نداریم)
if lsof -ti:$PORT >/dev/null 2>&1; then
  echo "▶ آزادسازی پورت $PORT…"
  lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
fi

# 3) venv را فعال کن
source venv/bin/activate

# 4) مهاجرت‌ها (بی‌خطر اگر قبلاً اجرا شده)
python manage.py migrate --noinput

# 5) سرور
echo "✅ بک‌اند روی http://localhost:$PORT اجرا شد"
exec python manage.py runserver 0.0.0.0:$PORT
