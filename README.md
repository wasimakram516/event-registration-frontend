# Event Registration Platform

This project is a feature-rich Event Registration Platform built with React, allowing admins to manage events and users to register seamlessly. The app includes event management, user registration, dynamic event sharing, and robust validation for secure and streamlined user interaction.

## Features

### Admin Features
- **Event Management**:
  - Create, edit, and delete events with ease.
  - Upload event logos with support for Cloudinary integration.
  - View event details, including date, venue, and description.
  - Generate and share unique event links for user registration.
- **Sharing Events**:
  - Share event links via a copy-to-clipboard feature with a dedicated button.
  - Snackbar notifications for user-friendly feedback.
  - Each event link includes an event ID for verification and dynamic access.

### User Features
- **Event Details**:
  - Users can view event details by accessing shared event links.
  - Detailed information such as date, venue, and description is displayed.
- **Registration Process**:
  - Fill out registration forms with fields for name, email, phone (with country code validation), and company.
  - On successful submission, users receive a confirmation message.
- **Validation**:
  - Phone number field restricts input to valid formats (including country code).
  - Real-time validation ensures a smooth user experience.

### Global Features
- **Dynamic Snackbar Notifications**:
  - Context-based Snackbar component to show success, error, or info messages.
  - Notifications appear in a consistent location (top-center of the screen).
- **Confirmation Dialog**:
  - Reusable confirmation modal for delete operations or other critical actions.

## Technologies Used
- **Frontend**: React with Material-UI for responsive and visually appealing UI components.
- **Backend**: Node.js and Express.js for APIs.
- **Database**: MongoDB for storing event and registration data.
- **File Upload**: Cloudinary integration for uploading and storing event logos.

## Getting Started

### Prerequisites
- Node.js installed on your system.
- A MongoDB database setup (local or cloud).
- A Cloudinary account for managing event logo uploads.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/event-registration-platform.git
   cd event-registration-platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
Refer to the [backend repository](https://github.com/your-repository/event-registration-backend) for setup instructions.

## Available Scripts

In the project directory, you can run:

### `npm start`
Starts the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production to the `build` folder.

## Deployment
1. Build the app:
   ```bash
   npm run build
   ```
2. Deploy the contents of the `build` folder to your hosting provider.

## Learn More
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/)

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
