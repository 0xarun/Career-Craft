from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify

class CustomUser(AbstractUser):
    interests = models.JSONField(default=list)
    preferences = models.JSONField(default=dict)
    xp = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    onboarding_complete = models.BooleanField(default=False)
    selected_career_paths = models.JSONField(default=list)
    
    # Add related_name to fix reverse accessor clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    def __str__(self):
        return self.email

class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)
    emoji = models.CharField(max_length=5, blank=True, null=True)

    def __str__(self):
        return self.name

class CareerTrack(models.Model):
    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=100, unique=True)
    emoji = models.CharField(max_length=5, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    avg_salary = models.CharField(max_length=50, blank=True, null=True)
    relevant_interests = models.ManyToManyField(Interest, related_name='career_tracks')
    roadmap = models.JSONField(default=list)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Quiz(models.Model):
    career = models.ForeignKey(CareerTrack, on_delete=models.CASCADE, related_name='quizzes')
    day = models.PositiveIntegerField()
    
    class Meta:
        unique_together = ('career', 'day')
    
    def __str__(self):
        return f"{self.career.title} - Day {self.day}"

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    options = models.JSONField()  # List of {text, is_correct}
    
    def __str__(self):
        return f"Q: {self.text[:50]}..."

class Progress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='progress')
    career = models.ForeignKey(CareerTrack, on_delete=models.CASCADE, related_name='progress')
    xp = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    days_completed = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    last_attempt = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'career')
    
    def __str__(self):
        return f"{self.user.username} - {self.career.title} Progress"

class OnboardingQuestion(models.Model):
    text = models.TextField()
    type = models.CharField(max_length=20)  # yes_no, multi_choice, scale_1_5
    options = models.JSONField(null=True, blank=True)  # For multi_choice questions
    tags = models.JSONField(default=list)  # List of associated skill tags

    def __str__(self):
        return self.text

class UserAnswer(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(OnboardingQuestion, on_delete=models.CASCADE)
    answer = models.JSONField()  # Can store different types of answers
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'question')  # One answer per question per user

    def __str__(self):
        return f"{self.user.email} - {self.question.text}"

class LearningPage(models.Model):
    career_track = models.ForeignKey(CareerTrack, on_delete=models.CASCADE, related_name='learning_pages')
    page_number = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['page_number']

    def __str__(self):
        return f"{self.career_track.title} - Page {self.page_number}"

class PageSection(models.Model):
    SECTION_TYPES = [
        ('overview', 'Overview'),
        ('scope', 'Scope and Impact'),
        ('opportunities', 'Opportunities'),
        ('skills', 'Skills Required'),
        ('knowledge', 'Knowledge Areas')
    ]

    learning_page = models.ForeignKey(LearningPage, on_delete=models.CASCADE, related_name='sections')
    section_type = models.CharField(max_length=50, choices=SECTION_TYPES)
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('learning_page', 'section_type')
        ordering = ['order']

    def __str__(self):
        return f"{self.learning_page} - {self.get_section_type_display()}"

class PhaseTwoFunFact(models.Model):
    learning_page = models.ForeignKey(LearningPage, on_delete=models.CASCADE, related_name='fun_facts')
    title = models.CharField(max_length=200)
    fact_text = models.TextField()
    takeaway = models.TextField()

    def __str__(self):
        return f"{self.learning_page.career_track.title} - Page {self.learning_page.page_number} - Fun Fact: {self.title}"

class PhaseTwoDayInLife(models.Model):
    learning_page = models.OneToOneField(LearningPage, on_delete=models.CASCADE, related_name='day_in_life')
    narrative = models.JSONField(default=dict)  # Store time-based narrative as JSON

    def __str__(self):
        return f"{self.learning_page.career_track.title} - Page {self.learning_page.page_number} - Day in Life"

class PhaseTwoScenario(models.Model):
    learning_page = models.ForeignKey(LearningPage, on_delete=models.CASCADE, related_name='scenarios')
    question = models.TextField()
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    option_c = models.CharField(max_length=200)
    correct_option = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C')])
    explanation = models.TextField()

    def __str__(self):
        return f"{self.learning_page.career_track.title} - Page {self.learning_page.page_number} - Scenario: {self.question[:50]}..."

class PhaseTwoReflection(models.Model):
    learning_page = models.ForeignKey(LearningPage, on_delete=models.CASCADE, related_name='reflections')
    question_text = models.TextField()
    option_1 = models.CharField(max_length=200)
    option_2 = models.CharField(max_length=200)
    option_3 = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.learning_page.career_track.title} - Page {self.learning_page.page_number} - Reflection" 