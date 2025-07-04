from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Task(models.Model):
    class PriorityChoices(models.TextChoices):
        HIGH = "high", "High"
        MEDIUM = "medium", "Medium"
        LOW = "low", "Low"

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField(db_index=True)
    priority = models.CharField(
        max_length=10, choices=PriorityChoices.choices, default=PriorityChoices.MEDIUM
    )
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")

    def __str__(self):
        return self.title

    def mark_as_completed(self):
        if not self.completed:
            self.completed = True
            self.save()
        return self

    def mark_as_incomplete(self):
        if self.completed:
            self.completed = False
            self.save()
        return self
