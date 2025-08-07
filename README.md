# Chess Learning Game for Kids

A visual chess learning application designed for 4-year-old children with autism. The game teaches basic chess piece movements through simple drag-and-drop puzzles.

## Features

- 🎮 Simple drag-and-drop interface  
- 🎯 Capture puzzles with progressive difficulty
- 🎉 Visual and audio feedback with confetti animations
- 📊 Score tracking and streak system
- 🎨 Large, colorful pieces designed for young children
- 💾 Local storage for progress tracking
- 📱 Responsive design for tablets and desktops
- 🏆 Progressive board sizes (3x3 → 4x4 → 8x4)

## How to Play

1. Click "Start Game"
2. Look at your piece in the center (marked with blue "START")
3. Find enemy pieces (black pawns) that have red circles
4. Drag your piece to capture an enemy with a red circle
5. Get points for correct captures!
6. Progress through levels for bigger boards and more challenges

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to GitHub Pages

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar under "Code and automation")
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### Step 2: Push Code to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial chess-vis game"

# Push to GitHub (replace 'origin' and 'main' if different)
git push origin main
```

### Step 3: Deploy

The GitHub Actions workflow will automatically deploy when you push to the main/master branch.

You can also manually trigger deployment:
1. Go to the **Actions** tab in your GitHub repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow" button

### Step 4: Access Your Game

After successful deployment, your game will be available at:
```
https://[your-username].github.io/chess-vis/
```

### Troubleshooting Deployment

If deployment fails with "Get Pages site failed" error:
1. Make sure GitHub Pages is enabled (Step 1 above)
2. Ensure the Source is set to "GitHub Actions"
3. Wait a few minutes after enabling Pages before pushing code
4. Check the Actions tab for deployment logs

## Technology Stack

- Vue 3 with Composition API
- Vite for fast development
- chess.js for move validation
- canvas-confetti for celebrations
- GitHub Pages for hosting

## Game Progression

- **Levels 1-3**: 3x3 board - Learn basic piece movements
- **Levels 4-6**: 4x4 board - More space and enemies
- **Levels 7+**: 8x4 board - Full chess board width

## Assets

Chess piece images are included in the `/assets` folder with both black and white pieces for all standard chess pieces.

## License

Private project - All rights reserved