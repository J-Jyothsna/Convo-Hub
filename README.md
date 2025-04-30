# Connectify

Connectify is a robust application that facilitates meeting scheduling, and employee collaboration. It features meeting scheduling with overlapping time zones, and email notifications to enhance productivity in an organization.

## Features

- **Meeting Scheduling**:
  - Overlapping time window calculation based on employee availability and time zones.
  - Localized meeting time conversion for all participants.
- **Email Notifications**:
  - OTP verification for registration.
  - Automated meeting notifications and updates.
- **Data Management**:
  - MongoDB for storing employee details, meeting schedules, and participant data.
  - RabbitMQ Streams for handling chat messages and notifications.


## Technologies Used

### Backend:
- **Spring Boot**: Framework for building RESTful APIs.
- **MongoDB**: Database for efficient data storage and retrieval.
- **RabbitMQ**: Message broker for asynchronous communication.
- **Feign Client**: Simplified HTTP client for microservice communication.

### Frontend:
- **React**: Framework for building a responsive and user-friendly interface.

### Others:
- **Docker**: For containerizing services.
- **Git**: Version control for collaboration.

## Installation

### Prerequisites
- **Java 17+** for backend.
- **React.js and npm** for frontend.
- **MongoDB Atlas** or a local MongoDB instance.
- **RabbitMQ** for messaging services.

### Microservices
1. Eureka Server.
2. Authentication Service.
3. Gateway Service.
4. Employee Service.
5. Meeting Service.
6. Participants Service.
7. Email Service.


### Backend
1. Clone the backend repository:
   ```bash
   git clone <backend-repo-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   ./mvnw clean install
   ```
3. Configure environment variables or `application.yml` for:
   - MongoDB connection.
   - RabbitMQ configuration.
   - Email service credentials.
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend
1. Clone the frontend repository:
   ```bash
   git clone <frontend-repo-url>
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
### Database.
MongoDB Atlas

## Usage

### Features Walkthrough

#### 1. Meeting Scheduler
- Select participants and specify a date.
- Calculate overlapping time windows and confirm meeting schedules.
- Notifications will be sent automatically to participants.

#### 2. User Management
- New users can register with OTP verification.
- Sign in to access the dashboard and manage meetings.

#### 3. Email Notifications
- System-generated emails for meeting details and updates.


## Project Structure

### Backend
- `/src/main/java`: Source code for microservices.
- `/src/main/resources`: Configuration files like `application.yml`.

### Frontend
- `/src/components`: React components for UI.

## Contribution

We welcome contributions! To get started:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions or support, please reach out to the development team:

- **Backend Lead**: Your Name (rdchethan22@gmail.com)
- **Frontend Lead**: Collaborator Name (rdevananda27@gmail.com)


