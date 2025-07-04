from django.urls import path
from .views import (
    TaskCreateView,
    TaskListView,
    TaskDetailView,
    TaskCompleteView,
    TaskInCompleteView,
)

urlpatterns = [
    path("create/", TaskCreateView.as_view(), name="task-create"),
    path("list/", TaskListView.as_view(), name="task-list"),
    path("<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
    path("<int:pk>/complete/", TaskCompleteView.as_view(), name="task-complete"),
    path("<int:pk>/incomplete/", TaskInCompleteView.as_view(), name="task-incomplete"),
]
