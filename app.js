// API endpoint for pullups data
const PULLUPS_API_ENDPOINT = '/api/pullups';

// Global variables
let chart = null;
let pullupsData = [];

// Parse the pullups data from the file content
function parsePullupsData(content) {
    const lines = content.trim().split('\n');
    const data = [];
    
    lines.forEach(line => {
        const match = line.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+>\s+(\d+)/);
        if (match) {
            const [, date, time, count] = match;
            data.push({
                date: date,
                time: time,
                datetime: `${date} ${time}`,
                count: parseInt(count)
            });
        }
    });
    
    return data;
}

// Load pullups data from API
async function loadPullupsData() {
    try {
        const response = await fetch(PULLUPS_API_ENDPOINT);
        const content = await response.text();
        pullupsData = parsePullupsData(content);
        
        if (pullupsData.length === 0) {
            console.error('No pullups data found');
            return;
        }
        
        updateChart();
        updateStatistics();
    } catch (error) {
        console.error('Error loading pullups data:', error);
        // For demo purposes, use sample data if file can't be loaded
        useSampleData();
    }
}

// Use sample data for demonstration
function useSampleData() {
    pullupsData = [
        { date: '2025-11-20', time: '14:51:30', datetime: '2025-11-20 14:51:30', count: 5 },
        { date: '2025-11-20', time: '18:51:34', datetime: '2025-11-20 18:51:34', count: 5 },
        { date: '2025-11-21', time: '18:51:34', datetime: '2025-11-21 18:51:34', count: 6 },
        { date: '2025-11-22', time: '12:20:54', datetime: '2025-11-22 12:20:54', count: 6 },
        { date: '2025-11-23', time: '17:52:43', datetime: '2025-11-23 17:52:43', count: 8 },
        { date: '2025-11-24', time: '12:13:07', datetime: '2025-11-24 12:13:07', count: 7 },
        { date: '2025-11-25', time: '12:31:25', datetime: '2025-11-25 12:31:25', count: 7 },
        { date: '2025-11-25', time: '15:01:27', datetime: '2025-11-25 15:01:27', count: 7 },
        { date: '2025-11-25', time: '18:51:19', datetime: '2025-11-25 18:51:19', count: 6 },
        { date: '2025-11-26', time: '11:55:47', datetime: '2025-11-26 11:55:47', count: 6 },
        { date: '2025-11-26', time: '11:59:36', datetime: '2025-11-26 11:59:36', count: 6 },
        { date: '2025-11-26', time: '14:09:50', datetime: '2025-11-26 14:09:50', count: 6 },
        { date: '2025-11-26', time: '14:37:38', datetime: '2025-11-26 14:37:38', count: 5 },
        { date: '2025-11-26', time: '15:36:45', datetime: '2025-11-26 15:36:45', count: 5 }
    ];
    
    updateChart();
    updateStatistics();
}

// Group data by date and calculate daily totals
function getDailyTotals() {
    const dailyTotals = {};
    
    pullupsData.forEach(entry => {
        if (!dailyTotals[entry.date]) {
            dailyTotals[entry.date] = {
                total: 0,
                sessions: []
            };
        }
        dailyTotals[entry.date].total += entry.count;
        dailyTotals[entry.date].sessions.push({
            time: entry.time,
            count: entry.count
        });
    });
    
    return dailyTotals;
}

// Get week number from date
function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo}`;
}

// Get month from date
function getMonth(date) {
    return date.substring(0, 7); // YYYY-MM
}

// Find the highest session
function findHighestSession() {
    let maxCount = 0;
    let maxInfo = null;
    
    pullupsData.forEach((entry, index) => {
        if (entry.count > maxCount) {
            maxCount = entry.count;
            maxInfo = {
                count: entry.count,
                date: entry.date,
                time: entry.time,
                index: index
            };
        }
    });
    
    return maxInfo;
}

// Update the chart
function updateChart() {
    const dailyTotals = getDailyTotals();
    const dates = Object.keys(dailyTotals).sort();
    
    // Find the highest session
    const highestSession = findHighestSession();
    
    // Prepare datasets for the chart
    const dailyTotalsData = dates.map(date => dailyTotals[date].total);
    
    // Create individual session datasets
    const sessionDatasets = [];
    const maxSessionsPerDay = Math.max(...Object.values(dailyTotals).map(d => d.sessions.length));
    
    // Define base colors: red, orange, green, blue, yellow, pink, gray
    const baseColors = [
        { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(220, 38, 38)' },      // red
        { bg: 'rgba(249, 115, 22, 0.7)', border: 'rgb(234, 88, 12)' },     // orange
        { bg: 'rgba(34, 197, 94, 0.7)', border: 'rgb(22, 163, 74)' },      // green
        { bg: 'rgba(59, 130, 246, 0.7)', border: 'rgb(37, 99, 235)' },     // blue
        { bg: 'rgba(234, 179, 8, 0.7)', border: 'rgb(202, 138, 4)' },      // yellow
        { bg: 'rgba(236, 72, 153, 0.7)', border: 'rgb(219, 39, 119)' },    // pink
        { bg: 'rgba(156, 163, 175, 0.7)', border: 'rgb(107, 114, 128)' }   // gray
    ];
    
    // Define dot colors (slightly darker versions for patterns)
    const dotColors = [
        'rgb(185, 28, 28)',   // dark red
        'rgb(194, 65, 12)',   // dark orange
        'rgb(21, 128, 61)',   // dark green
        'rgb(29, 78, 216)',   // dark blue
        'rgb(161, 98, 7)',    // dark yellow
        'rgb(190, 24, 93)',   // dark pink
        'rgb(75, 85, 99)'     // dark gray
    ];
    
    // Function to get color for session index
    function getSessionColor(index) {
        // First 7 sessions: solid colors
        if (index < 7) {
            return baseColors[index];
        }
        
        // After that: base color with dots
        // Pattern: red+dots, orange+dots, green+dots, etc.
        const baseIndex = Math.floor((index - 7) / 7) % 7;
        const dotIndex = (index - 7) % 7;
        
        return {
            bg: baseColors[baseIndex].bg,
            border: dotColors[dotIndex]
        };
    }
    
    for (let i = 0; i < maxSessionsPerDay; i++) {
        const sessionData = dates.map(date => {
            const sessions = dailyTotals[date].sessions;
            return sessions[i] ? sessions[i].count : null;
        });
        
        const colors = getSessionColor(i);
        
        sessionDatasets.push({
            label: `Session ${i + 1}`,
            data: sessionData,
            backgroundColor: colors.bg,
            borderColor: colors.border,
            borderWidth: 2,
            borderRadius: 6,
            stack: 'sessions'
        });
    }
    
    // Find the date with highest daily total
    let highestDayTotal = 0;
    let highestDayIndex = -1;
    dates.forEach((date, index) => {
        if (dailyTotals[date].total > highestDayTotal) {
            highestDayTotal = dailyTotals[date].total;
            highestDayIndex = index;
        }
    });
    
    // Trophy plugin to draw trophy on highest session and highest day
    const trophyPlugin = {
        id: 'trophyPlugin',
        afterDatasetsDraw: function(chart) {
            if (!highestSession) {
                console.log('No highest session found');
                return;
            }
            
            const ctx = chart.ctx;
            
            // Find the bar corresponding to the highest session
            let targetDatasetIndex = -1;
            let targetIndex = -1;
            
            // Map the highest session to its position in the chart
            dates.forEach((date, dateIndex) => {
                const sessions = dailyTotals[date].sessions;
                sessions.forEach((session, sessionIndex) => {
                    if (session.count === highestSession.count &&
                        session.time === highestSession.time &&
                        date === highestSession.date) {
                        targetDatasetIndex = sessionIndex;
                        targetIndex = dateIndex;
                    }
                });
            });
            
            console.log('Trophy target:', { targetDatasetIndex, targetIndex, highestSession });
            
            // Draw trophy on highest session bar
            if (targetDatasetIndex >= 0 && targetIndex >= 0) {
                const datasetMeta = chart.getDatasetMeta(targetDatasetIndex);
                if (datasetMeta && datasetMeta.data[targetIndex]) {
                    const targetBar = datasetMeta.data[targetIndex];
                    
                    // Position trophy in the center of the bar segment
                    const x = targetBar.x;
                    // Calculate the middle of the bar segment
                    const barHeight = targetBar.base - targetBar.y;
                    const y = targetBar.y + (barHeight / 2);
                    
                    console.log('Drawing trophy at:', { x, y, barY: targetBar.y, barBase: targetBar.base, barHeight });
                    
                    ctx.save();
                    ctx.font = 'bold 24px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // Add a subtle glow effect
                    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                    ctx.shadowBlur = 15;
                    ctx.fillText('🏆', x, y);
                    
                    ctx.restore();
                } else {
                    console.log('Bar element not found');
                }
            } else {
                console.log('Target indices not found');
            }
            
            // Draw smaller trophy next to the date with highest daily total
            if (highestDayIndex >= 0) {
                const xScale = chart.scales.x;
                const yScale = chart.scales.y;
                
                // Get the x position of the highest day
                const xPos = xScale.getPixelForValue(highestDayIndex);
                // Position to the right of the date label
                const yPos = yScale.bottom + 15;
                
                ctx.save();
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                
                // Add a subtle glow effect
                ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
                ctx.shadowBlur = 10;
                // Position trophy to the right of the date label
                ctx.fillText('🏆', xPos + 25, yPos);
                
                ctx.restore();
            }
        }
    };
    
    const ctx = document.getElementById('pullupsChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates.map(date => {
                const d = new Date(date);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: sessionDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Daily Pullups Progress',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const dateIndex = context[0].dataIndex;
                            return dates[dateIndex];
                        },
                        afterTitle: function(context) {
                            const dateIndex = context[0].dataIndex;
                            const date = dates[dateIndex];
                            const total = dailyTotals[date].total;
                            return `Daily Total: ${total} pullups`;
                        },
                        label: function(context) {
                            const sessionNum = context.datasetIndex + 1;
                            const count = context.parsed.y;
                            if (count === null) return null;
                            const dateIndex = context.dataIndex;
                            const date = dates[dateIndex];
                            const time = dailyTotals[date].sessions[context.datasetIndex].time;
                            return `Session ${sessionNum} (${time}): ${count} pullups`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Pullups',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        },
        plugins: [trophyPlugin]
    });
}

// Update statistics
function updateStatistics() {
    const dailyTotals = getDailyTotals();
    const dates = Object.keys(dailyTotals).sort();
    const today = new Date().toISOString().split('T')[0];
    
    // Today's total
    const todayTotal = dailyTotals[today]?.total || 0;
    document.getElementById('todayTotal').textContent = todayTotal;
    document.querySelector('#todayTotal').parentElement.setAttribute('data-tooltip', today);
    
    // Highest day ever
    let highestDay = 0;
    let highestDayDate = '';
    dates.forEach(date => {
        if (dailyTotals[date].total > highestDay) {
            highestDay = dailyTotals[date].total;
            highestDayDate = date;
        }
    });
    document.getElementById('highestDay').textContent = highestDay;
    document.querySelector('#highestDay').parentElement.setAttribute('data-tooltip', highestDayDate);
    
    // Weekly totals
    const weeklyTotals = {};
    dates.forEach(date => {
        const week = getWeekNumber(date);
        if (!weeklyTotals[week]) {
            weeklyTotals[week] = { total: 0, dates: [] };
        }
        weeklyTotals[week].total += dailyTotals[date].total;
        weeklyTotals[week].dates.push(date);
    });
    
    const currentWeek = getWeekNumber(today);
    const thisWeekTotal = weeklyTotals[currentWeek]?.total || 0;
    const thisWeekDates = weeklyTotals[currentWeek]?.dates || [];
    const thisWeekRange = thisWeekDates.length > 0 
        ? `${thisWeekDates[0]} to ${thisWeekDates[thisWeekDates.length - 1]}`
        : currentWeek;
    
    document.getElementById('thisWeek').textContent = thisWeekTotal;
    document.querySelector('#thisWeek').parentElement.setAttribute('data-tooltip', thisWeekRange);
    
    // Highest week ever
    let highestWeek = 0;
    let highestWeekKey = '';
    Object.entries(weeklyTotals).forEach(([week, data]) => {
        if (data.total > highestWeek) {
            highestWeek = data.total;
            highestWeekKey = week;
        }
    });
    const highestWeekDates = weeklyTotals[highestWeekKey]?.dates || [];
    const highestWeekRange = highestWeekDates.length > 0
        ? `${highestWeekDates[0]} to ${highestWeekDates[highestWeekDates.length - 1]}`
        : highestWeekKey;
    
    document.getElementById('highestWeek').textContent = highestWeek;
    document.querySelector('#highestWeek').parentElement.setAttribute('data-tooltip', highestWeekRange);
    
    // Monthly totals
    const monthlyTotals = {};
    dates.forEach(date => {
        const month = getMonth(date);
        if (!monthlyTotals[month]) {
            monthlyTotals[month] = { total: 0, dates: [] };
        }
        monthlyTotals[month].total += dailyTotals[date].total;
        monthlyTotals[month].dates.push(date);
    });
    
    const currentMonth = getMonth(today);
    const thisMonthTotal = monthlyTotals[currentMonth]?.total || 0;
    const thisMonthDates = monthlyTotals[currentMonth]?.dates || [];
    const thisMonthRange = thisMonthDates.length > 0
        ? `${thisMonthDates[0]} to ${thisMonthDates[thisMonthDates.length - 1]}`
        : currentMonth;
    
    document.getElementById('thisMonth').textContent = thisMonthTotal;
    document.querySelector('#thisMonth').parentElement.setAttribute('data-tooltip', thisMonthRange);
    
    // Highest month ever
    let highestMonth = 0;
    let highestMonthKey = '';
    Object.entries(monthlyTotals).forEach(([month, data]) => {
        if (data.total > highestMonth) {
            highestMonth = data.total;
            highestMonthKey = month;
        }
    });
    const highestMonthDates = monthlyTotals[highestMonthKey]?.dates || [];
    const highestMonthRange = highestMonthDates.length > 0
        ? `${highestMonthDates[0]} to ${highestMonthDates[highestMonthDates.length - 1]}`
        : highestMonthKey;
    
    document.getElementById('highestMonth').textContent = highestMonth;
    document.querySelector('#highestMonth').parentElement.setAttribute('data-tooltip', highestMonthRange);
    
    // Highest session
    let highestSession = 0;
    let highestSessionDate = '';
    pullupsData.forEach(entry => {
        if (entry.count > highestSession) {
            highestSession = entry.count;
            highestSessionDate = entry.datetime;
        }
    });
    document.getElementById('highestSession').textContent = highestSession;
    document.querySelector('#highestSession').parentElement.setAttribute('data-tooltip', highestSessionDate);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadPullupsData();
});