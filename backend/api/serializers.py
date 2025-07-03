from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Quiz, Question, Progress, Interest, CareerTrack, 
    OnboardingQuestion, UserAnswer, PageSection, LearningPage,
    PhaseTwoFunFact, PhaseTwoDayInLife, PhaseTwoScenario, PhaseTwoReflection
)

CustomUser = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'interests', 'selected_career_paths', 'onboarding_complete', 'xp']

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = '__all__'

class PhaseTwoFunFactSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhaseTwoFunFact
        fields = ['id', 'title', 'fact_text', 'takeaway']

class PhaseTwoDayInLifeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhaseTwoDayInLife
        fields = ['id', 'narrative']

class PhaseTwoScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhaseTwoScenario
        fields = ['id', 'question', 'option_a', 'option_b', 'option_c', 'correct_option', 'explanation']

class PhaseTwoReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhaseTwoReflection
        fields = ['id', 'question_text', 'option_1', 'option_2', 'option_3']

class PageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSection
        fields = ['id', 'section_type', 'content', 'order']

class LearningPageSerializer(serializers.ModelSerializer):
    sections = PageSectionSerializer(many=True, read_only=True)
    fun_facts = PhaseTwoFunFactSerializer(many=True, read_only=True)
    day_in_life = PhaseTwoDayInLifeSerializer(read_only=True)
    scenarios = PhaseTwoScenarioSerializer(many=True, read_only=True)
    reflections = PhaseTwoReflectionSerializer(many=True, read_only=True)
    # Include career_track detail if needed, perhaps as a nested serializer or method field
    # For now, assuming frontend gets career track detail elsewhere or it's minimal here

    class Meta:
        model = LearningPage
        fields = ['id', 'page_number', 'sections', 'fun_facts', 'day_in_life', 'scenarios', 'reflections']

class CareerTrackSerializer(serializers.ModelSerializer):
    relevant_interests = InterestSerializer(many=True, read_only=True)
    # Learning pages can be fetched separately via the learning_page_viewset

    class Meta:
        model = CareerTrack
        fields = ['id', 'slug', 'title', 'emoji', 'description', 'avg_salary', 'relevant_interests']

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class ProgressSerializer(serializers.ModelSerializer):
    career = CareerTrackSerializer(read_only=True)
    career_id = serializers.PrimaryKeyRelatedField(
        queryset=CareerTrack.objects.all(),
        source='career',
        write_only=True
    )

    class Meta:
        model = Progress
        fields = ['id', 'career', 'career_id', 'xp', 'streak', 'days_completed', 'completed', 'last_attempt']

class OnboardingQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnboardingQuestion
        fields = '__all__'

class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = '__all__'

    def validate(self, data):
        question = data['question']
        answer = data['answer']

        # Validate answer based on question type
        if question.type == 'yes_no':
            if not isinstance(answer, bool):
                raise serializers.ValidationError("Answer must be a boolean for yes/no questions")
        elif question.type == 'multi_choice':
            if not isinstance(answer, str) or answer not in question.options:
                raise serializers.ValidationError("Answer must be one of the provided options")
        elif question.type == 'scale_1_5':
            if not isinstance(answer, int) or answer < 1 or answer > 5:
                raise serializers.ValidationError("Answer must be an integer between 1 and 5")

        return data 