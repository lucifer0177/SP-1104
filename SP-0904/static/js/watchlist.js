// Global variables
let chart;
let currentWatchlist = [];
let favorites = JSON.parse(localStorage.getItem('watchlistFavorites')) || {};

// Update current time every second
function updateCurrentTime() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toISOString().replace('T', ' ').substring(0, 19);
}

// Fetch real-time stock data
async function fetchStockData(ticker) {
    try {
        const response = await fetch(`/api/stock/${ticker}`);
        if (!response.ok) throw new Error('Failed to fetch stock data');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        return null;
    }
}

// Initialize watchlist
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Initialize chart
    const ctx = document.getElementById('tickerChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8'],
            datasets: [{
                label: 'AAPL Price',
                data: [239.45, 241.23, 240.87, 243.56, 245.78, 244.32, 243.26, 246.78],
                borderColor: '#4dacff',
                backgroundColor: 'rgba(77, 172, 255, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#4dacff',
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(32, 41, 64, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#e1e1e1',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                }
            }
        }
    });
    
    // Handle favorite star toggle
    document.querySelectorAll('.fa-star').forEach(star => {
        star.addEventListener('click', function() {
            this.classList.toggle('fas');
            this.classList.toggle('far');
            this.classList.toggle('favorite');
            
            // Show notification
            const isFavorite = this.classList.contains('fas');
            const tickerSymbol = this.closest('tr').querySelector('td:nth-child(2)').textContent;
            const message = `${tickerSymbol} ${isFavorite ? 'added to' : 'removed from'} favorites`;
            const type = isFavorite ? 'success' : 'info';
            
            // Get the notification toast element
            const notificationToast = document.getElementById('notificationToast');
            if (notificationToast) {
                const toastBody = notificationToast.querySelector('.toast-body');
                toastBody.textContent = message;
                notificationToast.classList.remove('bg-success', 'bg-info', 'bg-danger');
                notificationToast.classList.add(`bg-${type}`);
                
                const toast = bootstrap.Toast.getOrCreateInstance(notificationToast);
                toast.show();
            }
        });
    });
    
    // Handle view details button click
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticker = this.getAttribute('data-ticker');
            showTickerDetails(ticker);
        });
    });
    
    // Handle predict button click
    document.querySelectorAll('.predict-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticker = this.getAttribute('data-ticker');
            // Redirect to prediction page
            window.location.href = `/?ticker=${ticker}`;
        });
    });
    
    // Handle delete button click
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticker = this.getAttribute('data-ticker');
            const row = this.closest('tr');
            
            if (confirm(`Are you sure you want to remove ${ticker} from your watchlist?`)) {
                // Animation for row removal
                row.style.transition = 'all 0.3s';
                row.style.opacity = '0';
                row.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    row.remove();
                }, 300);
                
                // Show notification
                const toast = new bootstrap.Toast(document.createElement('div'));
                toast._element.classList.add('toast', 'align-items-center', 'text-white', 'bg-dark', 'border-0');
                toast._element.setAttribute('role', 'alert');
                toast._element.setAttribute('aria-live', 'assertive');
                toast._element.setAttribute('aria-atomic', 'true');
                
                toast._element.innerHTML = `
                    <div class="d-flex">
                        <div class="toast-body">
                            <i class="fas fa-check"></i> ${ticker} removed from watchlist
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                `;
                
                document.body.appendChild(toast._element);
                toast.show();
                
                setTimeout(() => {
                    toast._element.remove();
                }, 3000);
            }
        });
    });
    
    // Add ticker to watchlist
    document.getElementById('addTickerBtn').addEventListener('click', function() {
        const tickerSymbol = document.getElementById('tickerSymbol').value.toUpperCase();
        const watchlistName = document.getElementById('watchlistSelect').value;
        
        if (!tickerSymbol) {
            alert('Please enter a ticker symbol');
            return;
        }
        
        // Use the centralized addStockToWatchlist function
        const newRow = addStockToWatchlist(watchlistName, tickerSymbol);
        
        if (newRow) {
            // Animation for new row
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(20px)';
            setTimeout(() => {
                newRow.style.transition = 'all 0.5s';
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
            }, 10);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTickerModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('tickerSymbol').value = '';
            
            // Show success notification
            showNotification(`${tickerSymbol} added to ${watchlistName} watchlist`, 'success');
        }
    });
    
    // Enhanced watchlist management
    function showNotification(message, type) {
        const notificationToast = document.getElementById('notificationToast');
        if (notificationToast) {
            const toastBody = notificationToast.querySelector('.toast-body');
            toastBody.textContent = message;
            notificationToast.classList.remove('bg-success', 'bg-info', 'bg-danger');
            notificationToast.classList.add(`bg-${type}`);
            
            const toast = bootstrap.Toast.getOrCreateInstance(notificationToast);
            toast.show();
        }
    }

    function addStockToWatchlist(watchlistId, ticker, isFavorite = false) {
        const targetTab = document.getElementById(watchlistId);
        if (!targetTab) {
            console.error(`Watchlist tab ${watchlistId} not found`);
            return null;
        }
        
        const targetTable = targetTab.querySelector('table tbody');
        const newRow = document.createElement('tr');
        newRow.classList.add('ticker-row');
        
        // Sample data - in real app this would come from API
        const demoPrice = (Math.random() * 500 + 50).toFixed(2);
        const demoChange = (Math.random() * 10 - 5).toFixed(2);
        const demoChangePercent = ((demoChange / demoPrice) * 100).toFixed(2);
        const isPositive = parseFloat(demoChange) >= 0;
        const demoVolume = (Math.random() * 50 + 1).toFixed(1) + 'M';
        
        newRow.innerHTML = `
            <td><i class="${isFavorite ? 'fas' : 'far'} fa-star ${isFavorite ? 'favorite' : ''}"></i></td>
            <td>${ticker}</td>
            <td>${ticker} Inc.</td>
            <td>${demoPrice}</td>
            <td class="${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${demoChange}</td>
            <td class="${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${demoChangePercent}%</td>
            <td>${demoVolume}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm action-btn view-btn" data-ticker="${ticker}" data-bs-toggle="tooltip" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm action-btn predict-btn" data-ticker="${ticker}" data-bs-toggle="tooltip" title="Predict"><i class="fas fa-chart-line"></i></button>
                    <button class="btn btn-sm action-btn delete-btn" data-ticker="${ticker}" data-bs-toggle="tooltip" title="Remove"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;

        // Add event listeners
        newRow.querySelector('.view-btn').addEventListener('click', function() {
            showTickerDetails(ticker);
        });
        
        newRow.querySelector('.predict-btn').addEventListener('click', function() {
            window.location.href = `/?ticker=${ticker}`;
        });
        
        newRow.querySelector('.delete-btn').addEventListener('click', function() {
            if (confirm(`Are you sure you want to remove ${ticker} from your watchlist?`)) {
                newRow.remove();
                saveWatchlists();
            }
        });
        
        newRow.querySelector('.fa-star').addEventListener('click', function() {
            this.classList.toggle('fas');
            this.classList.toggle('far');
            this.classList.toggle('favorite');
            saveWatchlists();
        });

        targetTable.appendChild(newRow);
        return newRow;
    }

    function saveWatchlists() {
        const watchlists = {};
        document.querySelectorAll('.tab-pane').forEach(tab => {
            const stocks = [];
            tab.querySelectorAll('.ticker-row').forEach(row => {
                stocks.push({
                    symbol: row.querySelector('td:nth-child(2)').textContent,
                    isFavorite: row.querySelector('.fa-star').classList.contains('fas')
                });
            });
            watchlists[tab.id] = {
                name: document.querySelector(`#${tab.id}-tab`).textContent.trim(),
                stocks: stocks
            };
        });
        localStorage.setItem('watchlists', JSON.stringify(watchlists));
    }

    function loadWatchlists() {
        const saved = localStorage.getItem('watchlists');
        if (saved) {
            const watchlists = JSON.parse(saved);
            for (const [id, data] of Object.entries(watchlists)) {
                createWatchlistTab(id, data.name);
                data.stocks.forEach(stock => {
                    addStockToWatchlist(id, stock.symbol, stock.isFavorite);
                });
            }
        } else {
            // Create default watchlist if none exist
            createWatchlistTab('default', 'My Watchlist');
        }
    }

    function createWatchlistTab(id, name) {
        // Create new tab
        const newTab = document.createElement('li');
        newTab.classList.add('nav-item');
        newTab.setAttribute('role', 'presentation');
        newTab.innerHTML = `
            <button class="nav-link" id="${id}-tab" data-bs-toggle="pill" data-bs-target="#${id}" type="button" role="tab" aria-controls="${id}" aria-selected="false">
                ${name}
                <button class="btn-close btn-close-white btn-sm ms-2 watchlist-close" data-watchlist-id="${id}"></button>
            </button>
        `;
        
        // Create new tab content
        const newTabContent = document.createElement('div');
        newTabContent.classList.add('tab-pane', 'fade');
        newTabContent.id = id;
        newTabContent.setAttribute('role', 'tabpanel');
        newTabContent.setAttribute('aria-labelledby', `${id}-tab`);
        newTabContent.innerHTML = `
            <div class="table-responsive">
                <table class="table table-dark table-hover watchlist-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Symbol</th>
                            <th>Company</th>
                            <th>Last Price</th>
                            <th>Change</th>
                            <th>Change %</th>
                            <th>Volume</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No stocks in this watchlist yet.<br>Use the "Add Ticker" button to add stocks.</p>
            </div>
            <div class="real-time-badge">
                <span><i class="fas fa-broadcast-tower pulse"></i> Live Data</span>
            </div>
        `;
        
        // Add new tab to tabs
        document.getElementById('watchlistTabs').appendChild(newTab);
        document.getElementById('watchlistTabContent').appendChild(newTabContent);
        
        // Add option to select dropdown
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        document.getElementById('watchlistSelect').appendChild(option);
        
        // Add event listener for delete button
        newTab.querySelector('.watchlist-close').addEventListener('click', function(e) {
            e.stopPropagation();
            deleteWatchlist(this.getAttribute('data-watchlist-id'));
        });
    }

    function deleteWatchlist(id) {
        if (confirm(`Delete watchlist "${document.querySelector(`#${id}-tab`).textContent.trim()}"?`)) {
            // Remove tab
            document.querySelector(`#${id}-tab`).parentElement.remove();
            // Remove content
            document.getElementById(id).remove();
            // Remove from dropdown
            document.querySelector(`#watchlistSelect option[value="${id}"]`).remove();
            saveWatchlists();
        }
    }

    // Create new watchlist
    document.getElementById('createListBtn').addEventListener('click', function() {
        const listName = document.getElementById('listName').value;
        if (!listName) {
            alert('Please enter a list name');
            return;
        }
        
        const listId = `watchlist-${Date.now()}`;
        createWatchlistTab(listId, listName);
        
        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('createListModal')).hide();
        document.getElementById('listName').value = '';
        document.getElementById('listDescription').value = '';
        
        saveWatchlists();
        
        // Show success notification
        showNotification(`${listName} watchlist created`, 'success');
    });

    // Initialize watchlists on load
    document.addEventListener('DOMContentLoaded', function() {
        // Make sure containers exist before initializing
        if (document.getElementById('watchlistTabs') && document.getElementById('watchlistTabContent')) {
            loadWatchlists();
        } else {
            console.error('Watchlist containers not found');
            // Create default containers if they don't exist
            const watchlistContainer = document.createElement('div');
            watchlistContainer.innerHTML = `
                <ul class="nav nav-pills mb-3" id="watchlistTabs"></ul>
                <div class="tab-content" id="watchlistTabContent"></div>
            `;
            document.querySelector('.watchlist-container').appendChild(watchlistContainer);
            loadWatchlists();
        }
    });
    
    // Function to show ticker details
    async function showTickerDetails(ticker) {
        const tickerDetail = document.getElementById('tickerDetail');
        const tickerHeader = tickerDetail.querySelector('.ticker-header');
        const tickerPrice = tickerDetail.querySelector('.ticker-price');
        const tickerChart = document.getElementById('tickerChart').getContext('2d');
        
        // Show loading state
        tickerHeader.innerHTML = '<div class="loading-placeholder"></div>';
        tickerPrice.innerHTML = '<div class="loading-placeholder"></div>';
        
        try {
            // Fetch real data from yfinance
            const response = await fetch(`/api/stock/${ticker}`);
            if (!response.ok) throw new Error('Failed to fetch stock data');
            
            const stockData = await response.json();
            if (ticker === 'AAPL') {
                tickerHeader.innerHTML = `
                    <div class="ticker-symbol">AAPL</div>
                    <div class="ticker-name">Apple Inc.</div>
                `;
                tickerPrice.innerHTML = `
                    <div class="current-price">$246.78</div>
                    <div class="price-change positive">+$3.52 (+1.45%)</div>
                `;
                
                // Update chart data
                chart.data.labels = ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8'];
                chart.data.datasets[0].label = 'AAPL Price';
                chart.data.datasets[0].data = [239.45, 241.23, 240.87, 243.56, 245.78, 244.32, 243.26, 246.78];
                chart.update();
                
                // Update stats
                const statValues = tickerDetail.querySelectorAll('.stat-value');
                statValues[0].textContent = '$244.15';
                statValues[1].textContent = '$243.26';
                statValues[2].textContent = '$243.02 - $247.52';
                statValues[3].textContent = '$178.45 - $248.32';
                statValues[4].textContent = '42.3M';
                statValues[5].textContent = '$3.81T';
                statValues[6].textContent = '28.45';
                statValues[7].textContent = '0.48%';
                
            } else {
                // Generate random data for other stocks
                const price = (Math.random() * 500 + 50).toFixed(2);
                const change = (Math.random() * 10 - 5).toFixed(2);
                const changePercent = ((change / price) * 100).toFixed(2);
                const isPositive = parseFloat(change) >= 0;
                
                tickerHeader.innerHTML = `
                    <div class="ticker-symbol">${ticker}</div>
                    <div class="ticker-name">${ticker} Inc.</div>
                `;
                tickerPrice.innerHTML = `
                    <div class="current-price">$${price}</div>
                    <div class="price-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}$${change} (${isPositive ? '+' : ''}${changePercent}%)
                    </div>
                `;
                
                // Generate random chart data
                const chartData = [];
                let currentPrice = parseFloat(price) - parseFloat(change);
                for (let i = 0; i < 8; i++) {
                    currentPrice = currentPrice + (Math.random() * 4 - 2);
                    chartData.push(currentPrice.toFixed(2));
                }
                
                // Update chart data
                chart.data.labels = ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8'];
                chart.data.datasets[0].label = `${ticker} Price`;
                chart.data.datasets[0].data = chartData;
                chart.update();
                
                // Update stats with random data
                const statValues = tickerDetail.querySelectorAll('.stat-value');
                statValues[0].textContent = `$${(parseFloat(price) - Math.random() * 2).toFixed(2)}`;
                statValues[1].textContent = `$${(parseFloat(price) - parseFloat(change)).toFixed(2)}`;
                
                const lowRange = (parseFloat(price) - Math.random() * 5).toFixed(2);
                const highRange = (parseFloat(price) + Math.random() * 5).toFixed(2);
                statValues[2].textContent = `$${lowRange} - $${highRange}`;
                
                const yearLow = (parseFloat(price) * 0.7).toFixed(2);
                const yearHigh = (parseFloat(price) * 1.3).toFixed(2);
                statValues[3].textContent = `$${yearLow} - $${yearHigh}`;
                
                statValues[4].textContent = `${(Math.random() * 50 + 1).toFixed(1)}M`;
                statValues[5].textContent = `$${(Math.random() * 2 + 0.1).toFixed(2)}T`;
                statValues[6].textContent = (Math.random() * 40 + 10).toFixed(2);
                statValues[7].textContent = `${(Math.random() * 3).toFixed(2)}%`;
            }
            
            // Highlight the selected ticker in the table
            document.querySelectorAll('.ticker-row').forEach(row => {
                row.classList.remove('selected-ticker');
                if (row.querySelector('td:nth-child(2)').textContent === ticker) {
                    row.classList.add('selected-ticker');
                }
            });
            
        } catch (error) {
            console.error('Error fetching stock data:', error);
            tickerHeader.innerHTML = `
                <div class="ticker-symbol">${ticker}</div>
                <div class="error-message">Failed to load data</div>
            `;
            tickerPrice.innerHTML = '<div class="error-message">Please try again later</div>';
        }
    }
    
    // Initialize with the first ticker (AAPL)
    showTickerDetails('AAPL');
    
    // Live data simulation - update random tickers every few seconds
    const liveDataInterval = setInterval(() => {
        try {
            // Select a random ticker
            const allRows = document.querySelectorAll('.ticker-row');
            if (allRows.length === 0) {
                console.log('No ticker rows found for live updates');
                return;
            }
            
            const randomRow = allRows[Math.floor(Math.random() * allRows.length)];
            const priceCell = randomRow.querySelector('td:nth-child(4)');
            const changeCell = randomRow.querySelector('td:nth-child(5)');
            const changePercentCell = randomRow.querySelector('td:nth-child(6)');
            
            // Get current price and generate new price
            let currentPrice = parseFloat(priceCell.textContent);
            const change = (Math.random() * 2 - 1).toFixed(2);
            const newPrice = (currentPrice + parseFloat(change)).toFixed(2);
            
            // Calculate new percent
            const changePercent = ((change / newPrice) * 100).toFixed(2);
            const isPositive = parseFloat(change) >= 0;
            
            // Flash effect
            priceCell.classList.add(isPositive ? 'flash-positive' : 'flash-negative');
            
            // Update values
            priceCell.textContent = newPrice;
            changeCell.textContent = `${isPositive ? '+' : ''}${change}`;
            changePercentCell.textContent = `${isPositive ? '+' : ''}${changePercent}%`;
            
            // Update classes for color
            changeCell.className = isPositive ? 'positive' : 'negative';
            changePercentCell.className = isPositive ? 'positive' : 'negative';
            
            // Remove flash effect after animation
            setTimeout(() => {
                priceCell.classList.remove('flash-positive', 'flash-negative');
            }, 1000);
            
        } catch (error) {
            console.error('Error in live data update:', error);
        }
    }, 5000);
    
    // Set the logged in user info if available
    if (typeof currentUser !== 'undefined' && currentUser) {
        document.querySelector('.navbar .d-flex:last-child').innerHTML = `
            <div class="user-info me-3">
                <i class="fas fa-user-circle me-1"></i> ${currentUser}
            </div>
            <button class="btn btn-outline-light">Logout</button>
        `;
    }
});

// Set current user
const currentUser = '';