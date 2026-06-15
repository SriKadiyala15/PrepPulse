#PrepPulse – AI-Powered Wikipedia Quiz Generator Overview

PrepPulse is a full-stack web application that transforms Wikipedia articles into interactive multiple-choice quizzes. Instead of manually creating practice questions from study material, users can simply provide a Wikipedia article URL, and the application automatically extracts the content, processes it using AI, and generates a quiz along with a concise summary.

The project was built to help students, learners, and knowledge enthusiasts reinforce their understanding of topics through active recall and self-assessment.

##How It Works

1. User submits a Wikipedia article URL.

2. The backend validates the URL and fetches the article content.

3. Irrelevant elements such as references, navigation sections, and tables are removed.

4. The cleaned content is processed and summarized.

5. An AI model generates multiple-choice questions based on the article.

6.The quiz is returned to the frontend and displayed in an interactive format.

7.Generated quizzes are stored for future access and analysis.

##Workflow

User → React Frontend → FastAPI Backend → Wikipedia Scraper → Content Processing → Gemini AI → Quiz Generation → Interactive Quiz UI

## Key Features

1. Automatic quiz generation from Wikipedia articles

2. AI-generated multiple-choice questions

3. Article summarization

4. Content extraction and cleaning

5. Real-time quiz generation

6. Responsive user interface

7. Persistent quiz storage

8. End-to-end deployment on cloud platforms

##Tech Stack

###Frontend

React

JavaScript

Tailwind CSS

Axios

React Router

##Backend

FastAPI

Python

LangChain

SQLAlchemy

SQLite / MySQL

BeautifulSoup

#Deployment

1. Vercel (Frontend)

2. Render (Backend)

#Live Demo

##Frontend: https://preppulse-five.vercel.app/

##Backend API: https://preppulse-o2ay.onrender.com/

Note: The backend is hosted on Render's free tier. If the application has been inactive, please allow approximately 30 seconds for the backend service to wake up before testing.
