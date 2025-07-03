from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, InterestViewSet, CareerTrackViewSet,
    QuizViewSet, QuestionViewSet,
    ProgressViewSet, OnboardingQuestionViewSet, UserAnswerViewSet
)
from rest_framework.authtoken.views import obtain_auth_token
from django.views.decorators.csrf import csrf_exempt

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'interests', InterestViewSet, basename='interest')
router.register(r'career-tracks', CareerTrackViewSet, basename='career-track')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'progress', ProgressViewSet, basename='progress')
router.register(r'onboarding-questions', OnboardingQuestionViewSet, basename='onboarding-question')
router.register(r'onboarding-answers', UserAnswerViewSet, basename='onboarding-answer')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('auth/token/', csrf_exempt(obtain_auth_token), name='api_token_auth'),
    path('users/register/', UserViewSet.as_view({'post': 'register'}), name='user-register'),
    path('users/select_career_paths/', UserViewSet.as_view({'post': 'select_career_paths'}), name='user-select-career-paths'),
] 