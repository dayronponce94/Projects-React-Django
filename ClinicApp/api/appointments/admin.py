from django.contrib import admin
from .models import Doctor, Patient, Schedule, Appointment

admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Schedule)
admin.site.register(Appointment)
