"""Shared domain constants."""

# The four customs/ownership states a car can hold simultaneously.
STATUS_CHOICES = [
    ('freePerm', 'منطقه آزاد دائم'),
    ('freeTemp', 'منطقه آزاد موقت'),
    ('gozarPerm', 'گذر دائم'),
    ('gozarTemp', 'گذر موقت'),
]
STATUS_KEYS = [k for k, _ in STATUS_CHOICES]

# Product kinds.
KIND_CAR = 'car'
KIND_PART = 'part'
KIND_USED = 'used'
KIND_CHOICES = [
    (KIND_CAR, 'خودروی صفر/نو'),
    (KIND_PART, 'لوازم یدکی و سایر'),
    (KIND_USED, 'خودروی دسته دوم'),
]

# Order sources — each has its own reorderable stage pipeline.
ORDER_NORMAL = 'normal'
ORDER_CUSTOM = 'custom'
ORDER_USED = 'used'
ORDER_TYPE_CHOICES = [
    (ORDER_NORMAL, 'سفارش محصولات موجود'),
    (ORDER_CUSTOM, 'درخواست خودروی سفارشی'),
    (ORDER_USED, 'سفارش خودروی دسته دوم'),
]

# User roles for admin RBAC.
ROLE_CUSTOMER = 'customer'
ROLE_ADMIN = 'admin'
ROLE_SUPPORT = 'support'
ROLE_PRODUCT = 'product_manager'
ROLE_CHOICES = [
    (ROLE_CUSTOMER, 'مشتری'),
    (ROLE_ADMIN, 'ادمین کل'),
    (ROLE_SUPPORT, 'پشتیبان'),
    (ROLE_PRODUCT, 'مدیر محصول'),
]
STAFF_ROLES = {ROLE_ADMIN, ROLE_SUPPORT, ROLE_PRODUCT}
