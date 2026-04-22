from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        # The database state (Supabase) and Django's migration state have drifted.
        # 'phone_number' already exists in the DB, and 'gstin' is already missing.
        # We use SeparateDatabaseAndState to update Django's internal state without 
        # running the conflicting SQL commands.
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AddField(
                    model_name='customer',
                    name='phone_number',
                    field=models.CharField(blank=True, max_length=20, null=True),
                ),
                migrations.RemoveField(
                    model_name='customer',
                    name='gstin',
                ),
            ],
            database_operations=[],  # Skip SQL to avoid "already exists" / "does not exist" errors
        ),

        # Other fields that were added recently. 
        # If these also cause 'already exists' errors, we may need to move them 
        # into the state_operations list above.
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
