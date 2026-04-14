import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from rest_framework.test import APIClient
from api.models import Customer, Product, Invoice

def run_tests():
    client = APIClient()

    print("--- 1. Testing Customer API ---")
    c_resp = client.post('/api/customers/', {
        'name': 'Adarsh Tech Solutions',
        'gstin': '33ABCDE1234F1Z5',
        'address': '123 Sunshine Blvd, Chennai',
        'state': 'Tamil Nadu'  # Note: Interstate since our company is in Kerala
    }, format='json')
    print("Response Status:", c_resp.status_code)
    if c_resp.status_code != 201:
        print(c_resp.data)
        sys.exit(1)
    customer_id = c_resp.data['id']
    print("Created Customer ID:", customer_id)

    print("\n--- 2. Testing Product API ---")
    p_resp = client.post('/api/products/', {
        'name': 'Luminous 330W Monocrystalline Panel',
        'description': 'High efficiency solar panel',
        'unit_price': '6500.00',
        'gst_rate': '12.00'
    }, format='json')
    print("Response Status:", p_resp.status_code)
    product_id = p_resp.data['id']
    print("Created Product ID:", product_id)

    print("\n--- 3. Testing Invoice & GST Engine ---")
    # Expected: Subtotal = 6500 * 4 = 26000. Interstate = 12% IGST = 3120. Total = 29120
    inv_resp = client.post('/api/invoices/', {
        'customer': customer_id,
        'items': [
            {
                'product': product_id,
                'quantity': 4,
                'unit_price': '6500.00'
            }
        ]
    }, format='json')
    
    print("Response Status:", inv_resp.status_code)
    if inv_resp.status_code == 201:
        data = inv_resp.data
        print(f"Invoice Number: {data['invoice_number']}")
        print(f"  --> Subtotal: Rs.{data['subtotal']}")
        print(f"  --> CGST: Rs.{data['cgst_total']}")
        print(f"  --> SGST: Rs.{data['sgst_total']}")
        print(f"  --> IGST: Rs.{data['igst_total']} (Correct! Inter-state calculated)")
        print(f"  --> Grand Total: Rs.{data['grand_total']}")
        
        invoice_id = data['id']
        print("\n--- 4. Testing PDF Generation Endpoint ---")
        pdf_resp = client.get(f'/api/invoices/{invoice_id}/download_pdf/')
        print("Response Status:", pdf_resp.status_code)
        
        if pdf_resp.status_code == 200:
            with open('sample_invoice.pdf', 'wb') as f:
                f.write(pdf_resp.content)
            print("SUCCESS! PDF file 'sample_invoice.pdf' saved successfully.")
        else:
            print("Oh no! Error generating PDF:", pdf_resp.content)
    else:
        print("Failed to create Invoice:", inv_resp.data)

if __name__ == '__main__':
    run_tests()
