from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, Interest, CareerTrack, 
    Quiz, Question, Progress, LearningPage, PageSection,
    PhaseTwoFunFact, PhaseTwoDayInLife, PhaseTwoScenario, PhaseTwoReflection
)
from django import forms

# Register your models here.

class ProgressInline(admin.TabularInline):
    model = Progress
    extra = 0 # Don't show extra blank forms
    fields = ['career', 'xp', 'streak', 'days_completed', 'completed']
    readonly_fields = ['career', 'xp', 'streak', 'days_completed', 'completed'] # Make fields read-only if you don't want to edit progress here

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'onboarding_complete', 'is_staff']
    fieldsets = UserAdmin.fieldsets + ( # Add custom fields to admin
        (None, {'fields': ('interests', 'preferences', 'xp', 'streak', 'onboarding_complete')}),
    )
    inlines = [ProgressInline] # Add the ProgressInline here

class PageSectionInline(admin.TabularInline):
    model = PageSection
    extra = 0  # Don't show extra forms by default
    fields = ['section_type', 'content', 'order']
    ordering = ['order']
    max_num = 5  # Maximum number of sections allowed

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        if obj is None:  # Only for new learning pages
            formset.form.base_fields['section_type'].widget = forms.HiddenInput()
        return formset

class LearningPageInline(admin.TabularInline):
    model = LearningPage
    extra = 0
    fields = ['page_number', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    show_change_link = True

class PhaseTwoFunFactInline(admin.TabularInline):
    model = PhaseTwoFunFact
    extra = 2
    fields = ['title', 'fact_text', 'takeaway']

class PhaseTwoDayInLifeInline(admin.StackedInline):
    model = PhaseTwoDayInLife
    extra = 1
    fields = ['narrative']

class PhaseTwoScenarioInline(admin.TabularInline):
    model = PhaseTwoScenario
    extra = 2
    fields = ['question', 'option_a', 'option_b', 'option_c', 'correct_option', 'explanation']

class PhaseTwoReflectionInline(admin.StackedInline):
    model = PhaseTwoReflection
    extra = 1
    fields = ['question_text', 'option_1', 'option_2', 'option_3']

class CareerTrackAdmin(admin.ModelAdmin):
    list_display = ['title', 'emoji', 'avg_salary']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [
        LearningPageInline,
    ]

class LearningPageAdmin(admin.ModelAdmin):
    list_display = ['career_track', 'page_number', 'created_at', 'updated_at']
    list_filter = ['career_track', 'page_number']
    search_fields = ['career_track__title']
    inlines = [
        PageSectionInline,
        PhaseTwoFunFactInline,
        PhaseTwoDayInLifeInline,
        PhaseTwoScenarioInline,
        PhaseTwoReflectionInline,
    ]
    raw_id_fields = ['career_track']
    autocomplete_fields = ['career_track']

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['career_track'].required = True
        return form

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            if not change:  # Only for new learning pages
                # Set default content if empty
                if not instance.content:
                    instance.content = 'Coming soon...'
            instance.save()
        formset.save_m2m()

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # Only create default sections if this is a new learning page
        if not change and not obj.sections.exists():
            sections = [
                ('overview', 'Overview'),
                ('scope', 'Scope and Impact'),
                ('opportunities', 'Opportunities'),
                ('skills', 'Skills Required'),
                ('knowledge', 'Knowledge Areas')
            ]
            for order, (section_type, _) in enumerate(sections):
                PageSection.objects.create(
                    learning_page=obj,
                    section_type=section_type,
                    content='Coming soon...',
                    order=order
                )

# Register models in the correct order
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Interest)
admin.site.register(CareerTrack, CareerTrackAdmin)
admin.site.register(LearningPage, LearningPageAdmin)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Progress)
