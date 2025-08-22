from rest_framework import serializers
from .models import Doctor, Schedule, Appointment, Notification
from users.models import CustomUser
from django.utils import timezone


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ["id", "specialty", "license_number", "user"]
        depth = 1  # To include schedule details


class ScheduleSerializer(serializers.ModelSerializer):
    start_time = serializers.TimeField(
        format="%H:%M:%S", input_formats=["%H:%M", "%H:%M:%S"]
    )
    end_time = serializers.TimeField(
        format="%H:%M:%S", input_formats=["%H:%M", "%H:%M:%S"]
    )

    class Meta:
        model = Schedule
        fields = "__all__"
        read_only_fields = ["is_available", "doctor"]

    def validate(self, data):
        if data["start_time"] >= data["end_time"]:
            raise serializers.ValidationError("Start time must be before end time")
        return data


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "schedule",
            "status",
            "created_at",
            "doctor_name",
            "patient_name",
        ]
        read_only_fields = ["created_at", "patient"]
        depth = 1

    def get_doctor_name(self, obj):
        try:
            return f"{obj.schedule.doctor.user.first_name} {obj.schedule.doctor.user.last_name}"
        except AttributeError:
            return "N/A"

    def get_patient_name(self, obj):
        try:
            return f"{obj.patient.user.first_name} {obj.patient.user.last_name}"
        except AttributeError:
            return "N/A"

    def validate(self, data):
        if self.instance is None:
            schedule = data.get("schedule")
            if not schedule.is_available:
                raise serializers.ValidationError(
                    "This time slot is no longer available"
                )

            if Appointment.objects.filter(schedule=schedule).exists():
                raise serializers.ValidationError("This slot is already booked")

        return data


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "message",
            "notification_type",
            "appointment",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
