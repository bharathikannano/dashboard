# CRED Garage Dashboard

A responsive React dashboard inspired by CRED's Garage platform, featuring a user profile summary, benefits section, and reward points visualization with dark/light mode toggle and smooth animations.

## Features

- **User Profile Summary**: Displays user avatar, name, level, XP progress bar, and badges
- **Benefits Section**: Grid layout of benefit cards with hover animations
- **Reward Points Visualization**: Interactive charts showing points distribution and history
- **Dark/Light Mode Toggle**: Theme switcher with smooth transitions and system preference detection
- **Loading Skeletons**: Animated placeholders during data loading
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Smooth Animations**: Transitions and micro-interactions using Framer Motion

## Tech Stack

- **React**: Frontend library for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for React
- **Recharts**: Composable charting library for React
- **ShadCN UI**: Component library built with Tailwind CSS

## Setup and Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cred-dashboard.git
   cd cred-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Project Structure

```
src/
├── components/
│   ├── BenefitsSection.jsx   # Benefits grid with card components
│   ├── ProfileSummary.jsx    # User profile with progress bar
│   ├── RewardPoints.jsx      # Points visualization with charts
│   ├── Skeleton.jsx          # Loading skeleton components
│   ├── ThemeProvider.jsx     # Context provider for theme
│   └── ThemeToggle.jsx       # Dark/light mode toggle button
├── App.js                    # Main application component
├── index.js                  # Entry point
└── index.css                 # Global styles and Tailwind directives
```

## Implementation Details

### Theme Toggle

The theme toggle uses a combination of localStorage for persistence and CSS transitions for smooth theme changes. The toggle button animates between sun and moon icons using Framer Motion.

### Loading States

Loading states are implemented using skeleton components that animate with a pulse effect. Data fetching is simulated with timeouts to demonstrate the loading-to-content transition.

### Animations

All animations are implemented with Framer Motion for smooth, physics-based transitions:
- Fade-in animations when components mount
- Hover effects on cards and buttons
- Animated progress bars
- Smooth transitions between loading and loaded states

## Deployment

The app can be deployed to Vercel with the following steps:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically detect the React app and deploy it

Live demo: [https://cred-dashboard.vercel.app](https://cred-dashboard.vercel.app)

## License

MIT
