from django.core.management.base import BaseCommand
from api.models import Interest, CareerTrack
from django.utils.text import slugify

INTERESTS_LIST = [
    "Tech", "Coding", "Data", "Design", "Figma", "Cybersecurity", "Hacking",
    "CTF", "Games", "Game Design", "Unity", "Unreal Engine", "AI", "Neural Networks",
    "Startups", "Business", "YouTube", "Vlogging", "Public Speaking",
    "3D Modelling", "Product", "Marketing", "Machine Learning",
    "Mobile Apps", "Backend", "Frontend", "UX/UI", "No Code", "Open Source",
    "Storytelling", "Community", "Python", "React", "Robotics", "Hardware"
]

CAREER_PATHS_MAPPING = {
    "Full-Stack Developer": ["Coding", "Frontend", "Backend", "React", "Python", "Tech"],
    "AI Engineer": ["AI", "Neural Networks", "Python", "Machine Learning", "Tech", "Data"],
    "Game Developer": ["Games", "Unity", "Unreal Engine", "Coding", "3D Modelling"],
    "Startup Founder": ["Startups", "Business", "Marketing", "Tech", "Product", "Public Speaking"],
    "Ethical Hacker": ["Cybersecurity", "CTF", "Hacking", "Tech"],
    "UX Designer": ["Figma", "Design", "UX/UI", "No Code", "Product"],
    "Data Scientist": ["Data", "Machine Learning", "Python", "Tech"],
    "Content Creator": ["YouTube", "Vlogging", "Storytelling", "Public Speaking"],
    "Product Manager": ["Product", "Startups", "Tech", "Design", "Marketing"],
    "Robotics Engineer": ["Robotics", "Hardware", "Tech", "Python"],
    "Mobile App Developer": ["Mobile Apps", "Frontend", "Backend", "React", "No Code"],
    "Open Source Contributor": ["Open Source", "Coding", "Community", "Tech"],
    "Tech YouTuber": ["YouTube", "Vlogging", "Tech", "Public Speaking", "Storytelling"]
}

# Placeholder emojis, descriptions, and salaries (can be refined later)
CAREER_TRACK_DETAILS = {
    "Full-Stack Developer": {
        "emoji": "💻",
        "description": "Build and maintain both the frontend and backend of web applications.",
        "avg_salary": "$90,000 - $130,000"
    },
    "AI Engineer": {
        "emoji": "🤖",
        "description": "Design, build, and maintain AI systems and machine learning models.",
        "avg_salary": "$100,000 - $150,000"
    },
    "Game Developer": {
        "emoji": "🎮",
        "description": "Create video games for various platforms using programming and design skills.",
        "avg_salary": "$70,000 - $110,000"
    },
    "Startup Founder": {
        "emoji": "🚀",
        "description": "Build and grow a new business from the ground up.",
        "avg_salary": "Varies widely"
    },
    "Ethical Hacker": {
        "emoji": "🔐",
        "description": "Test systems and networks for vulnerabilities and provide security solutions.",
        "avg_salary": "$95,000 - $140,000"
    },
    "UX Designer": {
        "emoji": "🎨",
        "description": "Focus on creating intuitive and enjoyable user experiences for digital products.",
        "avg_salary": "$80,000 - $120,000"
    },
    "Data Scientist": {
        "emoji": "📊",
        "description": "Analyze complex data to extract insights and inform business decisions.",
        "avg_salary": "$100,000 - $145,000"
    },
    "Content Creator": {
        "emoji": "🎥",
        "description": "Produce engaging digital content for platforms like YouTube and blogs.",
        "avg_salary": "Varies widely"
    },
    "Product Manager": {
        "emoji": "📈",
        "description": "Define the vision, strategy, and roadmap for a product.",
        "avg_salary": "$90,000 - $150,000"
    },
    "Robotics Engineer": {
        "emoji": "🤖",
        "description": "Design, build, and program robots and robotic systems.",
        "avg_salary": "$85,000 - $135,000"
    },
    "Mobile App Developer": {
        "emoji": "📱",
        "description": "Build applications for mobile devices like smartphones and tablets.",
        "avg_salary": "$80,000 - $125,000"
    },
    "Open Source Contributor": {
        "emoji": "🌐",
        "description": "Collaborate on publicly available software projects.",
        "avg_salary": "Varies widely"
    },
     "Tech YouTuber": {
        "emoji": "📺",
        "description": "Create video content focused on technology topics for YouTube.",
        "avg_salary": "Varies widely"
    },
}

class Command(BaseCommand):
    help = 'Populates the database with initial interests and career tracks.'

    def handle(self, *args, **options):
        self.stdout.write('Populating interests...')
        interests_obj = {}
        for interest_name in INTERESTS_LIST:
            interest, created = Interest.objects.get_or_create(name=interest_name)
            interests_obj[interest_name] = interest
            if created:
                self.stdout.write(f'Created interest: {interest_name}')

        self.stdout.write('\nPopulating career tracks and mapping interests...')
        for career_track_title, relevant_interest_names in CAREER_PATHS_MAPPING.items():
            details = CAREER_TRACK_DETAILS.get(career_track_title, {})
            career_track, created = CareerTrack.objects.get_or_create(
                title=career_track_title,
                defaults={
                    'emoji': details.get('emoji'),
                    'description': details.get('description'),
                    'avg_salary': details.get('avg_salary'),
                }
            )

            if created:
                self.stdout.write(f'Created career track: {career_track_title}')

            # Add relevant interests
            track_interests = [interests_obj[name] for name in relevant_interest_names if name in interests_obj]
            career_track.relevant_interests.set(track_interests)
            self.stdout.write(f'Mapped {len(track_interests)} interests to {career_track_title}')

        self.stdout.write('\nDatabase population complete.') 