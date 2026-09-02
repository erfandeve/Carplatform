from rest_framework.permissions import BasePermission, SAFE_METHODS

from core.constants import ROLE_ADMIN, ROLE_SUPPORT, ROLE_PRODUCT


class IsAdminRole(BasePermission):
    """Any staff role (admin / support / product manager)."""

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and u.is_admin_user)


class ReadOnlyOrAdmin(BasePermission):
    """Public reads; writes require a staff role."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        u = request.user
        return bool(u and u.is_authenticated and u.is_admin_user)


class IsProductManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        u = request.user
        return bool(
            u and u.is_authenticated
            and (u.is_superuser or u.role in {ROLE_ADMIN, ROLE_PRODUCT})
        )


class IsSupportOrAdmin(BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return bool(
            u and u.is_authenticated
            and (u.is_superuser or u.role in {ROLE_ADMIN, ROLE_SUPPORT})
        )
