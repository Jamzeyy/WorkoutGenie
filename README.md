# WorkoutGenie AI 🏋️‍♂️✨

A mobile-friendly workout web app that tracks workouts and uses AI (ChatGPT) to create personalized workout plans.

![WorkoutGenie AI](https://img.shields.io/badge/WorkoutGenie-AI%20Powered-22c55e?style=for-the-badge)

## Features

### 📱 Mobile-First Design
- Beautiful, responsive UI optimized for mobile devices
- Glass morphism design with smooth animations
- Dark theme with vibrant green accents

### 💪 Workout Tracking
- Log workouts with exercises, sets, reps, and weights
- Track workout duration and add notes
- View workout history

### 🤖 AI Workout Plan Generator
- Personalized questionnaire covering:
  - Fitness level (Beginner/Intermediate/Advanced)
  - Primary goal (Strength, Muscle Building, Weight Loss, Endurance, General Fitness)
  - Workout schedule (days per week, duration)
  - Available equipment
  - Focus areas
  - Injuries/limitations
  - **Extra comments section** for anything else you want the AI to know
- Generates detailed workout plans with:
  - Warm-up and cool-down routines
  - Exercise-specific instructions
  - Sets, reps, and rest periods
  - Tips for success

### 📅 Plan Cycles
- **Weekly** (1 week) - Quick intro or test week
- **Monthly** (4 weeks) - Standard training block
- **Bi-monthly** (8 weeks) - Full progression cycle

## Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Local database
- **OpenAI API** - ChatGPT integration for AI plans

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

5. Run the server:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## API Endpoints

### Workouts
- `GET /api/workouts/` - List all workouts
- `GET /api/workouts/{id}` - Get workout details
- `POST /api/workouts/` - Create new workout
- `PUT /api/workouts/{id}` - Update workout
- `DELETE /api/workouts/{id}` - Delete workout
- `POST /api/workouts/{id}/exercises` - Add exercise to workout

### Plans
- `GET /api/plans/` - List all plans
- `GET /api/plans/active` - List active plans
- `GET /api/plans/{id}` - Get plan details
- `POST /api/plans/generate` - Generate AI workout plan
- `POST /api/plans/save` - Save generated plan
- `PUT /api/plans/{id}/toggle-active` - Toggle plan active status
- `DELETE /api/plans/{id}` - Delete plan

## Project Structure

```
WorkoutGenieAiApp/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry
│   │   ├── database.py       # Database config
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── workouts.py   # Workout endpoints
│   │   │   └── plans.py      # Plan endpoints
│   │   └── services/
│   │       └── openai_service.py  # ChatGPT integration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Screenshots

The app features:
- 🏠 **Dashboard** - Quick stats and recent activity
- 💪 **Workouts** - Log and track exercises
- ✨ **AI Generator** - Create personalized plans
- 📅 **Plans** - View and manage workout programs

## License

MIT License - feel free to use this for your own projects!

---

Built with 💚 by WorkoutGenie AI
