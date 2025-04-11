// Real-time market news and data updates using client-side techniques
// No external API dependencies - uses simulated data with real timestamps

// Indian stock symbols (without .NS suffix)
const indianStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
                     'HINDUNILVR', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'LT'];

// Global state for market data
let marketState = {
    lastUpdate: new Date(),
    indices: [
        { symbol: '^GSPC', name: 'S&P 500', price: 5432.18, change: 26.41, percentChange: 0.49, isPositive: true },
        { symbol: '^IXIC', name: 'NASDAQ', price: 18768.54, change: 112.17, percentChange: 0.65, isPositive: true },
        { symbol: '^DJI', name: 'DOW JONES', price: 42135.76, change: -31.08, percentChange: -0.07, isPositive: false },
        { symbol: '^RUT', name: 'RUSSELL 2000', price: 2486.23, change: 17.42, percentChange: 0.71, isPositive: true }
    ],
    sentimentScore: 65,
    sectors: [
        { name: 'Technology', performance: 1.8, isPositive: true },
        { name: 'Healthcare', performance: 1.2, isPositive: true },
        { name: 'Consumer Discretionary', performance: 0.7, isPositive: true },
        { name: 'Financials', performance: 0.3, isPositive: true },
        { name: 'Utilities', performance: -0.5, isPositive: false },
        { name: 'Energy', performance: -1.2, isPositive: false }
    ],
    trendingTopics: [
        { tag: '#FedRates', count: 127 },
        { tag: '#TechEarnings', count: 98 },
        { tag: '#BitcoinETF', count: 85 },
        { tag: '#ConsumerSpending', count: 64 },
        { tag: '#RenewableEnergy', count: 52 },
        { tag: '#ArtificialIntelligence', count: 48 }
    ],
    newsCount: 0,
    loadedNews: []
};

// News data source - pre-generated templates that will be populated with real timestamps
const newsTemplates = [
    {
        source: 'Bloomberg',
        category: 'Markets',
        title: 'Global Markets Respond to Latest Economic Indicators',
        description: 'Markets are adjusting positions as new economic data suggests stronger than expected growth in key regions, with technology and financial sectors leading gains.',
        tickers: ['SPY', 'QQQ', 'XLF']
    },
    {
        source: 'Reuters',
        category: 'Technology',
        title: 'Tech Sector Surges on Positive Earnings Forecasts',
        description: 'Technology companies are seeing significant share price increases as analysts revise earnings forecasts upward following stronger than expected consumer demand.',
        tickers: ['AAPL', 'MSFT', 'GOOG']
    },
    {
        source: 'CNBC',
        category: 'Cryptocurrency',
        title: 'Cryptocurrency Markets Show Increased Volatility',
        description: 'Digital asset markets are experiencing heightened volatility as traders respond to regulatory developments and increasing institutional participation.',
        tickers: ['BTC', 'ETH', 'SOL']
    },
    {
        source: 'Financial Times',
        category: 'Economy',
        title: 'Consumer Confidence Index Shows Unexpected Rise',
        description: 'The latest consumer confidence data indicates a significant improvement in economic outlook among households, potentially signaling stronger retail spending.',
        tickers: ['XLY', 'XRT', 'WMT']
    },
    {
        source: 'Wall Street Journal',
        category: 'Energy',
        title: 'Oil Prices Fluctuate as Supply Concerns Emerge',
        description: 'Crude oil markets are seeing increased volatility as new supply constraints coincide with changing demand forecasts in major economies.',
        tickers: ['XLE', 'CVX', 'XOM']
    },
    {
        source: 'MarketWatch',
        category: 'Healthcare',
        title: 'Healthcare Sector Rallies on New Treatment Approvals',
        description: 'Major pharmaceutical companies are seeing share price increases following regulatory approval for several key treatments targeting chronic conditions.',
        tickers: ['XLV', 'JNJ', 'PFE']
    },
    {
        source: 'Yahoo Finance',
        category: 'Markets',
        title: 'Market Volatility Increases as Earnings Season Approaches',
        description: 'Stock markets are experiencing increased volatility as investors position ahead of the upcoming earnings season, with focus on technology and financial sectors.',
        tickers: ['VIX', 'SPY', 'QQQ']
    },
    {
        source: 'Business Insider',
        category: 'Technology',
        title: 'Semiconductor Supply Chain Showing Signs of Improvement',
        description: 'The global semiconductor supply chain is showing significant signs of improvement, with manufacturers reporting increased production capacity and shorter lead times.',
        tickers: ['SMH', 'SOXX', 'TSM']
    },
    {
        source: 'The Economist',
        category: 'Economy',
        title: 'Central Banks Signal Shift in Monetary Policy',
        description: 'Several major central banks have indicated a potential shift in their approach to monetary policy, citing changing inflation dynamics and economic growth patterns.',
        tickers: ['TLT', 'GLD', 'UUP']
    },
    {
        source: 'CNBC',
        category: 'Crypto',
        title: 'New Regulatory Framework Proposed for Digital Assets',
        description: 'Lawmakers have introduced a comprehensive regulatory framework for digital assets, aiming to provide clarity for the cryptocurrency industry while ensuring consumer protection.',
        tickers: ['BTC', 'ETH', 'COIN']
    }
];

// Economic calendar data - will be updated with current date
const calendarTemplates = [
    {
        event: 'Jobless Claims',
        country: 'U.S.',
        time: '09:30',
        importance: 3 // High
    },
    {
        event: 'Interest Rate Decision',
        country: 'ECB',
        time: '12:00',
        importance: 3 // High
    },
    {
        event: 'Manufacturing PMI',
        country: 'U.S.',
        time: '14:30',
        importance: 2 // Medium
    },
    {
        event: 'Crude Oil Inventories',
        country: 'U.S.',
        time: '17:00',
        importance: 2 // Medium
    },
    {
        event: 'FOMC Member Speech',
        country: 'U.S.',
        time: '19:00',
        importance: 1 // Low
    }
];

// Clock interval for real-time updates
let clockInterval;

// Initialize everything when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Market news page initialized");
    
    // Try to load previous state from localStorage
    loadStateFromStorage();
    
    // Initialize current date and time display
    addUTCClock();
    
    // Initialize all data sections
    displayMarketIndices();
    generateAndDisplayNews();
    displayEconomicCalendar();
    displaySectorPerformance();
    displayTrendingTopics();
    
    // Set up real-time updates with different frequencies
    setInterval(updateMarketIndices, 15000); // Market indices every 15 seconds
    setInterval(generateBreakingNews, 45000); // Possible breaking news every 45 seconds
    setInterval(updateSectorPerformance, 60000); // Sector data every minute
    setInterval(updateSentimentGauge, 90000); // Sentiment gauge every 1.5 minutes
    setInterval(updateTrendingTopics, 120000); // Trending topics every 2 minutes
    
    // Set up event listeners
    document.getElementById('loadMoreNewsBtn').addEventListener('click', loadMoreNews);
    document.getElementById('applyNewsFilter').addEventListener('click', applyNewsFilters);
});

// Save state periodically to localStorage for persistence
function saveStateToStorage() {
    try {
        localStorage.setItem('marketNewsState', JSON.stringify({
            lastUpdate: new Date().toISOString(),
            indices: marketState.indices,
            sentimentScore: marketState.sentimentScore,
            sectors: marketState.sectors,
            trendingTopics: marketState.trendingTopics,
            newsCount: marketState.newsCount
        }));
    } catch (error) {
        console.log("Could not save to local storage:", error);
    }
}

// Load previous state from localStorage if available
function loadStateFromStorage() {
    try {
        const savedState = localStorage.getItem('marketNewsState');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // Only use saved state if it's from today
            const savedDate = new Date(parsed.lastUpdate);
            const now = new Date();
            if (savedDate.toDateString() === now.toDateString()) {
                marketState.indices = parsed.indices;
                marketState.sentimentScore = parsed.sentimentScore;
                marketState.sectors = parsed.sectors;
                marketState.trendingTopics = parsed.trendingTopics;
                marketState.newsCount = parsed.newsCount || 0;
                console.log("Loaded previous state from storage");
            }
        }
    } catch (error) {
        console.log("Could not load from local storage:", error);
    }
}

// Format a date object to display string (Apr 10, 2025 format)
function formatDateForDisplay(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

// Update market indices with realistic movements
function updateMarketIndices() {
    // Generate realistic price movements for each index
    marketState.indices.forEach(index => {
        // Create more realistic market movements
        // Lower volatility during normal conditions, occasional larger moves
        const baseVolatility = 0.05; // Base volatility for small movements
        const volatilitySpike = Math.random() > 0.9 ? 0.2 : 0; // Occasional volatility spikes
        const volatility = baseVolatility + volatilitySpike;
        
        // Calculate change amount - slight bias toward direction continuation
        const directionBias = index.isPositive ? 0.05 : -0.05;
        const changeAmount = parseFloat((Math.random() * volatility * 2 - volatility + directionBias).toFixed(2));
        
        // Update price
        const newPrice = parseFloat((index.price + changeAmount).toFixed(2));
        const percentChange = parseFloat(((newPrice / index.price - 1) * 100).toFixed(2));
        
        // Save previous state for animation
        index.previousPrice = index.price;
        
        // Update state
        index.price = newPrice;
        index.change = parseFloat(changeAmount.toFixed(2));
        index.percentChange = percentChange;
        index.isPositive = percentChange >= 0;
    });
    
    // Display updated data
    displayMarketIndices();
    
    // Save state occasionally
    if (Math.random() > 0.7) {
        saveStateToStorage();
    }
}

// Display market indices with animation
function displayMarketIndices() {
    marketState.indices.forEach((index, i) => {
        const indexCard = document.querySelector(`.index-card:nth-child(${i + 1})`);
        if (!indexCard) return;
        
        const priceElement = indexCard.querySelector('.price');
        const changeElement = indexCard.querySelector('.change');
        const chartElement = indexCard.querySelector('.mini-chart div');
        
        if (!priceElement || !changeElement || !chartElement) return;
        
        // Apply animation class if we have previous price data
        if (index.previousPrice && index.previousPrice !== index.price) {
            priceElement.classList.add(index.price > index.previousPrice ? 'flash-positive' : 'flash-negative');
            
            // Remove flash animation after a delay
            setTimeout(() => {
                priceElement.classList.remove('flash-positive', 'flash-negative');
            }, 1000);
        }
        
        // Check if it's an Indian stock
        const isIndianStock = indianStocks.includes(index.symbol.replace('^', ''));
        
        // Update displayed values with currency symbol
        priceElement.textContent = `${isIndianStock ? '₹' : '$'}${index.price.toLocaleString('en-US')}`;
        
        // Format change display with currency symbol
        const changePrefix = index.isPositive ? '+' : '';
        changeElement.textContent = `${changePrefix}${isIndianStock ? '₹' : '$'}${Math.abs(index.change).toFixed(2)} (${changePrefix}${index.percentChange}%)`;
        changeElement.className = `change ${index.isPositive ? 'positive' : 'negative'}`;
        
        // Update mini chart direction
        chartElement.className = index.isPositive ? 'chart-up' : 'chart-down';
    });
    
    // Update data badge with current time
    const badge = document.querySelector('.real-time-badge span');
    if (badge) {
        const now = new Date();
        badge.innerHTML = `<i class="fas fa-broadcast-tower pulse"></i> Live Data (${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')})`;
    }
}

// Generate initial news items with current timestamps
function generateAndDisplayNews(filter = null) {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;
    
    // Clear if needed based on filter
    if (filter) {
        newsContainer.innerHTML = '';
    } else if (newsContainer.children.length > 0) {
        // If no filter and already has news, just return
        return;
    }
    
    // Show loading indicator
    newsContainer.innerHTML = `
        <div class="text-center my-5">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Fetching latest market news...</p>
        </div>
    `;
    
    // Generate news with realistic timestamps
    setTimeout(() => {
        // Clear loading indicator
        newsContainer.innerHTML = '';
        
        // Get current time
        const now = new Date();
        
        // Generate 3 initial news items with staggered times
        const initialNews = [];
        for (let i = 0; i < 3; i++) {
            // Select a random news template
            const templateIndex = Math.floor(Math.random() * newsTemplates.length);
            const template = newsTemplates[templateIndex];
            
            // Create timestamp - more recent for newer items
            const newsTime = new Date(now);
            newsTime.setMinutes(now.getMinutes() - (i * 15)); // Stagger by 15 minutes
            
            // Format date for display
            const formattedDate = `${formatDateForDisplay(newsTime)} - ${String(newsTime.getUTCHours()).padStart(2, '0')}:${String(newsTime.getUTCMinutes()).padStart(2, '0')} UTC`;
            
            // Create news item
            const newsItem = {
                ...template,
                date: formattedDate,
                timestamp: newsTime.getTime(),
                id: `news-${Date.now()}-${i}`,
                url: '#'
            };
            
            // Apply filter if provided
            if (filter) {
                if ((filter.category !== 'all' && template.category.toLowerCase() !== filter.category.toLowerCase()) ||
                    (filter.source !== 'all' && template.source.toLowerCase().indexOf(filter.source.toLowerCase()) === -1)) {
                    continue;
                }
            }
            
            initialNews.push(newsItem);
        }
        
        // Sort by timestamp (newest first)
        initialNews.sort((a, b) => b.timestamp - a.timestamp);
        
        // Save to our state
        marketState.loadedNews = initialNews;
        
        // Display the news items
        initialNews.forEach((item, index) => {
            addNewsItem(item, index, newsContainer);
        });
        
        // Update news count
        marketState.newsCount = initialNews.length;
    }, 1000);
}

// Generate and display breaking news occasionally
function generateBreakingNews() {
    // Only show breaking news some of the time (30% chance)
    if (Math.random() > 0.3) return;
    
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer || newsContainer.children.length === 0) return;
    
    // Select a random news template
    const templateIndex = Math.floor(Math.random() * newsTemplates.length);
    const template = newsTemplates[templateIndex];
    
    // Current time for the breaking news
    const now = new Date();
    const formattedDate = `${formatDateForDisplay(now)} - ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    
    // Create a "breaking" version of the news
    const breakingNews = {
        ...template,
        title: `BREAKING: ${template.title}`,
        date: formattedDate,
        timestamp: now.getTime(),
        id: `breaking-${Date.now()}`,
        url: '#',
        isBreaking: true
    };
    
    // Add to our loaded news
    marketState.loadedNews.unshift(breakingNews);
    
    // Add to display with breaking news styling
    addNewsItem(breakingNews, -1, newsContainer, true);
    
    // Update news count
    marketState.newsCount++;
    
    // Save state
    saveStateToStorage();
}

// Add a news item to the container with animation
function addNewsItem(item, index, container, isBreaking = false) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item' + (isBreaking || item.isBreaking ? ' breaking-news' : '');
    newsItem.id = item.id;
    newsItem.style.opacity = '0';
    newsItem.style.transform = 'translateY(20px)';
    
    newsItem.innerHTML = `
        ${isBreaking || item.isBreaking ? '<div class="breaking-news-banner">Breaking News</div>' : ''}
        <div class="news-meta">
            <span class="news-source"><i class="fas fa-newspaper"></i> ${item.source}</span>
            <span class="news-time"><i class="far fa-clock"></i> ${item.date}</span>
            <span class="news-category"><i class="fas fa-tag"></i> ${item.category}</span>
        </div>
        <h4 class="news-title">${item.title}</h4>
        <p class="news-excerpt">${item.description}</p>
        ${item.tickers ? `
        <div class="news-tickers">
            <span>Related: </span>
            ${item.tickers.map(ticker => `<a href="#" class="ticker-tag">$${ticker}</a>`).join(' ')}
        </div>
        ` : ''}
        <a href="${item.url}" target="_blank" class="news-read-more">Read Full Article <i class="fas fa-external-link-alt"></i></a>
    `;
    
    // Add breaking news at the top, other news at the appropriate position
    if (isBreaking || item.isBreaking) {
        container.insertBefore(newsItem, container.firstChild);
    } else {
        container.appendChild(newsItem);
    }
    
    // Staggered animation
    setTimeout(() => {
        newsItem.style.transition = 'all 0.5s ease';
        newsItem.style.opacity = '1';
        newsItem.style.transform = 'translateY(0)';
    }, isBreaking || item.isBreaking ? 100 : 100 * (index + 1));
    
    // If it's breaking news, add highlight effect
    if (isBreaking || item.isBreaking) {
        setTimeout(() => {
            newsItem.classList.add('highlight-pulse');
            setTimeout(() => {
                newsItem.classList.remove('highlight-pulse');
            }, 3000);
        }, 500);
    }
}

// Display economic calendar with current date
function displayEconomicCalendar() {
    const calendarContainer = document.querySelector('.economic-calendar');
    if (!calendarContainer) return;
    
    // Get the current date
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();
    
    // Clear existing content
    calendarContainer.innerHTML = '';
    
    // Generate events for today with the templates
    calendarTemplates.forEach(template => {
        // Generate event HTML
        const eventHTML = `
            <div class="event-item">
                <div class="event-time">${template.time} UTC</div>
                <div class="event-details">
                    <span class="event-name">${template.country} - ${template.event}</span>
                    <span class="event-importance ${getImportanceClass(template.importance)}">${getImportanceText(template.importance)}</span>
                </div>
            </div>
        `;
        
        // Add to container
        calendarContainer.innerHTML += eventHTML;
    });
    
    // Update the calendar header date
    const calendarHeader = document.querySelector('.glass-card:last-child .card-title');
    if (calendarHeader) {
        calendarHeader.innerHTML = `Economic Calendar <span class="badge bg-danger ms-2">${formatDateForDisplay(now)}</span>`;
    }
}

// Update sector performance with realistic movements
function updateSectorPerformance() {
    // Update each sector with realistic changes
    marketState.sectors.forEach(sector => {
        // Generate small random change
        const change = parseFloat((Math.random() * 0.4 - 0.2).toFixed(1));
        
        // Calculate new performance value
        const newPerformance = parseFloat((sector.performance + change).toFixed(1));
        
        // Save previous value for animation
        sector.previousPerformance = sector.performance;
        
        // Update sector data
        sector.performance = newPerformance;
        sector.isPositive = newPerformance >= 0;
    });
    
    // Display updated data
    displaySectorPerformance();
}

// Display sector performance data
function displaySectorPerformance() {
    const sectorContainer = document.querySelector('.sector-performance');
    if (!sectorContainer) return;
    
    marketState.sectors.forEach((sector, index) => {
        const sectorItem = sectorContainer.querySelector(`.sector-item:nth-child(${index + 1})`);
        if (!sectorItem) return;
        
        const sectorValueElement = sectorItem.querySelector('.sector-value');
        if (!sectorValueElement) return;
        
        // Add animation if we have previous data and it changed
        if (sector.previousPerformance !== undefined && sector.previousPerformance !== sector.performance) {
            sectorValueElement.classList.add(sector.performance > sector.previousPerformance ? 'flash-positive' : 'flash-negative');
            
            setTimeout(() => {
                sectorValueElement.classList.remove('flash-positive', 'flash-negative');
            }, 1000);
        }
        
        // Generate display values
        const displayValue = `${sector.isPositive ? '+' : ''}${sector.performance.toFixed(1)}%`;
        const widthValue = `${Math.abs(sector.performance * 20 + 40)}%`;
        
        // Update the display
        sectorValueElement.textContent = displayValue;
        sectorValueElement.className = `sector-value ${sector.isPositive ? 'positive' : 'negative'}`;
        sectorValueElement.style.width = widthValue;
    });
    
    // Update timestamp
    const now = new Date();
    const updateElement = document.querySelector('.sentiment-update');
    if (updateElement) {
        updateElement.textContent = `Updated: ${formatDateForDisplay(now)}, ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    }
}

// Update the market sentiment gauge
function updateSentimentGauge() {
    const gaugeElement = document.querySelector('.gauge-value');
    const scoreElement = document.querySelector('.gauge-score');
    if (!gaugeElement || !scoreElement) return;
    
    // Get current sentiment value
    const currentWidth = parseInt(gaugeElement.style.width) || marketState.sentimentScore;
    
    // Generate small random change for realistic movement
    const change = Math.random() * 6 - 3; // Small movements
    const newWidth = Math.max(10, Math.min(90, currentWidth + change)); // Keep between 10% and 90%
    
    // Save to state
    marketState.sentimentScore = newWidth;
    
    // Apply changes with animation
    gaugeElement.style.transition = 'width 1s ease-in-out';
    gaugeElement.style.width = `${newWidth}%`;
    
    // Update the sentiment score text
    scoreElement.textContent = `${Math.round(newWidth)}% ${newWidth > 50 ? 'Bullish' : 'Bearish'}`;
    
    // Update timestamp
    const now = new Date();
    const updateElement = document.querySelector('.sentiment-update');
    if (updateElement) {
        updateElement.textContent = `Updated: ${formatDateForDisplay(now)}, ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    }
}

// Update trending topics with realistic changes
function updateTrendingTopics() {
    const topicsContainer = document.querySelector('.trending-topics');
    if (!topicsContainer) return;
    
    // Update each topic
    marketState.trendingTopics.forEach((topic, index) => {
        const topicElement = topicsContainer.querySelector(`.topic-item:nth-child(${index + 1})`);
        if (!topicElement) return;
        
        const countElement = topicElement.querySelector('.topic-count');
        if (!countElement) return;
        
        // Save previous count
        const previousCount = topic.count;
        
        // Generate small random change
        const change = Math.floor(Math.random() * 15) - 5; // Movement of -5 to +10
        const newCount = Math.max(1, topic.count + change);
        
        // Update state
        topic.count = newCount;
        
        // Update with animation if there's a change
        if (change !== 0) {
            countElement.classList.add(change > 0 ? 'flash-positive' : 'flash-negative');
            countElement.textContent = `+${newCount}%`;
            
            setTimeout(() => {
                countElement.classList.remove('flash-positive', 'flash-negative');
            }, 1000);
        }
    });
    
    // Occasionally reorder topics based on count values
    if (Math.random() > 0.7) {
        // Sort by count value
        marketState.trendingTopics.sort((a, b) => b.count - a.count);
        
        // Update the DOM to match the new order
        displayTrendingTopics();
    }
    
    // Save state 
    saveStateToStorage();
}

// Display trending topics
function displayTrendingTopics() {
    const topicsContainer = document.querySelector('.trending-topics');
    if (!topicsContainer) return;
    
    // Clear container
    topicsContainer.innerHTML = '';
    
    // Add each topic
    marketState.trendingTopics.forEach(topic => {
        const topicHTML = `
            <div class="topic-item">
                <span class="topic-tag">${topic.tag}</span>
                <span class="topic-count">+${topic.count}%</span>
            </div>
        `;
        topicsContainer.innerHTML += topicHTML;
    });
}

// Load more news functionality
function loadMoreNews() {
    const loadMoreButton = document.getElementById('loadMoreNewsBtn');
    if (!loadMoreButton) return;
    
    loadMoreButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    
    // Generate additional news with older timestamps
    setTimeout(() => {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;
        
        // Generate older timestamps
        const now = new Date();
        const startHoursAgo = 2; // Start 2 hours ago
        
        // Generate 3 more news items with staggered times
        const additionalNews = [];
        for (let i = 0; i < 3; i++) {
            // Select a random news template we haven't used recently
            let templateIndex;
            do {
                templateIndex = Math.floor(Math.random() * newsTemplates.length);
            } while (
                marketState.loadedNews.length > 0 && 
                marketState.loadedNews.some(news => news.title === newsTemplates[templateIndex].title)
            );
            
            const template = newsTemplates[templateIndex];
            
            // Create timestamp - older for more items
            const newsTime = new Date(now);
            newsTime.setHours(now.getHours() - (startHoursAgo + i)); // Staggered older times
            
            // Format date for display
            const formattedDate = `${formatDateForDisplay(newsTime)} - ${String(newsTime.getUTCHours()).padStart(2, '0')}:${String(newsTime.getUTCMinutes()).padStart(2, '0')} UTC`;
            
            // Create news item
            const newsItem = {
                ...template,
                date: formattedDate,
                timestamp: newsTime.getTime(),
                id: `news-${Date.now()}-${i}`,
                url: '#'
            };
            
            additionalNews.push(newsItem);
        }
        
        // Add to our loaded news
        marketState.loadedNews = [...marketState.loadedNews, ...additionalNews];
        
        // Add to display
        additionalNews.forEach((item, index) => {
            addNewsItem(item, index, newsContainer);
        });
        
        // Update news count
        marketState.newsCount += additionalNews.length;
        
        // Reset button
        loadMoreButton.textContent = 'Load More News';
        
        // Save state
        saveStateToStorage();
    }, 1500);
}

// Apply news filters functionality
function applyNewsFilters() {
    const category = document.getElementById('newsCategory').value;
    const source = document.getElementById('newsSource').value;
    const timeframe = document.getElementById('newsTimeframe').value;
    
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;
    
    // Show loading indicator
    newsContainer.innerHTML = `
        <div class="text-center my-5">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Filtering news...</p>
        </div>
    `;
    
    // Apply filters with delay to simulate processing
    setTimeout(() => {
        // Clear container
        newsContainer.innerHTML = '';
        
        // Create filter tag indicator if filters are applied
        if (category !== 'all' || source !== 'all' || timeframe !== 'today') {
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag mb-3';
            filterTag.innerHTML = `
                <span>Filtered by: </span>
                ${category !== 'all' ? `<span class="badge bg-primary me-2">${category}</span>` : ''}
                ${source !== 'all' ? `<span class="badge bg-info me-2">${source}</span>` : ''}
                ${timeframe !== 'today' ? `<span class="badge bg-secondary me-2">${timeframe}</span>` : ''}
                <button class="btn btn-sm btn-outline-light ms-2" id="clearFiltersBtn">Clear Filters</button>
            `;
            newsContainer.appendChild(filterTag);
            
            // Add clear filters functionality
            document.getElementById('clearFiltersBtn').addEventListener('click', function() {
                document.getElementById('newsCategory').value = 'all';
                document.getElementById('newsSource').value = 'all';
                document.getElementById('newsTimeframe').value = 'today';
                applyNewsFilters();
            });
        }
        
        // Filter news templates based on criteria
        const filteredTemplates = newsTemplates.filter(template => {
            if (category !== 'all' && template.category.toLowerCase() !== category.toLowerCase()) {
                return false;
            }
            if (source !== 'all' && !template.source.toLowerCase().includes(source.toLowerCase())) {
                return false;
            }
            return true;
        });
        
        // If we have matching templates, generate filtered news
        if (filteredTemplates.length > 0) {
            // Generate timestamps based on selected timeframe
            const now = new Date();
            const startTime = new Date(now);
            
            if (timeframe === 'week') {
                startTime.setDate(now.getDate() - 7);
            } else if (timeframe === 'month') {
                startTime.setMonth(now.getMonth() - 1);
            }
            
            // Generate filtered news
            const filteredNews = [];
            const numItems = Math.min(3, filteredTemplates.length);
            
            for (let i = 0; i < numItems; i++) {
                const template = filteredTemplates[i];
                
                // Create timestamp within the selected timeframe
                const newsTime = new Date(startTime.getTime() + Math.random() * (now.getTime() - startTime.getTime()));
                
                // Format date for display
                const formattedDate = `${formatDateForDisplay(newsTime)} - ${String(newsTime.getUTCHours()).padStart(2, '0')}:${String(newsTime.getUTCMinutes()).padStart(2, '0')} UTC`;
                
                // Create news item
                const newsItem = {
                    ...template,
                    date: formattedDate,
                    timestamp: newsTime.getTime(),
                    id: `filtered-${Date.now()}-${i}`,
                    url: '#'
                };
                
                filteredNews.push(newsItem);
            }
            
            // Sort by timestamp (newest first)
            filteredNews.sort((a, b) => b.timestamp - a.timestamp);
            
            // Display the filtered news
            filteredNews.forEach((item, index) => {
                addNewsItem(item, index, newsContainer);
            });
        } else {
            // No results message
            const noResults = document.createElement('div');
            noResults.className = 'no-results text-center my-5';
            noResults.innerHTML = `
                <i class="fas fa-search fa-3x mb-3"></i>
                <h5>No news found matching your filters</h5>
                <p class="text-muted">Try adjusting your filter criteria</p>
                <button class="btn btn-outline-light mt-3" id="resetFiltersBtn">Reset Filters</button>
            `;
            newsContainer.appendChild(noResults);
            
            // Reset filters functionality
            document.getElementById('resetFiltersBtn').addEventListener('click', function() {
                document.getElementById('newsCategory').value = 'all';
                document.getElementById('newsSource').value = 'all';
                document.getElementById('newsTimeframe').value = 'today';
                applyNewsFilters();
            });
        }
    }, 1000);
}

// Helper functions for importance classes and text
function getImportanceClass(importance) {
    if (importance >= 3) return 'high';
    if (importance >= 2) return 'medium';
    return 'low';
}

function getImportanceText(importance) {
    if (importance >= 3) return 'High';
    if (importance >= 2) return 'Medium';
    return 'Low';
}

// Window visibility event - pause/resume updates when tab is inactive/active
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, clear intervals to save resources
        clearAllIntervals();
    } else {
        // Page is visible again, refresh data and restart intervals
        restartAllIntervals();
    }
});

// Cleanup intervals when leaving the page
window.addEventListener('beforeunload', function() {
    clearAllIntervals();
});

// Clear all update intervals
function clearAllIntervals() {
    // Store intervals in window object so we can access them later
    window.marketNewsIntervals = window.marketNewsIntervals || {};
    
    // Clear all intervals
    for (const key in window.marketNewsIntervals) {
        clearInterval(window.marketNewsIntervals[key]);
    }
    
    // Clear clock interval
    if (clockInterval) {
        clearInterval(clockInterval);
    }
}

// Restart all update intervals
function restartAllIntervals() {
    // Clear any existing intervals first
    clearAllIntervals();
    
    // Create new update intervals
    window.marketNewsIntervals = {
        marketIndices: setInterval(updateMarketIndices, 15000),
        breakingNews: setInterval(generateBreakingNews, 45000),
        sectorPerformance: setInterval(updateSectorPerformance, 60000),
        sentimentGauge: setInterval(updateSentimentGauge, 90000),
        trendingTopics: setInterval(updateTrendingTopics, 120000)
    };
    
    // Restart clock
    clockInterval = setInterval(updateUTCClock, 1000);
    
    // Immediately update the display
    updateUTCClock();
    displayMarketIndices();
    updateSectorPerformance();
    updateSentimentGauge();
    updateTrendingTopics();
}