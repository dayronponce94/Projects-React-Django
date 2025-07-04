from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "priority",
            "completed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "completed", "created_at", "updated_at"]
