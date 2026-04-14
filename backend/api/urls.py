from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, ProductViewSet, PackageViewSet, InvoiceViewSet, QuotationViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'products', ProductViewSet)
router.register(r'packages', PackageViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'quotations', QuotationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
