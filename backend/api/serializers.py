from rest_framework import serializers
from django.conf import settings
from .models import Customer, Product, Package, PackageItem, Invoice, InvoiceItem, Quotation, QuotationItem
import uuid
from datetime import datetime

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class PackageItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = PackageItem
        fields = ['id', 'product', 'product_details', 'quantity']

class PackageSerializer(serializers.ModelSerializer):
    items = PackageItemSerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = ['id', 'name', 'description', 'total_price_override', 'items']

# --- INVOICE SERIALIZERS WITH GST LOGIC ---

class InvoiceItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = InvoiceItem
        fields = ['id', 'product', 'product_details', 'quantity', 'unit_price', 'cgst', 'sgst', 'igst', 'total_amount']
        read_only_fields = ['cgst', 'sgst', 'igst', 'total_amount']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    customer_details = CustomerSerializer(source='customer', read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer', 'customer_details', 'date_issued', 'subtotal', 'cgst_total', 'sgst_total', 'igst_total', 'grand_total', 'items']
        read_only_fields = ['subtotal', 'cgst_total', 'sgst_total', 'igst_total', 'grand_total', 'invoice_number']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        customer = validated_data['customer']
        
        # Generate Invoice Number based on Year and a random string for uniqueness
        invoice_number = f"INV-{datetime.now().year}-{str(uuid.uuid4())[:6].upper()}"
        
        # Is Interstate?
        company_state = getattr(settings, 'COMPANY_STATE', '').strip().lower()
        customer_state = customer.state.strip().lower()
        is_interstate = company_state != customer_state

        invoice = Invoice.objects.create(invoice_number=invoice_number, **validated_data)

        subtotal = 0
        cgst_total = 0
        sgst_total = 0
        igst_total = 0
        grand_total = 0

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            entered_unit_price = float(item_data['unit_price'])
            gst_rate = float(product.gst_rate)
            
            # Input unit_price is inclusive of GST
            line_total = entered_unit_price * quantity
            line_subtotal = line_total / (1 + gst_rate / 100)
            line_tax_total = line_total - line_subtotal
            
            # Base unit price for the "Rate" column in Invoice
            unit_price_base = line_subtotal / quantity
            
            line_cgst = 0
            line_sgst = 0
            line_igst = 0
            
            if is_interstate:
                line_igst = line_tax_total
            else:
                line_cgst = line_tax_total / 2
                line_sgst = line_tax_total / 2
                
            InvoiceItem.objects.create(
                invoice=invoice,
                product=product,
                quantity=quantity,
                unit_price=unit_price_base,
                cgst=line_cgst,
                sgst=line_sgst,
                igst=line_igst,
                total_amount=line_total
            )
            
            subtotal += line_subtotal
            cgst_total += line_cgst
            sgst_total += line_sgst
            igst_total += line_igst
            grand_total += line_total

        # Update invoice totals
        invoice.subtotal = subtotal
        invoice.cgst_total = cgst_total
        invoice.sgst_total = sgst_total
        invoice.igst_total = igst_total
        invoice.grand_total = grand_total
        invoice.save()

        return invoice

# --- QUOTATION SERIALIZERS ---
class QuotationItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = QuotationItem
        fields = ['id', 'product', 'product_details', 'quantity', 'unit_price', 'total_amount']
        read_only_fields = ['total_amount']

class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True)
    customer_details = CustomerSerializer(source='customer', read_only=True)

    class Meta:
        model = Quotation
        fields = ['id', 'quotation_number', 'customer', 'customer_details', 'date_issued', 'subtotal', 'tax_total', 'grand_total', 'items']
        read_only_fields = ['quotation_number', 'subtotal', 'tax_total', 'grand_total']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        quotation_number = f"QT-{datetime.now().year}-{str(uuid.uuid4())[:6].upper()}"
        
        quotation = Quotation.objects.create(quotation_number=quotation_number, **validated_data)

        subtotal = 0
        tax_total = 0
        grand_total = 0

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            entered_unit_price = float(item_data['unit_price'])
            gst_rate = float(product.gst_rate)
            
            # Input unit_price is inclusive of GST
            line_total = entered_unit_price * quantity
            line_subtotal = line_total / (1 + gst_rate / 100)
            line_tax = line_total - line_subtotal
            
            # Base unit price
            unit_price_base = line_subtotal / quantity
            
            QuotationItem.objects.create(
                quotation=quotation,
                product=product,
                quantity=quantity,
                unit_price=unit_price_base,
                total_amount=line_total
            )
            
            subtotal += line_subtotal
            tax_total += line_tax
            grand_total += line_total

        # Update totals
        quotation.subtotal = subtotal
        quotation.tax_total = tax_total
        quotation.grand_total = grand_total
        quotation.save()

        return quotation
