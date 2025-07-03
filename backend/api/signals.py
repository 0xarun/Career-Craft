from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CareerTrack, LearningPage, PageSection, PhaseTwoFunFact, PhaseTwoDayInLife, PhaseTwoScenario, PhaseTwoReflection

@receiver(post_save, sender=CareerTrack)
def create_initial_content(sender, instance, created, **kwargs):
    if created:
        # Create Page 1
        learning_page = LearningPage.objects.create(
            career_track=instance,
            page_number=1
        )

        # Create default sections
        sections = [
            ('overview', 'Overview'),
            ('scope', 'Scope and Impact'),
            ('opportunities', 'Opportunities'),
            ('skills', 'Skills Required'),
            ('knowledge', 'Knowledge Areas')
        ]

        for order, (section_type, _) in enumerate(sections):
            PageSection.objects.create(
                learning_page=learning_page,
                section_type=section_type,
                content='Coming soon...',
                order=order
            )

        # Create Phase 2 content
        # Fun Facts
        PhaseTwoFunFact.objects.create(
            learning_page=learning_page,
            title='Did You Know?',
            fact_text='Coming soon...',
            takeaway='Coming soon...'
        )
        PhaseTwoFunFact.objects.create(
            learning_page=learning_page,
            title='Interesting Fact',
            fact_text='Coming soon...',
            takeaway='Coming soon...'
        )

        # Day in Life
        PhaseTwoDayInLife.objects.create(
            learning_page=learning_page,
            narrative={
                'morning': 'Coming soon...',
                'afternoon': 'Coming soon...',
                'evening': 'Coming soon...'
            }
        )

        # Scenarios
        PhaseTwoScenario.objects.create(
            learning_page=learning_page,
            question='Coming soon...',
            option_a='Coming soon...',
            option_b='Coming soon...',
            option_c='Coming soon...',
            correct_option='A',
            explanation='Coming soon...'
        )
        PhaseTwoScenario.objects.create(
            learning_page=learning_page,
            question='Coming soon...',
            option_a='Coming soon...',
            option_b='Coming soon...',
            option_c='Coming soon...',
            correct_option='A',
            explanation='Coming soon...'
        )

        # Reflection
        PhaseTwoReflection.objects.create(
            learning_page=learning_page,
            question_text='Coming soon...',
            option_1='Coming soon...',
            option_2='Coming soon...',
            option_3='Coming soon...'
        ) 