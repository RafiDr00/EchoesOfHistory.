# 🏛️ Echoes of History

**An Interactive Historical Exploration Platform**

Echoes of History is a full-stack web application that brings history to life through AI-powered insights, interactive visualizations, and immersive user experiences. Explore historical events, chat with historical figures, and discover connections across time.

## ✨ Features

### 🔍 Enhanced Search
- **Live Search Suggestions**: Real-time autocomplete with historical context
- **Multi-source Results**: Wikipedia integration with images, quotes, and related topics
- **Visual Results**: Rich media presentation with historical imagery
- **Relationship Discovery**: Find connections between historical figures and events

### 💬 AI-Powered Chat
- **Historical Figure Conversations**: Chat with AI representations of historical figures
- **Contextual Responses**: Historically accurate and character-appropriate responses
- **Multiple Personalities**: Choose from various historical figures
- **Interactive Storytelling**: Generate immersive historical narratives

### 📊 Interactive Timeline
- **Visual Timeline**: D3.js-powered interactive historical timeline
- **Filterable Events**: Filter by time period, category, and importance
- **Event Details**: Rich information panels for each historical event
- **Zoom & Pan**: Navigate through different historical periods

### 🔐 User Management
- **Authentication**: Secure JWT-based authentication system
- **User Profiles**: Personalized experience with search history
- **Favorites**: Save and organize favorite historical content

### 🎨 Modern UI/UX
- **Cyberpunk Design**: Futuristic neon-themed interface
- **Dark Mode**: Eye-friendly dark theme with glowing accents
- **Responsive Design**: Works seamlessly on all devices
- **Smooth Animations**: Framer Motion-powered transitions

## 🏗️ Architecture

### Backend (FastAPI)
- **FastAPI Framework**: High-performance async API framework
- **SQLModel**: Type-safe database operations with SQLite
- **JWT Authentication**: Secure token-based authentication
- **OpenAI Integration**: AI-powered historical conversations
- **Wikipedia API**: Real-time historical data fetching

### Frontend (Next.js)
- **Next.js 14**: React framework with SSR capabilities
- **Tailwind CSS**: Utility-first CSS framework with custom cyberpunk theme
- **Framer Motion**: Smooth animations and transitions
- **D3.js**: Interactive data visualizations
- **SWR**: Data fetching with caching and revalidation

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 16+**
- **npm or yarn**

### Option 1: Automated Setup (Recommended)

**Windows:**
```batch
# Run the automated setup script
.\start-dev.bat
```

**Unix/Linux/Mac:**
```bash
# Make script executable and run
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Unix/Linux/Mac
# .venv\Scripts\activate   # Windows

# Install dependencies
cd backend
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

#### Frontend Setup
```bash
# Install dependencies
cd frontend
npm install

# Start the development server
npm run dev
```

## 🌐 Accessing the Application

- **Frontend**: http://localhost:3000 (or the next available port)
- **Backend API**: http://127.0.0.1:8080
- **API Documentation**: http://127.0.0.1:8080/docs

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=sqlite+aiosqlite:///./echoes.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key-here

# CORS Configuration
FRONTEND_URL=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
```

### OpenAI Integration (Optional)

To enable AI-powered historical conversations:
1. Get an OpenAI API key from https://platform.openai.com/
2. Add it to your `.env` file as `OPENAI_API_KEY`
3. Restart the backend server

**Note**: The application works without an OpenAI key, showing mock responses instead.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Search
- `GET /api/search/suggestions?q={query}` - Get search suggestions
- `POST /api/search/enhanced` - Enhanced search with media
- `POST /api/search/query` - Basic Wikipedia search
- `POST /api/search/relationships` - Find historical relationships
- `GET /api/search/timeline/{topic}` - Get timeline data
- `POST /api/search/ai-insights` - AI-generated insights

### Chat
- `POST /api/chat` - Chat with historical figures

### Health
- `GET /healthz` - Health check endpoint

## 🗂️ Project Structure

```
EchoesOfHistory/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── core/           # Security and configuration
│   │   ├── services/       # External service integrations
│   │   ├── db.py           # Database configuration
│   │   ├── main.py         # FastAPI application
│   │   └── models.py       # Database models
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # Next.js frontend
│   ├── components/        # React components
│   ├── pages/            # Next.js pages
│   ├── styles/           # CSS styles
│   ├── package.json      # Node.js dependencies
│   └── tailwind.config.js # Tailwind configuration
├── docker-compose.yml     # Docker configuration
├── start-dev.bat         # Windows setup script
├── start-dev.sh          # Unix setup script
└── README.md            # This file
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Wikipedia API** for historical data
- **OpenAI** for AI-powered conversations
- **Wikimedia Commons** for historical imagery
- **D3.js** for interactive visualizations
- **FastAPI** and **Next.js** communities

## 🔮 Future Enhancements

- **3D Historical Reconstructions**: WebGL-based 3D models of historical sites
- **VR/AR Support**: Immersive historical experiences
- **Social Features**: Share discoveries and collaborate with other history enthusiasts
- **Mobile App**: Native mobile application
- **Advanced AI**: More sophisticated historical AI personalities
- **Multilingual Support**: Support for multiple languages
- **Historical Games**: Interactive historical scenarios and quizzes

---

**Built with ❤️ for history enthusiasts and curious minds everywhere.**
