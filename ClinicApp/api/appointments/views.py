from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.db.models import Q
from .models import Doctor, Schedule, Appointment, Patient, Notification
from .serializers import (
    DoctorSerializer,
    ScheduleSerializer,
    AppointmentSerializer,
    NotificationSerializer,
)
from users.models import CustomUser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date


# View for doctors to define their schedules
class ScheduleCreateView(generics.ListCreateAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Doctors only see their schedules
        if self.request.user.role == "DOCTOR":
            doctor = Doctor.objects.get(user=self.request.user)
            return Schedule.objects.filter(doctor=doctor)
        # Admin sees all schedules
        return Schedule.objects.all()

    def perform_create(self, serializer):
        # For doctors, automatically assign your profile
        if self.request.user.role == "DOCTOR":
            doctor = Doctor.objects.get(user=self.request.user)
            serializer.save(doctor=doctor, is_available=True)
        else:
            # For admin, requires Doctors in data
            if "doctor" not in serializer.validated_data:
                raise ValidationError("Doctor is required for admin users")
            serializer.save(is_available=True)


# View for doctor availability
class DoctorAvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, doctor_id):
        date = request.query_params.get("date", timezone.now().date())

        schedules = Schedule.objects.filter(
            doctor_id=doctor_id, date=date, is_available=True
        ).order_by("start_time")

        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)


# View to create appointments
class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        schedule_id = request.data.get("schedule")
        if not schedule_id:
            return Response(
                {"detail": "Schedule ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            schedule = Schedule.objects.get(id=schedule_id)
        except Schedule.DoesNotExist:
            return Response(
                {"detail": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if not schedule.is_available:
            return Response(
                {"detail": "This time slot is no longer available"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.user.role != "PATIENT":
            return Response(
                {"detail": "Only patients can book appointments"},
                status=status.HTTP_403_FORBIDDEN,
            )

        patient, created = Patient.objects.get_or_create(user=request.user)

        if created:
            pass

        appointment = Appointment.objects.create(
            patient=patient, schedule=schedule, status="PENDING"
        )

        # Create notification for patient
        Notification.objects.create(
            user=request.user,
            message=f"Your appointment with Dr. {appointment.schedule.doctor.user.first_name} {appointment.schedule.doctor.user.last_name} on {schedule.date} at {schedule.start_time} has been booked.",
            notification_type="APPOINTMENT_BOOKED",
            appointment=appointment,
        )

        # Create notification for doctor
        Notification.objects.create(
            user=schedule.doctor.user,
            message=f"New appointment booked by {appointment.patient.user.first_name} {appointment.patient.user.last_name} on {schedule.date} at {schedule.start_time}.",
            notification_type="APPOINTMENT_BOOKED",
            appointment=appointment,
        )

        schedule.is_available = False
        schedule.save()

        serializer = self.get_serializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# View to list doctors by specialty
class DoctorsBySpecialtyView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        specialty = request.query_params.get("specialty", "")
        doctors = Doctor.objects.filter(specialty__icontains=specialty)
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)


# Appointment management view (patients/doctors)
class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Optimize queries with select_related
        queryset = Appointment.objects.select_related(
            "patient__user", "schedule__doctor__user"
        )

        if user.role == "PATIENT":
            patient = Patient.objects.filter(user=user).first()
            if patient:
                queryset = queryset.filter(patient=patient)
            else:
                queryset = queryset.none()

        elif user.role == "DOCTOR":
            doctor = Doctor.objects.filter(user=user).first()
            if doctor:
                queryset = queryset.filter(schedule__doctor=doctor)
            else:
                queryset = queryset.none()

            date_str = self.request.query_params.get("date")
            if date_str:
                date = parse_date(date_str)
                if date:
                    queryset = queryset.filter(schedule__date=date)

        elif user.role == "ADMIN":
            queryset
            pass
        else:
            queryset = queryset.none()

        return queryset


# View to update appointment status
class AppointmentUpdateView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch"]

    def get_serializer(self, *args, **kwargs):
        # Allow partial updates
        kwargs["partial"] = True
        return super().get_serializer(*args, **kwargs)

    def perform_update(self, serializer):
        appointment = self.get_object()
        old_status = appointment.status
        new_status = serializer.validated_data.get("status", appointment.status)

        # Handle state changes
        if new_status == "CANCELLED":
            # Free up your schedule when an appointment is canceled
            schedule = appointment.schedule
            schedule.is_available = True
            schedule.save()

            # Update status only
            appointment.status = "CANCELLED"
            appointment.save()

            # Create notifications for cancellation
            Notification.objects.create(
                user=appointment.patient.user,
                message=f"Your appointment with Dr. {appointment.schedule.doctor.user.first_name} {appointment.schedule.doctor.user.last_name} on {appointment.schedule.date} at {appointment.schedule.start_time} has been cancelled.",
                notification_type="APPOINTMENT_CANCELLED",
                appointment=appointment,
            )
            Notification.objects.create(
                user=appointment.schedule.doctor.user,
                message=f"Appointment with {appointment.patient.user.first_name} {appointment.patient.user.last_name} on {appointment.schedule.date} at {appointment.schedule.start_time} has been cancelled.",
                notification_type="APPOINTMENT_CANCELLED",
                appointment=appointment,
            )
            return

        elif new_status == "CONFIRMED" and old_status != "CONFIRMED":
            # Only create notification if the status is changing to CONFIRMED
            serializer.save()

            # Create notification for confirmation
            Notification.objects.create(
                user=appointment.patient.user,
                message=f"Your appointment with Dr. {appointment.schedule.doctor.user.first_name} {appointment.schedule.doctor.user.last_name} on {appointment.schedule.date} at {appointment.schedule.start_time} has been confirmed.",
                notification_type="APPOINTMENT_CONFIRMED",
                appointment=appointment,
            )

        else:
            # For other status changes, just save
            serializer.save()

        # Note: We don't create notifications for other status changes unless needed.


class DoctorDetailView(generics.RetrieveDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.AllowAny]

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        user.delete()


class DoctorByUserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get("user")
        if not user_id:
            return Response(
                {"error": "User ID parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            doctor = Doctor.objects.get(user_id=user_id)
            serializer = DoctorSerializer(doctor)
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND
            )


class DoctorUpdateView(generics.UpdateAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Doctor, user=self.request.user)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            # Return the updated doctor data
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Log the error for debugging
            print(f"Error updating doctor: {str(e)}")
            return Response(
                {"detail": "Error updating doctor profile", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ScheduleDeleteView(generics.DestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == "DOCTOR":
            doctor = Doctor.objects.get(user=self.request.user)
            return Schedule.objects.filter(doctor=doctor)
        return Schedule.objects.all()


class CurrentDoctorView(generics.RetrieveAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Doctor.objects.get(user=self.request.user)


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationUpdateView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Notification.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_read = True
        instance.save()
        return Response(self.get_serializer(instance).data)
