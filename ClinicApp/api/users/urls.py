from django.urls import path
from .views import (
    PatientRegisterView,
    DoctorRegisterView,
    CurrentUserView,
    UserUpdateView,
)

urlpatterns = [
    path("register/patient/", PatientRegisterView.as_view(), name="register-patient"),
    path("register/doctor/", DoctorRegisterView.as_view(), name="register-doctor"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("me/update/", UserUpdateView.as_view(), name="update-user"),
]
