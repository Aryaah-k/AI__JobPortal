from django.db import migrations
from django.contrib.auth import get_user_model

def create_demo_user(apps, schema_editor):
    User = get_user_model()
    if not User.objects.filter(username="demo").exists():
        User.objects.create_user(
            username="demo",
            email="demo@example.com",
            password="SuperSecret123",
            role="candidate",
        )

def delete_demo_user(apps, schema_editor):
    User = get_user_model()
    User.objects.filter(username="demo").delete()

class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(create_demo_user, delete_demo_user),
    ]
