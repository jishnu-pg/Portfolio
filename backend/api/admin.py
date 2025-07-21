from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Project, Blog, Skill, Experience, Testimonial, ContactSubmission, Resume

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'tech_stack', 'featured', 'order', 'created_at', 'image_preview']
    list_filter = ['featured', 'created_at', 'tech_stack']
    search_fields = ['title', 'description', 'tech_stack']
    list_editable = ['featured', 'order']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'image')
        }),
        ('Technical Details', {
            'fields': ('tech_stack', 'github_link', 'live_demo_link')
        }),
        ('Display Options', {
            'fields': ('featured', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Image'

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'published', 'featured', 'created_at', 'image_preview']
    list_filter = ['published', 'featured', 'created_at']
    search_fields = ['title', 'content', 'excerpt']
    list_editable = ['published', 'featured']
    readonly_fields = ['created_at', 'updated_at']
    prepopulated_fields = {'excerpt': ('title',)}
    fieldsets = (
        ('Content', {
            'fields': ('title', 'content', 'excerpt', 'image')
        }),
        ('Publication', {
            'fields': ('published', 'featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 50px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Image'

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'order', 'icon_display']
    list_filter = ['category', 'proficiency']
    search_fields = ['name']
    list_editable = ['proficiency', 'order']
    fieldsets = (
        ('Skill Information', {
            'fields': ('name', 'category', 'proficiency', 'icon')
        }),
        ('Display', {
            'fields': ('order',)
        }),
    )

    def icon_display(self, obj):
        if obj.icon:
            return format_html('<span style="font-size: 20px;">{}</span>', obj.icon)
        return "No icon"
    icon_display.short_description = 'Icon'

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'location', 'start_date', 'end_date', 'current', 'order']
    list_filter = ['current', 'start_date', 'company']
    search_fields = ['title', 'company', 'description', 'technologies']
    list_editable = ['current', 'order']
    readonly_fields = ['duration_display']
    fieldsets = (
        ('Position Details', {
            'fields': ('title', 'company', 'location')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'current', 'duration_display')
        }),
        ('Content', {
            'fields': ('description', 'technologies')
        }),
        ('Display', {
            'fields': ('order',)
        }),
    )

    def duration_display(self, obj):
        if obj.current:
            return f"{obj.start_date} - Present"
        elif obj.end_date:
            return f"{obj.start_date} - {obj.end_date}"
        return f"{obj.start_date} - No end date"
    duration_display.short_description = 'Duration'

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'rating', 'featured', 'order', 'created_at']
    list_filter = ['rating', 'featured', 'created_at']
    search_fields = ['name', 'company', 'content']
    list_editable = ['rating', 'featured', 'order']
    readonly_fields = ['created_at']
    fieldsets = (
        ('Person Information', {
            'fields': ('name', 'position', 'company')
        }),
        ('Testimonial', {
            'fields': ('content', 'rating')
        }),
        ('Display', {
            'fields': ('featured', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'read', 'responded', 'submitted_at']
    list_filter = ['read', 'responded', 'submitted_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['read', 'responded']
    readonly_fields = ['submitted_at']
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('read', 'responded')
        }),
        ('Timestamps', {
            'fields': ('submitted_at',),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        return False  # Contact submissions should only come from the frontend

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['title', 'version', 'is_active', 'file_preview', 'file_size', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description', 'version']
    list_editable = ['is_active']
    readonly_fields = ['created_at', 'updated_at', 'file_size_display']
    fieldsets = (
        ('Resume Information', {
            'fields': ('title', 'description', 'version')
        }),
        ('File Upload', {
            'fields': ('file', 'file_size_display')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def file_preview(self, obj):
        if obj.file:
            filename = obj.file.name.split('/')[-1]
            return format_html(
                '<a href="{}" target="_blank" style="color: #007cba;">📄 {}</a>',
                obj.file.url, filename
            )
        return "No file"
    file_preview.short_description = 'File'

    def file_size(self, obj):
        return obj.get_file_size()
    file_size.short_description = 'Size'

    def file_size_display(self, obj):
        return obj.get_file_size()
    file_size_display.short_description = 'File Size'

    def save_model(self, request, obj, form, change):
        # If this resume is being set as active, deactivate all others
        if obj.is_active:
            Resume.objects.exclude(pk=obj.pk).update(is_active=False)
        super().save_model(request, obj, form, change)

# Customize admin site
admin.site.site_header = "Jishnu Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Welcome to Jishnu's Portfolio Administration"
