from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        # Adding phone_number first
        migrations.AddField(
            model_name='customer',
            name='phone_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        
        # We suspect 'gstin' might already be removed from the database manually.
        # If the migration fails here, we will need to handle it.
        migrations.RemoveField(
            model_name='customer',
            name='gstin',
        ),

        # Quotation changes
        migrations.AddField(
            model_name='quotation',
            name='cgst_total',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='quotation',
            name='igst_total',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='quotation',
            name='sgst_total',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='date_issued',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='quotation',
            name='date_issued',
            field=models.DateTimeField(auto_now_add=True),
        ),
        
        # QuotationItem changes
        migrations.AddField(
            model_name='quotationitem',
            name='cgst',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='quotationitem',
            name='igst',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='quotationitem',
            name='sgst',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
    ]
