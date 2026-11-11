# Hostel Management System

A modular Django + Django REST Framework foundation for managing students, hostels, rooms, fees, complaints, visitors, and reports.

## Quick start

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
py manage.py migrate
py manage.py createsuperuser
py manage.py runserver
```

The default database is SQLite for local development. Set `DB_ENGINE=postgresql` or `DB_ENGINE=mysql` in `.env` for a production database.
