from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "phone", "role"]
        read_only_fields = ["id", "role"]


class PatientRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(default="PATIENT")

    class Meta:
        model = CustomUser
        fields = ["email", "password", "first_name", "last_name", "phone", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        role = validated_data.pop("role", "PATIENT")
        user = CustomUser.objects.create_user(
            role=role,
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            phone=validated_data.get("phone", ""),
        )
        return user


class DoctorRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    specialty = serializers.CharField(write_only=True)
    license_number = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
            "specialty",
            "license_number",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        return attrs
