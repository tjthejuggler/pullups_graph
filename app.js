// API endpoints
const PULLUPS_API_ENDPOINT = '/api/pullups';
const CHESS_API_ENDPOINT = '/api/chess';

// Global variables
let pullupsChart = null;
let chessChart = null;
let pullupsData = [];
let chessData = [];
let currentTab = 'pullups';

// Parse the pullups data from the file content
function parsePullupsData(content) {
    const lines = content.trim().split('\n');
    const data = [];
    
    lines.forEach(line => {
        // Match regular, wide pullups (w suffix), chin-ups (c suffix), pull-ups (p suffix), and dips (d suffix)
        const match = line.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+>\s+(\d+)([wcpd])?/);
        if (match) {
            const [, date, time, count, suffix] = match;
            data.push({
                date: date,
                time: time,
                datetime: `${date} ${time}`,
                count: parseInt(count),
                isWide: suffix === 'w',
                isChinup: suffix === 'c',
                isPullup: suffix === 'p',
                isDips: suffix === 'd'
            });
        }
    });
    
    return data;
}

// Parse chess puzzle rush data
function parseChessData(content) {
    const lines = content.trim().split('\n');
    const data = [];
    
    console.log('Chess data content:', content);
    console.log('Chess data lines:', lines);
    
    lines.forEach(line => {
        // Match format: 2025-11-28 10:10:59 m3 11 or 3m 11 or s 11
        const match = line.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+(m3|m5|3m|5m|s)\s+(\d+)/);
        console.log('Line:', line, 'Match:', match);
        if (match) {
            const [, date, time, modeRaw, count] = match;
            // Normalize mode format (m3 -> 3m, m5 -> 5m)
            let mode = modeRaw;
            if (modeRaw === 'm3') mode = '3m';
            if (modeRaw === 'm5') mode = '5m';
            
            const entry = {
                date: date,
                time: time,
                datetime: `${date} ${time}`,
                count: parseInt(count),
                mode: mode, // '3m', '5m', or 's'
                is3m: mode === '3m',
                is5m: mode === '5m',
                isSurvival: mode === 's'
            };
            console.log('Parsed chess entry:', entry);
            data.push(entry);
        }
    });
    
    console.log('Total chess entries parsed:', data.length);
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
        
        updatePullupsChart();
        updatePullupsStatistics();
    } catch (error) {
        console.error('Error loading pullups data:', error);
        useSampleData();
    }
}

// Load chess data from API
async function loadChessData() {
    try {
        console.log('Fetching chess data from:', CHESS_API_ENDPOINT);
        const response = await fetch(CHESS_API_ENDPOINT);
        console.log('Chess API response status:', response.status);
        const content = await response.text();
        console.log('Chess API content:', content);
        chessData = parseChessData(content);
        
        if (chessData.length === 0) {
            console.error('No chess data found');
            return;
        }
        
        console.log('Updating chess chart with', chessData.length, 'entries');
        updateChessChart();
        updateChessStatistics();
    } catch (error) {
        console.error('Error loading chess data:', error);
    }
}

// Use sample data for demonstration
function useSampleData() {
    pullupsData = [
        { date: '2025-11-20', time: '14:51:30', datetime: '2025-11-20 14:51:30', count: 5, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-20', time: '18:51:34', datetime: '2025-11-20 18:51:34', count: 5, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-21', time: '18:51:34', datetime: '2025-11-21 18:51:34', count: 6, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-22', time: '12:20:54', datetime: '2025-11-22 12:20:54', count: 6, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-23', time: '17:52:43', datetime: '2025-11-23 17:52:43', count: 8, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-24', time: '12:13:07', datetime: '2025-11-24 12:13:07', count: 7, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-25', time: '12:31:25', datetime: '2025-11-25 12:31:25', count: 7, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-25', time: '15:01:27', datetime: '2025-11-25 15:01:27', count: 7, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-25', time: '18:51:19', datetime: '2025-11-25 18:51:19', count: 6, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-26', time: '11:55:47', datetime: '2025-11-26 11:55:47', count: 6, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-26', time: '11:59:36', datetime: '2025-11-26 11:59:36', count: 6, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-26', time: '14:09:50', datetime: '2025-11-26 14:09:50', count: 6, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-26', time: '14:37:38', datetime: '2025-11-26 14:37:38', count: 5, isWide: false, isChinup: false, isPullup: false },
        { date: '2025-11-26', time: '15:36:45', datetime: '2025-11-26 15:36:45', count: 5, isWide: false, isChinup: false, isPullup: false }
    ];
    
    updatePullupsChart();
    updatePullupsStatistics();
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
            count: entry.count,
            isWide: entry.isWide,
            isChinup: entry.isChinup,
            isPullup: entry.isPullup,
            isDips: entry.isDips
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


// Find the highest wide session
function findHighestWideSession() {
    let maxCount = 0;
    let maxInfo = null;
    
    pullupsData.forEach((entry, index) => {
        if (entry.isWide && entry.count > maxCount) {
            maxCount = entry.count;
            maxInfo = {
                count: entry.count,
                date: entry.date,
                time: entry.time,
                index: index,
                isWide: true
            };
        }
    });
    
    return maxInfo;
}

// Find the highest chin-up session
function findHighestChinupSession() {
    let maxCount = 0;
    let maxInfo = null;
    
    pullupsData.forEach((entry, index) => {
        if (entry.isChinup && entry.count > maxCount) {
            maxCount = entry.count;
            maxInfo = {
                count: entry.count,
                date: entry.date,
                time: entry.time,
                index: index,
                isChinup: true
            };
        }
    });
    
    return maxInfo;
}

// Find the highest pull-up session
function findHighestPullupSession() {
    let maxCount = 0;
    let maxInfo = null;
    
    pullupsData.forEach((entry, index) => {
        if (entry.isPullup && entry.count > maxCount) {
            maxCount = entry.count;
            maxInfo = {
                count: entry.count,
                date: entry.date,
                time: entry.time,
                index: index,
                isPullup: true
            };
        }
    });
    
    return maxInfo;
}

// Find the highest dips session
function findHighestDipsSession() {
    let maxCount = 0;
    let maxInfo = null;
    
    pullupsData.forEach((entry, index) => {
        if (entry.isDips && entry.count > maxCount) {
            maxCount = entry.count;
            maxInfo = {
                count: entry.count,
                date: entry.date,
                time: entry.time,
                index: index,
                isDips: true
            };
        }
    });
    
    return maxInfo;
}

// Update the pullups chart
function updatePullupsChart() {
    const dailyTotals = getDailyTotals();
    const dates = Object.keys(dailyTotals).sort();
    
    // Prepare datasets for the chart
    const dailyTotalsData = dates.map(date => dailyTotals[date].total);
    
    // Create individual session datasets
    const sessionDatasets = [];
    const maxSessionsPerDay = Math.max(...Object.values(dailyTotals).map(d => d.sessions.length));
    
    // Define colors for different pullup types
    const pullupTypeColors = {
        regular: { bg: 'rgba(59, 130, 246, 0.7)', border: 'rgb(37, 99, 235)' },    // blue for regular
        wide: { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(220, 38, 38)' },        // red for wide
        chinup: { bg: 'rgba(34, 197, 94, 0.7)', border: 'rgb(22, 163, 74)' },      // green for chin-ups
        pullup: { bg: 'rgba(249, 115, 22, 0.7)', border: 'rgb(234, 88, 12)' },     // orange for pull-ups
        dips: { bg: 'rgba(168, 85, 247, 0.7)', border: 'rgb(147, 51, 234)' }       // purple for dips
    };
    
    // Function to get color based on pullup type
    function getColorForSession(session) {
        if (session.isWide) {
            return pullupTypeColors.wide;
        } else if (session.isChinup) {
            return pullupTypeColors.chinup;
        } else if (session.isPullup) {
            return pullupTypeColors.pullup;
        } else if (session.isDips) {
            return pullupTypeColors.dips;
        } else {
            return pullupTypeColors.regular;
        }
    }
    
    for (let i = 0; i < maxSessionsPerDay; i++) {
        const sessionData = dates.map(date => {
            const sessions = dailyTotals[date].sessions;
            return sessions[i] ? sessions[i].count : null;
        });
        
        // Get colors for each data point based on session type
        const backgroundColors = dates.map(date => {
            const sessions = dailyTotals[date].sessions;
            if (sessions[i]) {
                return getColorForSession(sessions[i]).bg;
            }
            return 'rgba(200, 200, 200, 0.7)';
        });
        
        const borderColors = dates.map(date => {
            const sessions = dailyTotals[date].sessions;
            if (sessions[i]) {
                return getColorForSession(sessions[i]).border;
            }
            return 'rgb(150, 150, 150)';
        });
        
        sessionDatasets.push({
            label: `Session ${i + 1}`,
            data: sessionData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
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
    
    // Get highest session info for each type
    const highestWideSession = findHighestWideSession();
    const highestChinupSession = findHighestChinupSession();
    const highestPullupSession = findHighestPullupSession();
    const highestDipsSession = findHighestDipsSession();
    
    // Trophy plugin to draw trophy on highest session, highest day, and grip type trophies
    const trophyPlugin = {
        id: 'trophyPlugin',
        afterDatasetsDraw: function(chart) {
            const ctx = chart.ctx;
            
            // Draw trophies for highest sessions of each type
            dates.forEach((date, dateIndex) => {
                const sessions = dailyTotals[date].sessions;
                sessions.forEach((session, sessionIndex) => {
                    const datasetMeta = chart.getDatasetMeta(sessionIndex);
                    if (datasetMeta && datasetMeta.data[dateIndex]) {
                        const bar = datasetMeta.data[dateIndex];
                        const x = bar.x;
                        const y = bar.y + 8;
                        
                        // Trophy for highest wide session
                        if (session.isWide && highestWideSession &&
                            session.count === highestWideSession.count &&
                            session.time === highestWideSession.time &&
                            date === highestWideSession.date) {
                            ctx.save();
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                            ctx.shadowBlur = 8;
                            ctx.fillText('🏆', x, y);
                            ctx.restore();
                        }
                        
                        // Trophy for highest chin-up session
                        if (session.isChinup && highestChinupSession &&
                            session.count === highestChinupSession.count &&
                            session.time === highestChinupSession.time &&
                            date === highestChinupSession.date) {
                            ctx.save();
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                            ctx.shadowBlur = 8;
                            ctx.fillText('🏆', x, y);
                            ctx.restore();
                        }
                        
                        // Trophy for highest pull-up session
                        if (session.isPullup && highestPullupSession &&
                            session.count === highestPullupSession.count &&
                            session.time === highestPullupSession.time &&
                            date === highestPullupSession.date) {
                            ctx.save();
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                            ctx.shadowBlur = 8;
                            ctx.fillText('🏆', x, y);
                            ctx.restore();
                        }
                        
                        // Trophy for highest dips session
                        if (session.isDips && highestDipsSession &&
                            session.count === highestDipsSession.count &&
                            session.time === highestDipsSession.time &&
                            date === highestDipsSession.date) {
                            ctx.save();
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                            ctx.shadowBlur = 8;
                            ctx.fillText('🏆', x, y);
                            ctx.restore();
                        }
                    }
                });
            });
            
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
    
    if (pullupsChart) {
        pullupsChart.destroy();
    }
    
    pullupsChart = new Chart(ctx, {
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
                            const session = dailyTotals[date].sessions[context.datasetIndex];
                            const time = session.time;
                            
                            // Determine pullup type
                            let type = 'Regular';
                            if (session.isWide) type = 'Wide';
                            else if (session.isChinup) type = 'Chin-up';
                            else if (session.isPullup) type = 'Pull-up';
                            else if (session.isDips) type = 'Dips';
                            
                            return `Session ${sessionNum} (${time}): ${count} ${type}`;
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

// Update pullups statistics
function updatePullupsStatistics() {
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
    
    // Highest wide session
    let highestWideSession = 0;
    let highestWideSessionDate = '';
    pullupsData.forEach(entry => {
        if (entry.isWide && entry.count > highestWideSession) {
            highestWideSession = entry.count;
            highestWideSessionDate = entry.datetime;
        }
    });
    const wideSessionElement = document.getElementById('highestWideSession');
    if (wideSessionElement) {
        wideSessionElement.textContent = highestWideSession || '-';
        wideSessionElement.parentElement.setAttribute('data-tooltip', highestWideSessionDate || '');
    }
    
    // Highest chin-up session
    let highestChinupSession = 0;
    let highestChinupSessionDate = '';
    pullupsData.forEach(entry => {
        if (entry.isChinup && entry.count > highestChinupSession) {
            highestChinupSession = entry.count;
            highestChinupSessionDate = entry.datetime;
        }
    });
    const chinupSessionElement = document.getElementById('highestChinupSession');
    if (chinupSessionElement) {
        chinupSessionElement.textContent = highestChinupSession || '-';
        chinupSessionElement.parentElement.setAttribute('data-tooltip', highestChinupSessionDate || '');
    }
    
    // Highest pull-up session
    let highestPullupSession = 0;
    let highestPullupSessionDate = '';
    pullupsData.forEach(entry => {
        if (entry.isPullup && entry.count > highestPullupSession) {
            highestPullupSession = entry.count;
            highestPullupSessionDate = entry.datetime;
        }
    });
    const pullupSessionElement = document.getElementById('highestPullupSession');
    if (pullupSessionElement) {
        pullupSessionElement.textContent = highestPullupSession || '-';
        pullupSessionElement.parentElement.setAttribute('data-tooltip', highestPullupSessionDate || '');
    }
    
    // Highest dips session
    let highestDipsSession = 0;
    let highestDipsSessionDate = '';
    pullupsData.forEach(entry => {
        if (entry.isDips && entry.count > highestDipsSession) {
            highestDipsSession = entry.count;
            highestDipsSessionDate = entry.datetime;
        }
    });
    const dipsSessionElement = document.getElementById('highestDipsSession');
    if (dipsSessionElement) {
        dipsSessionElement.textContent = highestDipsSession || '-';
        dipsSessionElement.parentElement.setAttribute('data-tooltip', highestDipsSessionDate || '');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadPullupsData();
});

// Chess-specific functions
function getChessDailyTotals() {
    const dailyTotals = {};
    
    chessData.forEach(entry => {
        if (!dailyTotals[entry.date]) {
            dailyTotals[entry.date] = {
                total: 0,
                sessions: []
            };
        }
        dailyTotals[entry.date].total += entry.count;
        dailyTotals[entry.date].sessions.push({
            time: entry.time,
            count: entry.count,
            mode: entry.mode,
            is3m: entry.is3m,
            is5m: entry.is5m,
            isSurvival: entry.isSurvival
        });
    });
    
    return dailyTotals;
}

// Update the chess chart
function updateChessChart() {
    const dailyTotals = getChessDailyTotals();
    const dates = Object.keys(dailyTotals).sort();
    
    // Create individual session datasets
    const sessionDatasets = [];
    const maxSessionsPerDay = Math.max(...Object.values(dailyTotals).map(d => d.sessions.length));
    
    // Define colors for different chess modes with chess theme
    const chessModeColors = {
        '3m': { bg: 'rgba(139, 69, 19, 0.7)', border: 'rgb(101, 50, 13)' },      // brown for 3m
        '5m': { bg: 'rgba(218, 165, 32, 0.7)', border: 'rgb(184, 134, 11)' },    // goldenrod for 5m
        's': { bg: 'rgba(75, 0, 130, 0.7)', border: 'rgb(54, 0, 94)' }           // indigo for survival
    };
    
    function getColorForChessSession(session) {
        return chessModeColors[session.mode] || chessModeColors['3m'];
    }
    
    for (let i = 0; i < maxSessionsPerDay; i++) {
        const sessionData = dates.map(date => {
            const sessions = dailyTotals[date].sessions;
            return sessions[i] ? sessions[i].count : null;
        });
        
        const backgroundColors = dates.map(date => {
            const sessions = dailyTotals[date].sessions;
            if (sessions[i]) {
                return getColorForChessSession(sessions[i]).bg;
            }
            return 'rgba(200, 200, 200, 0.7)';
        });
        
        const borderColors = dates.map(date => {
            const sessions = dailyTotals[date].sessions;
            if (sessions[i]) {
                return getColorForChessSession(sessions[i]).border;
            }
            return 'rgb(150, 150, 150)';
        });
        
        sessionDatasets.push({
            label: `Session ${i + 1}`,
            data: sessionData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            borderRadius: 6,
            stack: 'sessions'
        });
    }
    
    // Find highest day
    let highestDayTotal = 0;
    let highestDayIndex = -1;
    dates.forEach((date, index) => {
        if (dailyTotals[date].total > highestDayTotal) {
            highestDayTotal = dailyTotals[date].total;
            highestDayIndex = index;
        }
    });
    
    // Find records for each mode
    const records = {
        '3m': { count: 0, date: '', time: '' },
        '5m': { count: 0, date: '', time: '' },
        's': { count: 0, date: '', time: '' }
    };
    
    chessData.forEach(entry => {
        if (entry.count > records[entry.mode].count) {
            records[entry.mode] = {
                count: entry.count,
                date: entry.date,
                time: entry.time
            };
        }
    });
    
    // Trophy plugin for chess
    const chessTrophyPlugin = {
        id: 'chessTrophyPlugin',
        afterDatasetsDraw: function(chart) {
            const ctx = chart.ctx;
            
            // Draw trophies for record sessions
            dates.forEach((date, dateIndex) => {
                const sessions = dailyTotals[date].sessions;
                sessions.forEach((session, sessionIndex) => {
                    const datasetMeta = chart.getDatasetMeta(sessionIndex);
                    if (datasetMeta && datasetMeta.data[dateIndex]) {
                        const bar = datasetMeta.data[dateIndex];
                        const x = bar.x;
                        const y = bar.y + 8;
                        
                        const record = records[session.mode];
                        if (session.count === record.count &&
                            session.time === record.time &&
                            date === record.date) {
                            ctx.save();
                            ctx.font = 'bold 12px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
                            ctx.shadowBlur = 8;
                            ctx.fillText('🏆', x, y);
                            ctx.restore();
                        }
                    }
                });
            });
            
            // Draw trophy for highest day
            if (highestDayIndex >= 0) {
                const xScale = chart.scales.x;
                const yScale = chart.scales.y;
                const xPos = xScale.getPixelForValue(highestDayIndex);
                const yPos = yScale.bottom + 15;
                
                ctx.save();
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
                ctx.shadowBlur = 10;
                ctx.fillText('🏆', xPos + 25, yPos);
                ctx.restore();
            }
        }
    };
    
    const ctx = document.getElementById('chessChart').getContext('2d');
    
    if (chessChart) {
        chessChart.destroy();
    }
    
    chessChart = new Chart(ctx, {
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
                    text: 'Chess Puzzle Rush Progress',
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
                            return `Daily Total: ${total} puzzles`;
                        },
                        label: function(context) {
                            const sessionNum = context.datasetIndex + 1;
                            const count = context.parsed.y;
                            if (count === null) return null;
                            const dateIndex = context.dataIndex;
                            const date = dates[dateIndex];
                            const session = dailyTotals[date].sessions[context.datasetIndex];
                            const time = session.time;
                            
                            let modeName = session.mode === '3m' ? '3-Minute' : 
                                          session.mode === '5m' ? '5-Minute' : 'Survival';
                            
                            return `Session ${sessionNum} (${time}): ${count} ${modeName}`;
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
                        text: 'Puzzles Solved',
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
        plugins: [chessTrophyPlugin]
    });
}

// Update chess statistics
function updateChessStatistics() {
    const dailyTotals = getChessDailyTotals();
    const dates = Object.keys(dailyTotals).sort();
    const today = new Date().toISOString().split('T')[0];
    
    // Today's total
    const todayTotal = dailyTotals[today]?.total || 0;
    document.getElementById('chessTodayTotal').textContent = todayTotal;
    document.querySelector('#chessTodayTotal').parentElement.setAttribute('data-tooltip', today);
    
    // Highest day ever
    let highestDay = 0;
    let highestDayDate = '';
    dates.forEach(date => {
        if (dailyTotals[date].total > highestDay) {
            highestDay = dailyTotals[date].total;
            highestDayDate = date;
        }
    });
    document.getElementById('chessHighestDay').textContent = highestDay;
    document.querySelector('#chessHighestDay').parentElement.setAttribute('data-tooltip', highestDayDate);
    
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
    
    document.getElementById('chessThisWeek').textContent = thisWeekTotal;
    document.querySelector('#chessThisWeek').parentElement.setAttribute('data-tooltip', thisWeekRange);
    
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
    
    document.getElementById('chessHighestWeek').textContent = highestWeek;
    document.querySelector('#chessHighestWeek').parentElement.setAttribute('data-tooltip', highestWeekRange);
    
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
    
    document.getElementById('chessThisMonth').textContent = thisMonthTotal;
    document.querySelector('#chessThisMonth').parentElement.setAttribute('data-tooltip', thisMonthRange);
    
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
    
    document.getElementById('chessHighestMonth').textContent = highestMonth;
    document.querySelector('#chessHighestMonth').parentElement.setAttribute('data-tooltip', highestMonthRange);
    
    // Records for each mode
    let record3m = 0;
    let record3mDate = '';
    let record5m = 0;
    let record5mDate = '';
    let recordSurvival = 0;
    let recordSurvivalDate = '';
    
    chessData.forEach(entry => {
        if (entry.is3m && entry.count > record3m) {
            record3m = entry.count;
            record3mDate = entry.datetime;
        }
        if (entry.is5m && entry.count > record5m) {
            record5m = entry.count;
            record5mDate = entry.datetime;
        }
        if (entry.isSurvival && entry.count > recordSurvival) {
            recordSurvival = entry.count;
            recordSurvivalDate = entry.datetime;
        }
    });
    
    document.getElementById('chess3mRecord').textContent = record3m || '-';
    document.querySelector('#chess3mRecord').parentElement.setAttribute('data-tooltip', record3mDate || '');
    
    document.getElementById('chess5mRecord').textContent = record5m || '-';
    document.querySelector('#chess5mRecord').parentElement.setAttribute('data-tooltip', record5mDate || '');
    
    document.getElementById('chessSurvivalRecord').textContent = recordSurvival || '-';
    document.querySelector('#chessSurvivalRecord').parentElement.setAttribute('data-tooltip', recordSurvivalDate || '');
}

// Tab switching functionality
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update content visibility
    document.getElementById('pullups-content').classList.toggle('hidden', tabName !== 'pullups');
    document.getElementById('chess-content').classList.toggle('hidden', tabName !== 'chess');
    
    // Update subtitle
    const subtitle = document.getElementById('subtitle');
    if (tabName === 'pullups') {
        subtitle.textContent = 'Track your daily pullup sessions and progress';
    } else {
        subtitle.textContent = 'Track your chess puzzle rush performance';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadPullupsData();
    loadChessData();
    
    // Setup tab switching
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
});