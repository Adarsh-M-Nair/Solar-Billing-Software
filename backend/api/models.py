from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=255)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField()
    state = models.CharField(max_length=100) # To check if inter-state or intra-state
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    gst_rate = models.DecimalField(max_digits=4, decimal_places=2, help_text="Percentage (e.g. 18.00 means 18%)")

    def __str__(self):
        return self.name

class Package(models.Model):
    name = models.CharField(max_length=255) # e.g. "3kW Solar Setup"
    description = models.TextField(blank=True)
    total_price_override = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.name

class PackageItem(models.Model):
    package = models.ForeignKey(Package, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

class Invoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    date_issued = models.DateField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cgst_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sgst_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    igst_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.customer.name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    cgst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

class Quotation(models.Model):
    quotation_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    date_issued = models.DateField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Quote #{self.quotation_number} - {self.customer.name}"

class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
