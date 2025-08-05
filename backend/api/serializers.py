from rest_framework import serializers
from django.conf import settings
from .models import Project, Blog, ContactSubmission, Skill, Experience, Testimonial, Resume

class ProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    technologies = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request and hasattr(request, 'build_absolute_uri'):
                try:
                    return request.build_absolute_uri(obj.image.url)
                except:
                    pass
            return f"http://127.0.0.1:8000{settings.MEDIA_URL}{obj.image}"
        return None

    def get_technologies(self, obj):
        if obj.tech_stack:
            return [tech.strip() for tech in obj.tech_stack.split(',') if tech.strip()]
        return []

    def to_internal_value(self, data):
        # Make a mutable copy
        data = data.copy()
        technologies = data.get('technologies')
        if technologies:
            if isinstance(technologies, str):
                import json
                try:
                    technologies = json.loads(technologies)
                except Exception:
                    technologies = [t.strip() for t in technologies.split(',') if t.strip()]
            if isinstance(technologies, list):
                data['tech_stack'] = ', '.join(technologies)
        return super().to_internal_value(data)

class BlogSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Blog
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request and hasattr(request, 'build_absolute_uri'):
                try:
                    return request.build_absolute_uri(obj.image.url)
                except:
                    pass
            return f"http://127.0.0.1:8000{settings.MEDIA_URL}{obj.image}"
        return None

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Testimonial
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request and hasattr(request, 'build_absolute_uri'):
                try:
                    return request.build_absolute_uri(obj.image.url)
                except:
                    pass
            return f"http://127.0.0.1:8000{settings.MEDIA_URL}{obj.image}"
        return None

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_extension = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    
    class Meta:
        model = Resume
        fields = '__all__'
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request and hasattr(request, 'build_absolute_uri'):
                try:
                    return request.build_absolute_uri(obj.file.url)
                except:
                    pass
            return f"http://127.0.0.1:8000{settings.MEDIA_URL}{obj.file}"
        return None
    
    def get_file_extension(self, obj):
        return obj.get_file_extension()
    
    def get_file_size(self, obj):
        return obj.get_file_size() 