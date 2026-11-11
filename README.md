
# 🤖 AI Quiz Generator

An AI-powered web application that automatically generates interactive quizzes from PDF documents. Users can upload educational materials, customize quiz settings, test their knowledge, and review their results.

The application combines a React frontend with a FastAPI backend, PostgreSQL database, and AI-powered question generation using the Groq API.

## ✨ Features

- **PDF Upload** – Upload PDF documents as a source for quiz generation.
- **AI-Powered Quiz Generation** – Automatically generate quiz questions from uploaded documents using a Large Language Model (LLM).
- **Customizable Quizzes** – Select the number of questions and difficulty level.
- **Interactive Quiz Interface** – Answer generated questions through an interactive interface.
- **Results and Answer Analysis** – View quiz results and review correct and incorrect answers.
- **User Authentication** – Register and log in securely.
- **Quiz History** – Access previously completed quizzes and review past results.

## 🏗️ Architecture

The application follows a client-server architecture with cloud-based infrastructure.

### Application Architecture

```text
User
  ↓
React Frontend
  ↓
FastAPI Backend
  ↓
PostgreSQL Database
  ↓
Groq API
  ↓
AI-Generated Quiz Questions
```

### Cloud Infrastructure

| Service | Provider | Purpose |
|---|---|---|
| Azure Static Web Apps | Microsoft Azure | Frontend hosting |
| Render Web Service | Render | Backend hosting |
| AWS RDS | Amazon AWS | PostgreSQL database hosting |
| Groq API | Groq | AI-powered quiz generation |

## 🛠️ Technologies

### Frontend

- **React** – Building the user interface
- **JavaScript** – Application logic
- **React Router** – Client-side navigation
- **Vite** – Development server and build tool

### Backend

- **Python** – Backend programming language
- **FastAPI** – REST API development
- **SQLAlchemy** – Database ORM
- **PostgreSQL** – Relational database
- **JWT** – User authentication and authorization
- **Groq API** – AI-powered question generation
- **Llama 3.3 70B Versatile** – Language model used for generating quiz questions

### Infrastructure & Tools

- **Docker** – Application containerization
- **Docker Compose** – Multi-container application orchestration
- **Microsoft Azure** – Frontend hosting
- **Render** – Backend hosting
- **AWS RDS** – Managed PostgreSQL database

## 📁 Project Structure

```text
quiz-generator/
├── backend/
│   ├── app/
│   │   ├── core/          # Application configuration
│   │   ├── db/            # Database configuration
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routes/        # API endpoints
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Business logic
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── components/    # Reusable React components
│   │   └── api.js         # API communication
│   └── Dockerfile
│
└── docker-compose.yml
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following tools installed:

- Docker
- Docker Compose
- Git

You will also need a valid Groq API key to enable AI-powered quiz generation.

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/kt0eto/quiz-generator.git
cd quiz-generator
```

**2. Configure environment variables**

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://quiz_user:quiz_password@db:5432/quiz_db
JWT_SECRET_KEY=your_secure_secret_key
OPENAI_API_KEY2=your_groq_api_key
OPENAI_MODEL=llama-3.3-70b-versatile
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

**Note:** The `OPENAI_API_KEY2` variable is used to store the Groq API key in the project's configuration. Make sure to provide a valid API key.

**3. Build and start the application**

Run the following command from the project root directory:

```bash
docker-compose up --build
```

**4. Access the application**

Once the containers are running, the application will be available at:

| Component | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation (Swagger UI) | http://localhost:8000/docs |

## 👥 Team & Contributions

This project was developed collaboratively as a team project.

| Team Member | Responsibilities |
|---|---|
| Team Lead | Frontend development and authentication |
| Team Member 2 | PDF processing and AI integration |
| Team Member 3 | Quiz functionality, results, Docker configuration, and deployment |

## 🔐 Security & Configuration

The application uses several security-related technologies and practices:

- JWT-based authentication
- Environment variables for sensitive configuration
- Password-based user authentication
- Separation of frontend and backend services
- Docker-based application isolation

**Important:** Never commit API keys, database credentials, JWT secrets, or other sensitive environment variables to a public repository. Use `.env` files and include them in `.gitignore`.

## 🎯 Project Goals

The main goal of this project was to develop an AI-powered learning tool that simplifies the process of creating educational quizzes from existing study materials.

The project demonstrates practical experience with:

- Full-stack web application development
- REST API design and implementation
- AI and Large Language Model (LLM) integration
- PDF document processing
- Relational database design and ORM
- User authentication and authorization
- Docker containerization and multi-service architecture
- Cloud deployment and infrastructure configuration

---

**Project:** AI Quiz Generator  
**Category:** Full-Stack Development / Artificial Intelligence  
**Version:** 1.0.0
