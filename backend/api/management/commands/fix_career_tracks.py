from django.core.management.base import BaseCommand
from api.models import CareerTrack, LearningPage, PageSection

class Command(BaseCommand):
    help = 'Fixes career tracks that don\'t have learning pages'

    def handle(self, *args, **kwargs):
        career_tracks = CareerTrack.objects.all()
        fixed_count = 0

        for track in career_tracks:
            # Check if the track has any learning pages
            if not track.learning_pages.exists():
                self.stdout.write(f'Creating learning page for {track.title}...')
                
                # Create Page 1
                learning_page = LearningPage.objects.create(
                    career_track=track,
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
                fixed_count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully fixed {fixed_count} career tracks')) 