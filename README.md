# challenge

challenge is a microservices-based event social media application. It enables users to register, manage profiles, create and join events, and handle event requests seamlessly. Built with a microservices architecture, it ensures scalability, modularity, and independent deployments.

## Features

### User and Events Service

- **User Registration**:
  - Allows users to register with full name, email, and password.
  - Validates input data and stores users in a PostgreSQL database.
- **Authentication**:
  - JWT-based authentication to secure specific endpoints.
- **User Profile Management**:
  - Endpoints for viewing and updating user profiles.
- **Event Management**:
  - Create, validate, and store event details such as title, date, category, and description.
  - Publicly accessible endpoint to list all events with pagination and filtering.
- **Join Request Management**:
  - Authenticated users can send join requests for events.
  - Event creators can accept/reject join requests.
  - Email notifications are sent for join requests and updates.

### Email Notification Service

- **Email Sending**:
  - Sends templated emails using a service like SendGrid.
  - Templates include welcome emails, join request notifications, and status updates.

### General Requirements

- Microservices architecture for independent service deployment.
- Swagger-based API documentation.
- Dockerized environment for seamless setup and deployment.
- Comprehensive unit tests with a target coverage of 60% or higher.

---

## How to Run

### Prerequisites

- Ensure Docker and Docker Compose are installed.
- Ensure Node.js and npm are installed for local setup.
- Configure the `.env` files in the root directory with the necessary environment variables.
  ```env
  GATEWAY_PORT=3000
  NOTIFICATIONS_PORT=3001
  USERS_PORT=3002
  TOKEN_SECRET=tokenSecret
  REFRESH_TOKEN_SECRET=refreshTokenSecret
  ```

### Steps

#### Development Mode

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd challenge
   ```

2. Install dependencies for all services:

   ```bash
   npm install
   ```

3. Start the services in development mode:

   ```bash
   docker-compose up
   sh run.sh
   ```

4. Access the application:
   - API documentation: `http://localhost:3000/api`
   - User and Events Service: `http://localhost:3000`

#### Production Mode

1. Clone the repository if not already done:

   ```bash
   git clone <repository-url>
   cd challenge
   ```

2. Build and start the services in production mode:

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. Ensure the production `.env` file is configured correctly.

4. Verify the services are running:
   - API documentation: `<your-production-url>/api`

### Emails

1. To email people, place your email in ./apps/notifications/src/notifications.module.ts .
2. Go to the gmail you want to send from and create an App Password

```
- Go to manage gmail.
- Turn on 2 step verification.
- search App Passwords and create one.
- replace the auth.pass in the notifications module.
```

### Testing

1. Run the tests:

   ```bash
   npm test -- --coverage
   ```

2. View test coverage reports in the `coverage` folder.

---

For further assistance, please refer to the documentation or contact the maintainer.
