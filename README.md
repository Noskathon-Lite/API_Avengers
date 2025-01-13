## NeoPresenta

## Overview
Presenting you Neo-Presenta :Dynamic Diagram Generator is a web application designed to transform static files into dynamic visual diagrams such as flowcharts, use case diagrams, and other types of diagrams. The application leverages AI for summarization and includes an AI chatbot to enhance user experience. It aims to make it easy for mapping minds.

Features

FILE Parsing: Upload static PDF, docs, pptx documents for analysis.

Diagram Generation: Automatically create dynamic diagrams such as:

Flowcharts

Use case diagrams

Other relevant visual representations

AI Summarization: Summarize the content of the uploaded PDF for quick insights.

AI Chatbot: Interact with an AI chatbot to assist in understanding the content and features.

Technologies Used

Frontend:


Frameworks/Libraries: [Insert your frontend framework/library, if any]

Backend:

[Insert your backend language/framework, e.g., Node.js, Flask, etc.]

Integration with AI models for summarization and chatbot functionality

AI/ML:

[Specify AI/ML technologies or APIs used,Gemini]

Database:

[Insert database used, SQLite as it is lightwight database]
## Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** (>= 16.x)
- **npm** (>= 7.x) or **yarn** (for managing frontend dependencies)
- **Python** (>= 3.9)
- **pip** (for managing backend dependencies)

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/your-username/your-repo-name.git](https://github.com/Noskathon-Lite/API_Avengers.git
cd your-repo-name
```

### 2. Frontend Setup (React, Vite, TypeScript)

#### Navigate to the `frontend` directory:

```bash
cd frontend
```

#### Install frontend dependencies:

You can use either **npm** or **yarn** for this:

```bash
npm install
# or
yarn install
```

#### Start the development server:

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`.

### 3. Backend Setup (Flask)

#### Navigate to the `backend` directory:

```bash
cd ../backend
```

#### Create a virtual environment:

```bash
python -m venv venv
```

#### Activate the virtual environment:

- On **Windows**:
  ```bash
  venv\Scripts\activate
  ```
- On **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

#### Install backend dependencies:

```bash
pip install -r requirements.txt
```

#### Run the Flask server:

```bash
python app.py
```

The backend will be available at `http://localhost:5000`.

### 4. Connecting Frontend and Backend

Make sure the frontend is configured to send API requests to the correct backend URL (`http://localhost:5000`). Modify the frontend code accordingly if needed.
