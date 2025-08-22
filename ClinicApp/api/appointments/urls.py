from django.urls import path
from .views import (
    ScheduleCreateView,
    DoctorAvailabilityView,
    AppointmentCreateView,
    DoctorsBySpecialtyView,
    AppointmentListView,
    AppointmentUpdateView,
    DoctorDetailView,
    DoctorByUserView,
    DoctorUpdateView,
    ScheduleDeleteView,
    CurrentDoctorView,
    NotificationListView,
    NotificationUpdateView,
)


urlpatterns = [
    path("schedules/", ScheduleCreateView.as_view(), name="schedule-list"),
    path(
        "doctors/availability/<int:doctor_id>/",
        DoctorAvailabilityView.as_view(),
        name="doctor-availability",
    ),
    path(
        "appointments/create/",
        AppointmentCreateView.as_view(),
        name="appointment-create",
    ),
    path(
        "doctors/by-specialty/",
        DoctorsBySpecialtyView.as_view(),
        name="doctors-by-specialty",
    ),
    path("appointments/", AppointmentListView.as_view(), name="appointment-list"),
    path(
        "appointments/<int:pk>/",
        AppointmentUpdateView.as_view(),
        name="appointment-detail",
    ),
    path("doctors/<int:pk>/", DoctorDetailView.as_view(), name="doctor-detail"),
    path("doctors/by-user/", DoctorByUserView.as_view(), name="doctor-by-user"),
    path("doctors/me/update/", DoctorUpdateView.as_view(), name="doctor-update"),
    path("schedules/<int:pk>/", ScheduleDeleteView.as_view(), name="schedule-delete"),
    path("doctors/me/", CurrentDoctorView.as_view(), name="current-doctor"),
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path(
        "notifications/<int:pk>/",
        NotificationUpdateView.as_view(),
        name="notification-detail",
    ),
]
