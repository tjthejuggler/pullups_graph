# 📊 Record Progress Tracker

A beautiful and intuitive web application to track and visualize your training progress across multiple disciplines.

## 🎯 Dual Tracking System

This application now features **two separate tracking tabs**:
- **💪 Pullups Tab**: Track your pullup training with multiple grip variations
- **♟️ Chess Puzzle Rush Tab**: Track your chess puzzle rush performance across different time controls

## Features Overview

### 💪 Pullups Tracker

- **Interactive Stacked Bar Chart**: View all your pullup sessions stacked by day
- **Multiple Exercise Types Support**: Track different exercise variations with color-coded bars
  - **Wide-grip pullups** ('w' suffix): Red bars
  - **Chin-ups** ('c' suffix): Green bars
  - **Pull-ups** ('p' suffix): Orange bars
  - **Dips** ('d' suffix): Purple bars
  - Best session for each exercise type gets its own trophy 🏆 on the chart
  - All exercise types count toward daily/weekly/monthly totals
  - Separate statistics tracked for each exercise type
- **Session-by-Session Breakdown**: Each session is displayed separately with colors indicating the grip type
- **Two-Column Statistics Panel**:
  - **Column 1 - Overall Stats**:
    - Today's total pullups
    - Highest day ever (with date on hover)
    - This week's total (with date range on hover)
    - Highest week ever (with date range on hover)
    - This month's total (with date range on hover)
    - Highest month ever (with date range on hover)
  - **Column 2 - Type-Specific Records** (color-coded as visual key):
    - Best wide session (red background)
    - Best chin-up session (green background)
    - Best pull-up session (orange background)
    - Best dips session (purple background)
- **Hover Tooltips**: Hover over any stat card to see the exact date or date range
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Auto-Updates**: Reads the latest data from your Pullups.md file each time you load the page

### ♟️ Chess Puzzle Rush Tracker

- **Interactive Stacked Bar Chart**: View all your puzzle rush sessions stacked by day
- **Multiple Time Controls Support**: Track different puzzle rush modes with color-coded bars
  - **3-Minute Rush** (m3 or 3m): Brown bars
  - **5-Minute Rush** (m5 or 5m): Goldenrod bars
  - **Survival Mode** (s): Indigo bars
  - Best session for each mode gets its own trophy 🏆 on the chart
- **Session-by-Session Breakdown**: Each session is displayed separately with colors indicating the mode
- **Two-Column Statistics Panel**:
  - **Column 1 - Overall Stats**:
    - Today's total puzzles solved
    - Highest day ever (with date on hover)
    - This week's total (with date range on hover)
    - Highest week ever (with date range on hover)
    - This month's total (with date range on hover)
    - Highest month ever (with date range on hover)
  - **Column 2 - Mode-Specific Records** (color-coded):
    - Best 3-Minute session (brown background)
    - Best 5-Minute session (goldenrod background)
    - Best Survival session (indigo background)
- **Chess-Themed Design**: Beautiful chess aesthetic with chess piece decorations
- **Auto-Updates**: Reads the latest data from your PuzzleRushApnea.md file each time you load the page

## How to Use

### Quick Start (Recommended)

Use the convenience script to start the server and open your browser in one command:

```bash
/home/twain/Projects/pullups_graph/start_pullups_graph.sh
```

This script:
- Checks if the server is already running
- Starts the server if needed
- Opens your browser to `http://localhost:8000`
- Can be run from anywhere on your system (perfect for hotkeys!)

### Manual Start

1. Open a terminal in the project directory
2. Run the server:
   ```bash
   python3 serve.py
   # Or make it executable first:
   ./serve.py
   ```
3. Open your browser and navigate to: `http://localhost:8000`
4. The app will automatically read your latest pullups data!

### Alternative: Use Sample Data

If you just want to see how it looks without setting up the server:
1. Simply open `index.html` directly in your browser
2. The app will display with sample data (due to browser security restrictions preventing direct file access)

## Data Formats

### Pullups Data Format

The application reads from `/home/twain/noteVault/Pullups.md` with the following format:

```
2025-11-27 12:27:20 > 2w
2025-11-27 13:15:30 > 5c
2025-11-27 14:00:00 > 8p
```

Each line represents:
- Date (YYYY-MM-DD)
- Time (HH:MM:SS)
- `>` separator
- Number of pullups in that session
- Required exercise type suffix:
  - `w` = wide-grip pullups (e.g., `2w` means 2 wide pullups)
  - `c` = chin-ups (e.g., `5c` means 5 chin-ups)
  - `p` = pull-ups (e.g., `8p` means 8 pull-ups)
  - `d` = dips (e.g., `6d` means 6 dips)

### Exercise Types

All exercise types are tracked separately but still count toward your daily, weekly, and monthly totals:

**Wide-grip pullups (w):**
```
2025-11-27 12:27:20 > 2w
```
- Wider than shoulder-width grip
- Emphasizes lats and upper back

**Chin-ups (c):**
```
2025-11-27 13:15:30 > 5c
```
- Underhand/supinated grip (palms facing you)
- Emphasizes biceps and lower lats

**Pull-ups (p):**
```
2025-11-27 14:00:00 > 8p
```
- Standard overhand/pronated grip (palms facing away)
- Balanced upper body workout

**Dips (d):**
```
2025-11-27 15:30:00 > 6d
```
- Parallel bar dips
- Emphasizes triceps, chest, and shoulders

Each exercise type will:
- Count toward your daily/weekly/monthly totals
- Display with a distinct color on the graph:
  - Wide: Red
  - Chin-ups: Green
  - Pull-ups: Orange
  - Dips: Purple
- Track separately for "Best [Type] Session" statistics
- Display a trophy 🏆 on the chart if it's your current record for that exercise type

### Chess Puzzle Rush Data Format

The application reads from `/home/twain/noteVault/PuzzleRushApnea.md` with the following format:

```
2025-11-28 10:10:59 m3 11
2025-11-28 10:15:30 m5 15
2025-11-28 10:20:45 s 23
```

Each line represents:
- Date (YYYY-MM-DD)
- Time (HH:MM:SS)
- Mode identifier:
  - `m3` or `3m` = 3-minute puzzle rush
  - `m5` or `5m` = 5-minute puzzle rush
  - `s` = survival mode
- Number of puzzles solved in that session

**Example entries:**
```
2025-11-28 10:10:59 m3 11    # Solved 11 puzzles in 3-minute mode
2025-11-28 10:15:30 m5 15    # Solved 15 puzzles in 5-minute mode
2025-11-28 10:20:45 s 23     # Solved 23 puzzles in survival mode
```

Each mode will:
- Count toward your daily/weekly/monthly totals
- Display with a distinct color on the graph:
  - 3-Minute: Brown
  - 5-Minute: Goldenrod
  - Survival: Indigo
- Track separately for "Best [Mode] Session" statistics
- Display a trophy 🏆 on the chart if it's your current record for that mode

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **Chart Library**: Chart.js v4.4.0
- **No Build Process**: Just open and run!
- **No Dependencies**: Everything works out of the box

## File Structure

```
pullups_graph/
├── index.html                # Main HTML structure with tab navigation
├── style.css                 # Beautiful gradient styling with chess theme
├── app.js                    # Data parsing and chart logic for both trackers
├── serve.py                  # Python server for data access (both files)
├── start_pullups_graph.sh    # Convenience script to start & open
└── README.md                 # This file
```

## Tab Navigation

The application features a clean tab interface:
- Click on **💪 Pullups** to view your pullup training progress
- Click on **♟️ Chess Puzzle Rush** to view your chess puzzle performance
- The subtitle updates dynamically based on the active tab
- Each tab maintains its own independent chart and statistics

## Statistics Explained

### Column 1 - Overall Statistics
- **Today's Total**: Sum of all pullups done today (includes all grip types)
- **Highest Day Ever**: The day with the most total pullups (includes all grip types)
- **This Week**: Total pullups from Monday to today (includes all grip types)
- **Highest Week Ever**: The week with the most total pullups (includes all grip types)
- **This Month**: Total pullups from the 1st to today (includes all grip types)
- **Highest Month Ever**: The month with the most total pullups (includes all grip types)

### Column 2 - Type-Specific Records (Color-Coded)
Each card is color-coded to match the chart colors, serving as both a legend and record tracker:
- **Best Wide** (Red): The single wide-grip session with the most pullups
- **Best Chin-up** (Green): The single chin-up session with the most pullups
- **Best Pull-up** (Orange): The single pull-up session with the most pullups
- **Best Dips** (Purple): The single dips session with the most reps

### Chess Statistics Explained

#### Column 1 - Overall Statistics
- **Today's Total**: Sum of all puzzles solved today (includes all modes)
- **Highest Day Ever**: The day with the most total puzzles solved (includes all modes)
- **This Week**: Total puzzles from Monday to today (includes all modes)
- **Highest Week Ever**: The week with the most total puzzles solved (includes all modes)
- **This Month**: Total puzzles from the 1st to today (includes all modes)
- **Highest Month Ever**: The month with the most total puzzles solved (includes all modes)

#### Column 2 - Mode-Specific Records (Color-Coded)
Each card is color-coded to match the chart colors:
- **Best 3-Minute** (Brown): The single 3-minute session with the most puzzles solved
- **Best 5-Minute** (Goldenrod): The single 5-minute session with the most puzzles solved
- **Best Survival** (Indigo): The single survival session with the most puzzles solved

## Customization

You can easily customize the appearance:
- Edit `style.css` to change gradient colors, tab styles, and chess theme elements
- Modify grip type colors in `app.js` (search for `pullupTypeColors` object)
- Modify chess mode colors in `app.js` (search for `chessModeColors` object)
- Adjust spacing, fonts, and sizes to your preference
- Customize the chess piece decorations in the CSS

## Setting Up a Hotkey

To bind the script to a hotkey in your desktop environment:

**GNOME/Ubuntu:**
1. Go to Settings → Keyboard → Keyboard Shortcuts
2. Click "+" to add a custom shortcut
3. Name: "Open Progress Tracker"
4. Command: `/home/twain/Projects/pullups_graph/start_pullups_graph.sh`
5. Set your preferred key combination

**KDE Plasma:**
1. System Settings → Shortcuts → Custom Shortcuts
2. Edit → New → Global Shortcut → Command/URL
3. Set the command and your preferred key combination

## Recent Updates

### 2025-11-28 20:46 UTC
- ✨ Added Dips exercise tracking
- 💜 Purple color scheme for dips in chart and statistics
- 🏆 Trophy system for dips records
- 📊 Dips count toward daily/weekly/monthly totals

### 2025-11-28 10:51 UTC
- ✨ Added Chess Puzzle Rush tracking tab
- 🎨 Implemented tab navigation system
- ♟️ Added chess-themed styling and decorations
- 📊 Dual-tracker system with independent charts and statistics
- 🏆 Trophy system for both pullups and chess records
- 📝 Support for multiple chess puzzle rush modes (3m, 5m, survival)

### 2025-11-27 13:03 UTC
- Initial pullups tracker release

---

*Last updated: 2025-11-28 20:46 UTC*