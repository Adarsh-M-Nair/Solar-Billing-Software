from django.http import HttpResponse
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from xhtml2pdf import pisa

from .models import Customer, Product, Package, Invoice, Quotation
from .serializers import (
    CustomerSerializer, ProductSerializer, PackageSerializer,
    InvoiceSerializer, QuotationSerializer
)

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('name')
    serializer_class = ProductSerializer

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all().order_by('name')
    serializer_class = PackageSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-date_issued')
    serializer_class = InvoiceSerializer

    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        invoice = self.get_object()
        html_string = render_to_string('api/invoice_pdf.html', {
            'invoice': invoice,
            'company_name': getattr(settings, 'COMPANY_NAME', 'Solar Co.'),
            'company_address': getattr(settings, 'COMPANY_ADDRESS', ''),
            'company_email': getattr(settings, 'COMPANY_EMAIL', ''),
            'company_phone': getattr(settings, 'COMPANY_PHONE', ''),
            'company_state': getattr(settings, 'COMPANY_STATE', ''),
            'generated_at': timezone.now()
        })
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Invoice_{invoice.invoice_number}.pdf"'
        pisa_status = pisa.CreatePDF(html_string, dest=response)
        if pisa_status.err:
            return HttpResponse('Error generating PDF', status=500)
        return response

class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all().order_by('-date_issued')
    serializer_class = QuotationSerializer

    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        quotation = self.get_object()
        html_string = render_to_string('api/quotation_pdf.html', {
            'quotation': quotation,
            'company_name': getattr(settings, 'COMPANY_NAME', 'Solar Co.'),
            'company_address': getattr(settings, 'COMPANY_ADDRESS', ''),
            'company_email': getattr(settings, 'COMPANY_EMAIL', ''),
            'company_phone': getattr(settings, 'COMPANY_PHONE', ''),
            'company_state': getattr(settings, 'COMPANY_STATE', ''),
            'generated_at': timezone.now()
        })
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Quotation_{quotation.quotation_number}.pdf"'
        pisa_status = pisa.CreatePDF(html_string, dest=response)
        if pisa_status.err:
            return HttpResponse('Error generating PDF', status=500)
        return response
