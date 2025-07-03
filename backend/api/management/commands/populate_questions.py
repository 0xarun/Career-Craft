from django.core.management.base import BaseCommand
from api.models import OnboardingQuestion

QUESTIONS = [
    {
        "text": "You enjoy figuring out how things work, even if it takes hours?",
        "type": "yes_no",
        "tags": ["curious", "analytical"]
    },
    {
        "text": "Which environment suits you best?",
        "type": "multi_choice",
        "options": ["Solo and focused", "Collaborative and social", "Flexible and remote", "Hands-on and physical"],
        "tags": ["working_style"]
    },
    {
        "text": "You're asked to solve a problem – which approach do you prefer?",
        "type": "multi_choice",
        "options": ["Experiment until it works", "Research and plan thoroughly", "Talk to others and brainstorm", "Draw it out visually"],
        "tags": ["problem_solving", "creativity"]
    },
    {
        "text": "Do you enjoy creating content like videos, blogs, or designs?",
        "type": "yes_no",
        "tags": ["creative", "media"]
    },
    {
        "text": "Which excites you more?",
        "type": "multi_choice",
        "options": ["Building something from scratch", "Solving technical puzzles", "Helping others improve", "Exploring unknown areas"],
        "tags": ["builder", "analytical", "empathetic", "explorer"]
    },
    {
        "text": "You are more productive when...",
        "type": "multi_choice",
        "options": ["You have a fixed goal and deadline", "You can experiment without rules", "You're part of a team"],
        "tags": ["structure", "freedom", "team_player"]
    },
    {
        "text": "Do you like competitive challenges like quizzes or hackathons?",
        "type": "yes_no",
        "tags": ["competitive", "performer"]
    },
    {
        "text": "Rate your comfort with technology (1 to 5)",
        "type": "scale_1_5",
        "tags": ["tech_comfort"]
    },
    {
        "text": "Do you often find yourself trying to understand people's behavior or emotions?",
        "type": "yes_no",
        "tags": ["empathetic", "psychology"]
    },
    {
        "text": "Pick the activity you'd most enjoy this weekend:",
        "type": "multi_choice",
        "options": ["Hiking or travel", "Coding a side project", "Filming a vlog", "Reading something deep"],
        "tags": ["adventure", "techie", "creative", "thinker"]
    },
    {
        "text": "Do you enjoy organizing things (files, schedules, ideas)?",
        "type": "yes_no",
        "tags": ["organized", "logical"]
    },
    {
        "text": "Choose a phrase that resonates with you:",
        "type": "multi_choice",
        "options": ["Make it beautiful", "Make it work", "Make it helpful", "Make it fun"],
        "tags": ["design_mind", "engineering_mind", "helper", "fun_mind"]
    },
    {
        "text": "Which of these best describes you as a learner?",
        "type": "multi_choice",
        "options": ["Visual - I like seeing diagrams", "Kinesthetic - I learn by doing", "Auditory - I prefer listening", "Reading/Writing - Give me text"],
        "tags": ["learning_style"]
    },
    {
        "text": "You'd rather lead a group project than follow instructions?",
        "type": "yes_no",
        "tags": ["leader"]
    },
    {
        "text": "Do you enjoy thinking about the future and predicting trends?",
        "type": "yes_no",
        "tags": ["futurist", "strategic"]
    },
    {
        "text": "Pick what feels like your zone:",
        "type": "multi_choice",
        "options": ["Designing interfaces", "Writing stories/scripts", "Analyzing data", "Running events"],
        "tags": ["ui_ux", "storyteller", "data", "event_manager"]
    },
    {
        "text": "Do you like experimenting with visuals or editing tools?",
        "type": "yes_no",
        "tags": ["visual", "editorial"]
    },
    {
        "text": "You're faced with a new app – what do you do first?",
        "type": "multi_choice",
        "options": ["Explore freely and test it", "Read how it works", "Customize settings", "Try to break it!"],
        "tags": ["explorer", "researcher", "tinkerer", "tester"]
    },
    {
        "text": "What excites you more?",
        "type": "multi_choice",
        "options": ["Launching your own thing", "Collaborating on something cool", "Cracking a complex challenge", "Being on stage or spotlight"],
        "tags": ["entrepreneur", "team_player", "problem_solver", "performer"]
    },
    {
        "text": "How do you handle ambiguity or undefined problems?",
        "type": "multi_choice",
        "options": ["I love it – it's freedom", "I figure it out step-by-step", "I prefer some guidance"],
        "tags": ["independent", "adaptive", "structured"]
    }
]

class Command(BaseCommand):
    help = 'Populates the database with predefined questions'

    def handle(self, *args, **options):
        self.stdout.write('Populating questions...')
        
        for question_data in QUESTIONS:
            question, created = OnboardingQuestion.objects.get_or_create(
                text=question_data['text'],
                defaults={
                    'type': question_data['type'],
                    'options': question_data.get('options'),
                    'tags': question_data['tags']
                }
            )
            
            if created:
                self.stdout.write(f'Created question: {question.text}')
            else:
                self.stdout.write(f'Question already exists: {question.text}')
        
        self.stdout.write(self.style.SUCCESS('Successfully populated questions')) 