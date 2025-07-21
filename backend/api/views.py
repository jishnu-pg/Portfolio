from django.shortcuts import render
from django.http import HttpResponse, Http404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, Blog, ContactSubmission, Skill, Experience, Testimonial, Resume
from .serializers import (
    ProjectSerializer, BlogSerializer, ContactSubmissionSerializer,
    SkillSerializer, ExperienceSerializer, TestimonialSerializer, ResumeSerializer
)

# Create your views here.

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('order', '-created_at')
    serializer_class = ProjectSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.filter(published=True).order_by('-created_at')
    serializer_class = BlogSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().order_by('category', 'order', 'name')
    serializer_class = SkillSerializer

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all().order_by('-order', '-start_date')
    serializer_class = ExperienceSerializer

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all().order_by('order', '-created_at')
    serializer_class = TestimonialSerializer

class ContactSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all().order_by('-submitted_at')
    serializer_class = ContactSubmissionSerializer

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all().order_by('-is_active', '-created_at')
    serializer_class = ResumeSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get the currently active resume"""
        try:
            active_resume = Resume.objects.filter(is_active=True).first()
            if active_resume:
                serializer = self.get_serializer(active_resume)
                return Response(serializer.data)
            else:
                return Response({'error': 'No active resume found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download a specific resume file"""
        try:
            resume = self.get_object()
            if resume.file:
                response = HttpResponse(resume.file, content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{resume.file.name.split("/")[-1]}"'
                return response
            else:
                return Response({'error': 'No file attached'}, status=status.HTTP_404_NOT_FOUND)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def download_active(self, request):
        """Download the currently active resume"""
        try:
            active_resume = Resume.objects.filter(is_active=True).first()
            if active_resume and active_resume.file:
                response = HttpResponse(active_resume.file, content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{active_resume.file.name.split("/")[-1]}"'
                return response
            else:
                return Response({'error': 'No active resume found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
