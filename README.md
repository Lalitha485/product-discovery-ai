# Product Discovery (AI Powered)

## Project Structure

product-discovery/
│
├── backend/
│   ├── main.py
│   ├── products.json
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   └── src/
│       ├── App.js
│       └── index.js
│
└── README.md

## Setup Instructions

### Backend
cd backend
pip install -r requirements.txt
Create .env file from .env.example and add your OPENAI_API_KEY
uvicorn main:app --reload

### Frontend
npx create-react-app frontend
Replace the generated src folder with the provided src folder
npm install
npm start
