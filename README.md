# 💪 Pullups Progress Tracker

A beautiful and intuitive web application to visualize your daily pullup progress from your training log.

## Features

- **Interactive Stacked Bar Chart**: View all your pullup sessions stacked by day
- **Session-by-Session Breakdown**: Each session is color-coded and displayed separately
- **Comprehensive Statistics Panel**:
  - Today's total pullups
  - Highest day ever (with date on hover)
  - This week's total (with date range on hover)
  - Highest week ever (with date range on hover)
  - This month's total (with date range on hover)
  - Highest month ever (with date range on hover)
  - Best single session (with date/time on hover)
- **Hover Tooltips**: Hover over any stat card to see the exact date or date range
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Auto-Updates**: Reads the latest data from your Pullups.md file each time you load the page

## How to Use

### Recommended: Run the Custom Server

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

## Data Format

The application reads from `/home/twain/noteVault/Pullups.md` with the following format:

```
2025-11-26 11:55:47 > 6
2025-11-26 11:59:36 > 6
2025-11-26 14:09:50 > 6
```

Each line represents:
- Date (YYYY-MM-DD)
- Time (HH:MM:SS)
- `>` separator
- Number of pullups in that session

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **Chart Library**: Chart.js v4.4.0
- **No Build Process**: Just open and run!
- **No Dependencies**: Everything works out of the box

## File Structure

```
pullups_graph/
├── index.html      # Main HTML structure
├── style.css       # Beautiful gradient styling
├── app.js          # Data parsing and chart logic
└── README.md       # This file
```

## Statistics Explained

- **Today's Total**: Sum of all pullups done today
- **Highest Day Ever**: The day with the most total pullups
- **This Week**: Total pullups from Monday to today
- **Highest Week Ever**: The week with the most total pullups
- **This Month**: Total pullups from the 1st to today
- **Highest Month Ever**: The month with the most total pullups
- **Best Session**: The single session with the most pullups

## Customization

You can easily customize the appearance by editing `style.css`:
- Change gradient colors in the `.stat-card` classes
- Modify chart colors in `app.js` (search for `hsla` values)
- Adjust spacing, fonts, and sizes to your preference

---

*Last updated: 2025-11-26*