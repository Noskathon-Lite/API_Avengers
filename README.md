## NeoPresenta

## Overview
This project is a web application developed using **React**, **Vite**, and **TypeScript** for the frontend, and **Flask** for the backend. The application aims to provide users with a fast, responsive, and intuitive experience while ensuring a lightweight and efficient API management system. The frontend utilizes modern technologies to build an interactive user interface, while the Flask backend offers scalability and ease of deployment. This project serves as an excellent example of combining cutting-edge frontend technologies with a flexible backend architecture.

### Problem Statement
In today’s fast-paced digital world, web applications need to deliver seamless user experiences while being efficient in handling data and requests. Many web applications struggle with poor performance due to heavy frontend frameworks or inefficient backend processing. This project aims to address the following challenges:

1. **Slow User Experience**: Many web applications suffer from slow user interfaces due to outdated frontend frameworks and unoptimized build tools.
2. **Inefficient Backend Architecture**: Backend systems often experience performance bottlenecks under heavy traffic, causing delays in response times.
3. **Fragmented Development Tools**: Developers often struggle with toolchain fragmentation, resulting in long setup times and maintenance overhead.

The goal of this project is to build a web application that addresses these problems by:

- Leveraging **React** and **Vite** to provide a fast, modern user interface that loads quickly and reacts to user interactions instantly.
- Using **TypeScript** to ensure better code quality and early detection of bugs during development.
- Employing **Flask** as the backend to provide a minimal and efficient API that can handle data requests without unnecessary overhead.

## Features

- **React-based UI**: Built using **React** for dynamic, interactive views and **React Router** for seamless navigation.
- **TypeScript Integration**: The application is developed with **TypeScript** to catch errors early and improve maintainability.
- **Efficient Development**: **Vite** is used for fast development and optimized production builds, reducing wait time during code changes and ensuring fast load times for end-users.
- **Flask Backend**: A lightweight **Flask** backend API that can handle requests and serve data without the complexity of heavier frameworks.
- **State Management**: Efficient and simple state management using React hooks, ensuring smooth user experience with dynamic content updates.

## Problem Solved
This project is designed to solve the following core issues:

1. **Improved Performance**: By using **Vite**, the project benefits from faster build times and improved runtime performance. This ensures that users can interact with the app quickly without long loading times or delays in data fetching.
2. **Scalability**: The **Flask** backend provides an optimal framework for scaling the application without introducing unnecessary complexity or overhead.
3. **Code Maintainability**: Using **TypeScript** and **React** ensures that the code is clean, maintainable, and less prone to errors, which is critical for future updates and expansions.

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
