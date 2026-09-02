#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
اسنپ‌شات دیتای بک‌اند → نسخه‌ی استاتیک (برای دیپلوی روی Vercel).

این اسکریپت از بک‌اند Django (که باید روشن باشد) دیتای عمومی سایت را می‌خواند و
دو چیز را در همین پروژه‌ی frontend-static به‌روز می‌کند:
  1) src/data/db.json  →  محصولات، مقالات، قوانین، دسته‌بندی‌ها، نظرات، نرخ ارز
  2) public/media/uploads/  →  همه‌ی عکس‌های ارجاع‌شده (آدرس‌ها نسبی می‌شوند)

طرزکار:
  1. بک‌اند را بالا بیاور:  bash ../backend/run.sh   (پورت ۸۰۰۱)
  2. این را اجرا کن:        python3 scripts/snapshot.py
  3. بیلد بگیر و دیپلوی کن:  npm run build

اگر آدرس بک‌اند فرق دارد:  BACKEND=http://127.0.0.1:8001 python3 scripts/snapshot.py
"""
import json, os, re, sys, shutil, urllib.request

BACKEND = os.environ.get("BACKEND", "http://localhost:8001").rstrip("/")
API = BACKEND + "/api"
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                     # frontend-static/
DB_OUT = os.path.join(ROOT, "src", "data", "db.json")
MEDIA_OUT = os.path.join(ROOT, "public", "media", "uploads")
# پوشه‌ی media بک‌اند (کنار frontend-static، داخل ../backend)
BACKEND_MEDIA = os.path.abspath(
    os.path.join(ROOT, "..", "backend", "media", "uploads")
)


def get(path):
    with urllib.request.urlopen(API + path, timeout=30) as r:
        return json.load(r)


def results(d):
    if isinstance(d, dict) and "results" in d:
        return d["results"]
    return d


def rewrite(v):
    """localhost media URLs → relative /media/... (recursive)."""
    if isinstance(v, str):
        return v.replace(BACKEND + "/media/", "/media/").replace(BACKEND, "")
    if isinstance(v, list):
        return [rewrite(x) for x in v]
    if isinstance(v, dict):
        return {k: rewrite(x) for k, x in v.items()}
    return v


def main():
    try:
        rate = get("/settings/exchange-rate/").get("rate")
    except Exception as e:  # noqa: BLE001
        sys.exit(f"❌ بک‌اند در دسترس نیست ({API}). اول آن را بالا بیاور.\n{e}")

    cats_nested = rewrite(get("/categories/"))
    cats_flat = rewrite(results(get("/categories/flat/")))

    products_list = rewrite(results(get("/products/?page_size=1000")))
    products_detail = {}
    for p in products_list:
        products_detail[p["slug"]] = rewrite(get(f"/products/{p['slug']}/"))

    articles_list = rewrite(results(get("/articles/")))
    articles_detail = {}
    for a in articles_list:
        articles_detail[a["slug"]] = rewrite(get(f"/articles/{a['slug']}/"))

    testimonials = rewrite(results(get("/testimonials/")))
    regulations = rewrite(results(get("/regulations/")))
    regulations_detail = {r["slug"]: r for r in regulations}

    # اطلاعات بیعانه (بدون توکن قابل خواندن نیست) — مقدار قبلی را نگه می‌داریم اگر بود
    deposit = {
        "terms_text": "پرداخت بیعانه به‌منزله‌ی رزرو خودرو و شروع فرآیند سفارش است. مبلغ بیعانه پس از تأیید نهایی سفارش، از مبلغ کل کسر می‌شود. در صورت انصراف خریدار پس از ثبت سفارش، بازگشت بیعانه تابع شرایط قرارداد است. پس از واریز، تصویر فیش را از طریق تیکت پشتیبانی ارسال نمایید.",
        "deposit_amount_toman": 500000000,
        "card_number": "6037-9977-1234-5678",
        "sheba": "IR820540102680020817909002",
        "card_holder": "شعبانی خودرو",
    }
    if os.path.exists(DB_OUT):
        try:
            deposit = json.load(open(DB_OUT, encoding="utf-8")).get("deposit", deposit)
        except Exception:  # noqa: BLE001
            pass

    out = {
        "rate": rate,
        "categoriesNested": cats_nested,
        "categoriesFlat": cats_flat,
        "productsList": products_list,
        "productsDetail": products_detail,
        "articlesList": articles_list,
        "articlesDetail": articles_detail,
        "testimonials": testimonials,
        "regulations": regulations,
        "regulationsDetail": regulations_detail,
        "deposit": deposit,
    }
    os.makedirs(os.path.dirname(DB_OUT), exist_ok=True)
    json.dump(out, open(DB_OUT, "w", encoding="utf-8"), ensure_ascii=False)

    # --- کپی عکس‌های ارجاع‌شده ---
    refs = set(re.findall(r"/media/uploads/([A-Za-z0-9_.\-]+)",
                          json.dumps(out, ensure_ascii=False)))
    os.makedirs(MEDIA_OUT, exist_ok=True)
    copied, missing = 0, []
    for name in refs:
        src = os.path.join(BACKEND_MEDIA, name)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(MEDIA_OUT, name))
            copied += 1
        else:
            missing.append(name)

    print(f"✅ db.json نوشته شد  (rate={rate})")
    print(f"   محصولات={len(products_list)}  مقالات={len(articles_list)}  "
          f"نظرات={len(testimonials)}  قوانین={len(regulations)}")
    print(f"✅ عکس‌ها: {copied} کپی شد" + (f" — {len(missing)} پیدا نشد" if missing else ""))
    if missing:
        print("   ناموجود:", ", ".join(missing[:8]))
    print("\nمرحله‌ی بعد:  npm run build  و سپس دیپلوی پوشه‌ی dist روی Vercel")


if __name__ == "__main__":
    main()
