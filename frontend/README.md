**PrepPulse – AI-Powered Quiz Generator**

PrepPulse is a full-stack web application that automatically generates intelligent quizzes from Wikipedia articles using Generative AI. The goal of this project is to help students and learners quickly convert reading material into interactive practice questions.
Users simply paste a Wikipedia URL, and the system validates the article, extracts and cleans the content, generates a concise summary, and creates a multiple-choice quiz in real time.

**NOTE-** After opening the frontend link, please wait at least 30 seconds for the backend to wake up before using the application.

**Link-** https://preppulseproject.vercel.app/

**Tech Stack-**

**Frontend-**

1.React (Vite)

2.TypeScript

3.Tailwind CSS

4.Axios

5.React Router

**Backend-**

1.FastAPI (Python)

2.LangChain

3.Google Gemini (LLM)

4.SQLAlchemy

5.SQLite / MySQL

6.BeautifulSoup (Web scraping)

**System Architecture**

User → React Frontend → FastAPI Backend → Wikipedia Scraper → Gemini LLM → Quiz JSON → UI

**Live Deployment**

**Frontend (Vercel):**
https://preppulseproject.vercel.app/

**Backend API (Render):**
https://preppulse-backend-rjek.onrender.com/

**Note on Backend Repository:** The backend repository is kept private for security and confidentiality reasons, as it contains API integrations and core business logic. However, the live backend is fully deployed and publicly accessible through the above API URL.

**What This Project Demonstrates**
This project demonstrates practical experience in:

1.Full-stack web development

2.Generative AI integration

3.REST API design

4.Web scraping and data cleaning

5.Cloud deployment (Vercel + Render)

6.Environment variable management

7.Real-world production debugging
