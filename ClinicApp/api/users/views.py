from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import CustomUser
from .serializers import (
    PatientRegistrationSerializer,
    DoctorRegistrationSerializer,
    UserSerializer,
)
from appointments.models import Doctor, Patient
from appointments.serializers import DoctorSerializer


class PatientRegisterView(generics.CreateAPIView):
    serializer_class = PatientRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        Patient.objects.create(user=user)

        return Response(
            {"message": "Patient registered successfully"},
            status=status.HTTP_201_CREATED,
        )


class DoctorRegisterView(generics.CreateAPIView):
    serializer_class = DoctorRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        specialty = serializer.validated_data.pop("specialty")
        license_number = serializer.validated_data.pop("license_number")

        user = CustomUser.objects.create_user(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            first_name=serializer.validated_data.get("first_name", ""),
            last_name=serializer.validated_data.get("last_name", ""),
            phone=serializer.validated_data.get("phone", ""),
            role="DOCTOR",
        )

        doctor = Doctor.objects.create(
            user=user,
            specialty=specialty,
            license_number=license_number,
        )

        doctor_serializer = DoctorSerializer(doctor)
        return Response(doctor_serializer.data, status=status.HTTP_201_CREATED)


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user

        try:
            doctor = Doctor.objects.get(user=user)
            user.doctor_profile = doctor.id
        except Doctor.DoesNotExist:
            pass

        return user


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            # Return the updated user data
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Log the error for debugging
            print(f"Error updating user: {str(e)}")
            return Response(
                {"detail": "Error updating profile", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
