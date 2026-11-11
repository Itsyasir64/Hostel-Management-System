from django.db import migrations


def seed_beds(apps, schema_editor):
    Room = apps.get_model("rooms", "Room")
    Bed = apps.get_model("rooms", "Bed")
    for room in Room.objects.all():
        for bed_number in ("B1", "B2"):
            Bed.objects.get_or_create(room=room, bed_number=bed_number, defaults={"status": "available"})


def remove_seeded_beds(apps, schema_editor):
    Bed = apps.get_model("rooms", "Bed")
    Bed.objects.filter(bed_number__in=("B1", "B2")).delete()


class Migration(migrations.Migration):
    dependencies = [("rooms", "0001_initial")]
    operations = [migrations.RunPython(seed_beds, remove_seeded_beds)]
