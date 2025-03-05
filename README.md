# SimpleApp - React Native iPhone App

A clean, simple React Native app built with Expo for iOS devices. This project demonstrates basic React Native concepts and provides a foundation for building more complex mobile applications.

## Features

- **Home Screen**: Welcome screen with basic information about the app
- **Counter Screen**: Interactive counter demonstrating state management
- **Explore Screen**: Information about the app's features and components
- **Custom Components**: Reusable UI components like CustomButton
- **Theming Support**: Light and dark mode support

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- iOS Simulator (for Mac users) or a physical iOS device
- Expo Go app (for testing on physical devices)

### Installation

1. Clone this repository
2. Navigate to the project directory:
   ```
   cd iphone-app/SimpleApp
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the App

#### iOS Simulator (Mac only)
```
npm run ios
```
or
```
yarn ios
```

#### Physical iOS Device
1. Install the Expo Go app from the App Store
2. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```
3. Scan the QR code with your iPhone camera or Expo Go app

## Project Structure

- `/app`: Main application screens and navigation
  - `/(tabs)`: Tab-based navigation screens
- `/components`: Reusable UI components
- `/constants`: App constants like colors and layout
- `/assets`: Images, fonts, and other static assets

## Learning Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

## Next Steps

Here are some ideas to extend this project:

1. Add a settings screen with user preferences
2. Implement data persistence with AsyncStorage
3. Add animations to the counter screen
4. Create a form with input validation
5. Integrate with a REST API

## License

This project is open source and available under the MIT License.
