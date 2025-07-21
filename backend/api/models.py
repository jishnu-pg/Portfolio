from django.db import models

# Create your models here.

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    tech_stack = models.CharField(max_length=300, blank=True, help_text="Comma-separated list of technologies")
    github_link = models.URLField(blank=True, null=True)
    live_demo_link = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False, help_text="Mark as featured project")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    excerpt = models.TextField(max_length=300, blank=True, help_text="Short summary for preview")
    image = models.ImageField(upload_to='blogs/', blank=True, null=True)
    published = models.BooleanField(default=False, help_text="Publish this blog post")
    featured = models.BooleanField(default=False, help_text="Mark as featured post")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('database', 'Database'),
        ('devops', 'DevOps'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.IntegerField(choices=[(i, f'{i}%') for i in range(0, 101, 10)], default=80)
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class or emoji")
    
    class Meta:
        ordering = ['category', 'order', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class Experience(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True, help_text="Leave empty if current position")
    current = models.BooleanField(default=False, help_text="Mark as current position")
    description = models.TextField()
    technologies = models.CharField(max_length=300, blank=True, help_text="Technologies used")
    order = models.IntegerField(default=0, help_text="Display order (most recent first)")
    
    class Meta:
        ordering = ['-order', '-start_date']
    
    def __str__(self):
        return f"{self.title} at {self.company}"

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=200, blank=True)
    company = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    rating = models.IntegerField(choices=[(i, f'{i} stars') for i in range(1, 6)], default=5)
    featured = models.BooleanField(default=False, help_text="Mark as featured testimonial")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.company}"

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    read = models.BooleanField(default=False, help_text="Mark as read")
    responded = models.BooleanField(default=False, help_text="Mark as responded")
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"

class Resume(models.Model):
    title = models.CharField(max_length=200, default="Resume")
    description = models.TextField(blank=True, help_text="Brief description of the resume")
    file = models.FileField(upload_to='resumes/', help_text="Upload PDF, DOC, or DOCX file")
    is_active = models.BooleanField(default=True, help_text="Mark as active resume for download")
    version = models.CharField(max_length=20, blank=True, help_text="Version number or date")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_active', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.version}"

    def get_file_extension(self):
        """Get the file extension for display purposes"""
        if self.file:
            return self.file.name.split('.')[-1].upper()
        return ''

    def get_file_size(self):
        """Get file size in human readable format"""
        if self.file:
            size = self.file.size
            for unit in ['B', 'KB', 'MB', 'GB']:
                if size < 1024.0:
                    return f"{size:.1f} {unit}"
                size /= 1024.0
        return '0 B'
