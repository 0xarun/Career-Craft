from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Quiz, Question, Progress, Interest, CareerTrack, OnboardingQuestion, UserAnswer, LearningPage, PageSection
from .serializers import (
    UserSerializer, QuizSerializer,
    ProgressSerializer, UserRegistrationSerializer, InterestSerializer, CareerTrackSerializer,
    OnboardingQuestionSerializer, UserAnswerSerializer, QuestionSerializer,
    LearningPageSerializer, PageSectionSerializer
)
from django.db.models import Count
from rest_framework.authtoken.models import Token

CustomUser = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only see their own data
        if self.request.user.is_authenticated:
            return CustomUser.objects.filter(id=self.request.user.id)
        # Allow access to the empty queryset for unauthenticated users
        # This prevents accidental data leakage while still allowing the register action
        return CustomUser.objects.none()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        # Returns the currently authenticated user's data
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_interests(self, request):
        user = self.request.user
        interests = request.data.get('interests')
        if interests is not None and isinstance(interests, list):
            user.interests = interests
            # Set onboarding_complete to True after interests are updated
            user.onboarding_complete = True
            user.save()
            # Return updated user data with onboarding_complete status
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid interests data'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_preferences(self, request):
        user = self.request.user
        preferences = request.data.get('preferences')
        if preferences is not None and isinstance(preferences, dict):
            user.preferences = preferences
            user.save()
            # Return updated user data with onboarding_complete status
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid preferences data'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def recommendations(self, request):
        user = request.user
        user_interests_names = user.interests # Assuming interests are stored as a list of names in user.interests JSONField

        if not user_interests_names:
            # This case should ideally be handled by frontend navigation, but as a fallback:
            return Response({'error': 'User has not selected interests.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get interest objects based on user's saved interest names
        matching_interests = Interest.objects.filter(name__in=user_interests_names)

        # Calculate overlap with career tracks
        career_track_scores = []
        for track in CareerTrack.objects.all():
            # Calculate overlap based on matching interest objects
            overlap = track.relevant_interests.filter(id__in=matching_interests.values_list('id', flat=True)).count()
            if overlap > 0:
                career_track_scores.append({
                    'track': track,
                    'score': overlap
                })

        # Sort by score in descending order and return all relevant tracks
        sorted_tracks = sorted(career_track_scores, key=lambda x: x['score'], reverse=True)
        recommended_tracks = [item['track'] for item in sorted_tracks]

        serializer = CareerTrackSerializer(recommended_tracks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def select_career_paths(self, request):
        user = request.user
        career_track_ids = request.data.get('career_track_ids')

        if not isinstance(career_track_ids, list):
            return Response({'error': 'Invalid data format. Expected a list of career track IDs.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(career_track_ids) > 4:
             return Response({'error': 'You can select a maximum of 4 career paths.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate if the provided IDs correspond to existing CareerTracks
        valid_tracks_count = CareerTrack.objects.filter(id__in=career_track_ids).count()
        if valid_tracks_count != len(career_track_ids):
             return Response({'error': 'One or more provided career track IDs are invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's selected career paths
        user.selected_career_paths = career_track_ids
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    # Note: You might want to adjust permissions for retrieving quizzes if they are public

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_answer(self, request, pk=None):
        quiz = self.get_object()
        answer_text = request.data.get('answer') # Changed from 'answer' to 'answer_text' to match frontend potential payload structure if needed

        if not answer_text:
            return Response(
                {'error': 'Answer is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # TODO: Implement logic to check the answer and update user's XP/streak/progress
        user = request.user
        # For now, just simulate earning XP
        xp_earned = 10
        user.xp += xp_earned
        user.streak += 1 # Basic streak increment, needs proper logic
        user.save()

        # TODO: Update Progress model for the user and the relevant career path/day
        # Example (simplified): Find or create progress for this user/career and increment days_completed, update XP
        # progress_obj, created = Progress.objects.get_or_create(user=user, career=quiz.career)
        # progress_obj.days_completed += 1
        # progress_obj.xp += xp_earned
        # progress_obj.save()

        return Response({
            'message': 'Answer submitted successfully (dummy logic)',
            'xp_gained': xp_earned,
            'current_xp': user.xp,
            'current_streak': user.streak,
            # 'days_completed': progress_obj.days_completed # if implementing progress update
        })

class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only see their own progress
        return Progress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Ensure progress is linked to the authenticated user
        serializer.save(user=self.request.user)

    # You might want an action to update progress after a challenge
    # @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    # def update_progress(self, request, pk=None):
    #     progress_instance = self.get_object()
    #     # Implement logic to update progress based on challenge completion
    #     return Response({'status': 'progress updated'})

class InterestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [permissions.AllowAny]

class CareerTrackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CareerTrack.objects.all()
    serializer_class = CareerTrackSerializer
    permission_classes = [permissions.AllowAny]  # Make it publicly accessible
    lookup_field = 'slug'

    def get_object(self):
        # Check if we're looking up by ID
        if 'pk' in self.kwargs and self.kwargs['pk'].isdigit():
            return CareerTrack.objects.get(id=self.kwargs['pk'])
        # Otherwise use the default slug lookup
        return super().get_object()

    @action(detail=True, methods=['get'])
    def learning_pages(self, request, slug=None):
        career_track = self.get_object()
        learning_pages = career_track.learning_pages.all()
        serializer = LearningPageSerializer(learning_pages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def learning_page(self, request, slug=None):
        page_number = request.query_params.get('page', 1)
        try:
            page_number = int(page_number)
        except ValueError:
            return Response(
                {'error': 'Invalid page number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        career_track = self.get_object()
        try:
            learning_page = career_track.learning_pages.get(page_number=page_number)
            serializer = LearningPageSerializer(learning_page)
            return Response(serializer.data)
        except LearningPage.DoesNotExist:
            return Response(
                {'error': f'Page {page_number} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def recommendations(self, request):
        user = request.user
        user_interests_names = user.interests # Assuming interests are stored as a list of names in user.interests JSONField

        if not user_interests_names:
            # This case should ideally be handled by frontend navigation, but as a fallback:
            return Response({'error': 'User has not selected interests.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get interest objects based on user's saved interest names
        matching_interests = Interest.objects.filter(name__in=user_interests_names)

        # Calculate overlap with career tracks
        career_track_scores = []
        for track in CareerTrack.objects.all():
            # Calculate overlap based on matching interest objects
            overlap = track.relevant_interests.filter(id__in=matching_interests.values_list('id', flat=True)).count()
            career_track_scores.append({
                'track': track,
                'score': overlap
            })

        # Sort by score in descending order and get top 4
        sorted_tracks = sorted(career_track_scores, key=lambda x: x['score'], reverse=True)
        # Filter for tracks with at least one matching interest before taking top 4
        top_4_recommendations = [item['track'] for item in sorted_tracks if item['score'] > 0][:4]

        serializer = CareerTrackSerializer(top_4_recommendations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class OnboardingQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OnboardingQuestion.objects.all()
    serializer_class = OnboardingQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return 5 random questions
        return OnboardingQuestion.objects.order_by('?')[:5]

class UserAnswerViewSet(viewsets.ModelViewSet):
    serializer_class = UserAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAnswer.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def user_skill_tags(self, request):
        # Get all answers for the user
        answers = UserAnswer.objects.filter(user=request.user).select_related('question')
        
        # Collect all tags from answered questions
        skill_tags = set()
        for answer in answers:
            question = answer.question
            if question.type == 'yes_no' and answer.answer:
                skill_tags.update(question.tags)
            elif question.type == 'multi_choice':
                # For multi-choice, we could add logic to map specific answers to specific tags
                skill_tags.update(question.tags)
            elif question.type == 'scale_1_5' and answer.answer >= 4:
                # For scale questions, only include tags if the answer is high (4 or 5)
                skill_tags.update(question.tags)
        
        return Response({'skill_tags': list(skill_tags)})

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated] 