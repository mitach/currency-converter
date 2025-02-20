# Currency Converter

A full-stack currency converter application built with React and Node.js. This project allows users to convert between different currencies and view current exchange rates.

## 🌐 Demo

Visit the live application: [Currency Converter](https://famous-chaja-81bb8b.netlify.app/)

## 🛠 Tech Stack

### Frontend
- React with TypeScript
- Vite
- React Router DOM
- CSS Modules

### Backend
- Node.js
- Express
- MongoDB
- TypeScript

## 🚀 Features

- Real-time currency conversion
- Support for multiple currencies
- Responsive design
- Sort currencies by name or rate

## Running Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Git

Clone the repository
```git clone https://github.com/your-username/currency-converter.git```

### Backend Setup
1. Install dependencies
```cd backend && npm install```

2. Create .env file
```fill it with PORT and MONGODB_URI```

3. Start the server
```npm start```

### Frontend Setup
1. Install dependencies
```cd frontend && npm install```

2. Create .env.development file
```fill it with VITE_API_URL=http://localhost:{PORT}/api/v1```

3. Start the development server
```npm run dev```