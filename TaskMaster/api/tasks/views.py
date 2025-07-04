from rest_framework import generics, permissions, status
from .models import Task
from .serializers import TaskSerializer
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import PermissionDenied


class TaskCreateView(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        completed_param = self.request.query_params.get("completed")

        queryset = Task.objects.filter(owner=self.request.user)

        if completed_param is not None:
            completed_value = completed_param.lower() in ["true", "1", "yes"]
            queryset = queryset.filter(completed=completed_value)

        return queryset.order_by(F("due_date").asc(nulls_last=True))

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_paginated_response(self, data):
        paginator = self.paginator
        return Response(
            {
                "count": paginator.page.paginator.count,
                "total_pages": paginator.page.paginator.num_pages,
                "current_page": paginator.page.number,
                "results": data,
            }
        )


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)


class TaskCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk, owner=request.user)

            task.mark_as_completed()

            serializer = TaskSerializer(task)
            return Response(serializer.data)

        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found or you don't have permission"},
                status=status.HTTP_404_NOT_FOUND,
            )


class TaskInCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk, owner=request.user)

            task.mark_as_incomplete()

            serializer = TaskSerializer(task)
            return Response(serializer.data)

        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found or you don't have permission"},
                status=status.HTTP_404_NOT_FOUND,
            )
