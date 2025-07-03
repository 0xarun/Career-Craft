from django.core.management.base import BaseCommand
from api.models import CareerTrack, LearningPage, PhaseTwoFunFact, PhaseTwoDayInLife, PhaseTwoScenario, PhaseTwoReflection

class Command(BaseCommand):
    help = 'Adds Phase 2 content to existing career tracks'

    def handle(self, *args, **kwargs):
        career_tracks = CareerTrack.objects.all()
        added_count = 0

        for track in career_tracks:
            try:
                # Get the first learning page for the career track
                learning_page = track.learning_pages.first()
                if not learning_page:
                    self.stdout.write(f'Skipping {track.title}: No learning pages found.')
                    continue

                # Check if Phase 2 content already exists for this learning page
                if not PhaseTwoFunFact.objects.filter(learning_page=learning_page).exists():
                    self.stdout.write(f'Adding Phase 2 content to {track.title} (Learning Page {learning_page.page_number})...')

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

                added_count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error adding Phase 2 content to {track.title}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully added Phase 2 content to {added_count} career tracks')) 