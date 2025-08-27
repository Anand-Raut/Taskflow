
# Taskflow - MERN Task Management App

Taskflow is a full-stack web application for managing tasks and boards, built with the MERN stack. It features user authentication, email verification, and a modern, responsive UI for efficient team and personal productivity.

## Features
- User registration, login, and email verification
- Create, update, and delete tasks and boards
- Secure authentication and authorization
- Email notifications (verification, etc.)
- Responsive, modern UI

## Technologies Used
- **Frontend:** React.js, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Email:** Nodemailer
- **State Management:** React Context API
- **Build Tools:** Vite
- **Linting:** ESLint

## Getting Started
1. Clone the repository:
	```bash
	git clone https://github.com/Anand-Raut/mern-auth.git
	```
2. Install dependencies for both `client` and `server`:
	```bash
	cd client && npm install
	cd ../server && npm install
	```
3. Set up environment variables in `server/.env` (see sample in code).
4. Start the backend server:
	```bash
	node server.js
	```
5. Start the frontend:
	```bash
	cd ../client
	npm run dev
	```

## License
This project is licensed under the MIT License.
