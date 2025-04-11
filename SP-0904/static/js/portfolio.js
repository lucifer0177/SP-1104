document.addEventListener('DOMContentLoaded', function() {
    // Set current date and time
    document.getElementById('currentDateTime').textContent = '2025-04-08 06:27:53';
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Portfolio value chart
    const portfolioValueCtx = document.getElementById('portfolioValueChart').getContext('2d');
    const portfolioValueChart = new Chart(portfolioValueCtx, {
        type: 'line',
        data: {
            labels: ['Mar 8', 'Mar 15', 'Mar 22', 'Mar 29', 'Apr 5', 'Apr 8'],
            datasets: [{
                label: 'Portfolio Value',
                data: [118520, 121458, 123785, 125214, 127195, 128452],
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
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return 'Value: $' + value.toLocaleString();
                        }
                    }
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
                        color: '#a0aec0',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Allocation chart (doughnut)
    const allocationCtx = document.getElementById('allocationChart').getContext('2d');
    const allocationChart = new Chart(allocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical', 'Energy', 'Cash'],
            datasets: [{
                data: [44, 20, 12, 8, 6, 10],
                backgroundColor: [
                    '#4dacff',
                    '#4cd964',
                    '#ffcc00',
                    '#ff9500',
                    '#ff3b30',
                    '#a2a2a2'
                ],
                borderColor: 'rgba(21, 28, 48, 0.8)',
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(32, 41, 64, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#e1e1e1',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return context.label + ': ' + value + '%';
                        }
                    }
                }
            }
        }
    });
    
    // Performance comparison chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    const performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [
                {
                    label: 'Portfolio',
                    data: [3.2, 8.7, 14.6, 18.45],
                    borderColor: '#4dacff',
                    backgroundColor: 'rgba(77, 172, 255, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#4dacff',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'S&P 500',
                    data: [2.3, 6.1, 10.2, 12.73],
                    borderColor: '#a2a2a2',
                    borderWidth: 2,
                    pointBackgroundColor: '#a2a2a2',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#a0aec0',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(32, 41, 64, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#e1e1e1',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return context.dataset.label + ': ' + value + '%';
                        }
                    }
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
                        color: '#a0aec0',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
    
    // Time period buttons for portfolio value chart
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart data based on period
            const period = this.getAttribute('data-period');
            let chartData, labels;
            
            switch(period) {
                case '1d':
                    labels = ['9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:00'];
                    chartData = [127850, 127920, 128150, 127980, 128210, 128340, 128380, 128452];
                    break;
                case '1w':
                    labels = ['Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8'];
                    chartData = [126420, 126850, 127120, 127430, 127650, 127980, 128452];
                    break;
                case '1m':
                    labels = ['Mar 8', 'Mar 15', 'Mar 22', 'Mar 29', 'Apr 5', 'Apr 8'];
                    chartData = [118520, 121458, 123785, 125214, 127195, 128452];
                    break;
                case '3m':
                    labels = ['Jan', 'Feb', 'Mar', 'Apr'];
                    chartData = [108520, 114520, 125450, 128452];
                    break;
                case '1y':
                    labels = ['Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Apr 2025'];
                    chartData = [95450, 102350, 113520, 124750, 128452];
                    break;
                case 'all':
                    labels = ['2023', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', 'Apr 2025'];
                    chartData = [65450, 76580, 85450, 95350, 109620, 124750, 128452];
                    break;
            }
            
            // Update chart data
            portfolioValueChart.data.labels = labels;
            portfolioValueChart.data.datasets[0].data = chartData;
            portfolioValueChart.update();
            
            // Update value change based on period
            let changeAmount, changePercent, isPositive;
            
            switch(period) {
                case '1d':
                    changeAmount = 602;
                    changePercent = 0.47;
                    break;
                case '1w':
                    changeAmount = 2032;
                    changePercent = 1.61;
                    break;
                case '1m':
                    changeAmount = 9932;
                    changePercent = 8.38;
                    break;
                case '3m':
                    changeAmount = 19932;
                    changePercent = 18.38;
                    break;
                case '1y':
                    changeAmount = 33002;
                    changePercent = 34.62;
                    break;
                case 'all':
                    changeAmount = 63002;
                    changePercent = 96.26;
                    break;
            }
            
            isPositive = changeAmount >= 0;
            
            // Update the display
            const valueChangeElement = document.querySelector('.value-change');
            valueChangeElement.className = `value-change ${isPositive ? 'positive' : 'negative'}`;
            valueChangeElement.innerHTML = `
                <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i> 
                $${Math.abs(changeAmount).toLocaleString()} (${isPositive ? '+' : '-'}${Math.abs(changePercent)}%)
            `;
        });
    });
    
    // Handle buy and sell button clicks
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticker = this.getAttribute('data-ticker');
            
            // Set the ticker in the modal and show modal
            document.getElementById('buySymbol').value = ticker;
            
            // Set current price based on ticker
            const prices = {
                'AAPL': 246.78,
                'MSFT': 412.36,
                'GOOGL': 178.32,
                'AMZN': 196.48,
                'NVDA': 875.62,
                'JNJ': 168.32,
                'V': 285.42,
                'XOM': 118.57
            };
            
            document.getElementById('buyPrice').value = prices[ticker] || '0.00';
            
            // Show the modal
            const tradeModal = new bootstrap.Modal(document.getElementById('tradeModal'));
            tradeModal.show();
            
            // Set tab to Buy
            document.getElementById('buy-tab').click();
        });
    });
    
    // Removed duplicate 'DOMContentLoaded' event listener block
        
        // Time period buttons for portfolio value chart
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update chart data based on period
                const period = this.getAttribute('data-period');
                let chartData, labels;
                
                switch(period) {
                    case '1d':
                        labels = ['9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:00'];
                        chartData = [127850, 127920, 128150, 127980, 128210, 128340, 128380, 128452];
                        break;
                    case '1w':
                        labels = ['Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8'];
                        chartData = [126420, 126850, 127120, 127430, 127650, 127980, 128452];
                        break;
                    case '1m':
                        labels = ['Mar 8', 'Mar 15', 'Mar 22', 'Mar 29', 'Apr 5', 'Apr 8'];
                        chartData = [118520, 121458, 123785, 125214, 127195, 128452];
                        break;
                    case '3m':
                        labels = ['Jan', 'Feb', 'Mar', 'Apr'];
                        chartData = [108520, 114520, 125450, 128452];
                        break;
                    case '1y':
                        labels = ['Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Apr 2025'];
                        chartData = [95450, 102350, 113520, 124750, 128452];
                        break;
                    case 'all':
                        labels = ['2023', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', 'Apr 2025'];
                        chartData = [65450, 76580, 85450, 95350, 109620, 124750, 128452];
                        break;
                }
                
                // Update chart data
                portfolioValueChart.data.labels = labels;
                portfolioValueChart.data.datasets[0].data = chartData;
                portfolioValueChart.update();
                
                // Update value change based on period
                let changeAmount, changePercent, isPositive;
                
                switch(period) {
                    case '1d':
                        changeAmount = 602;
                        changePercent = 0.47;
                        break;
                    case '1w':
                        changeAmount = 2032;
                        changePercent = 1.61;
                        break;
                    case '1m':
                        changeAmount = 9932;
                        changePercent = 8.38;
                        break;
                    case '3m':
                        changeAmount = 19932;
                        changePercent = 18.38;
                        break;
                    case '1y':
                        changeAmount = 33002;
                        changePercent = 34.62;
                        break;
                    case 'all':
                        changeAmount = 63002;
                        changePercent = 96.26;
                        break;
                }
                
                isPositive = changeAmount >= 0;
                
                // Update the display
                const valueChangeElement = document.querySelector('.value-change');
                valueChangeElement.className = `value-change ${isPositive ? 'positive' : 'negative'}`;
                valueChangeElement.innerHTML = `
                    <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i> 
                    $${Math.abs(changeAmount).toLocaleString()} (${isPositive ? '+' : '-'}${Math.abs(changePercent)}%)
                `;
            });
        });
        
        // Handle buy and sell button clicks
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ticker = this.getAttribute('data-ticker');
                
                // Set the ticker in the modal and show modal
                document.getElementById('buySymbol').value = ticker;
                
                // Set current price based on ticker
                const prices = {
                    'AAPL': 246.78,
                    'MSFT': 412.36,
                    'GOOGL': 178.32,
                    'AMZN': 196.48,
                    'NVDA': 875.62,
                    'JNJ': 168.32,
                    'V': 285.42,
                    'XOM': 118.57
                };
                
                document.getElementById('buyPrice').value = prices[ticker] || '0.00';
                
                // Show the modal
                const tradeModal = new bootstrap.Modal(document.getElementById('tradeModal'));
                tradeModal.show();
                
                // Set tab to Buy
                document.getElementById('buy-tab').click();
            });
        });
        
        document.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ticker = this.getAttribute('data-ticker');
                
                // Set the position in the modal dropdown
                const sellPositionSelect = document.getElementById('sellPosition');
                for(let i = 0; i < sellPositionSelect.options.length; i++) {
                    if(sellPositionSelect.options[i].value === ticker) {
                        sellPositionSelect.selectedIndex = i;
                        break;
                    }
                }
                
                // Set current price based on ticker
                const prices = {
                    'AAPL': 246.78,
                    'MSFT': 412.36,
                    'GOOGL': 178.32,
                    'AMZN': 196.48,
                    'NVDA': 875.62,
                    'JNJ': 168.32,
                    'V': 285.42,
                    'XOM': 118.57
                };
                
                document.getElementById('sellPrice').value = prices[ticker] || '0.00';
                
                // Show the modal
                const tradeModal = new bootstrap.Modal(document.getElementById('tradeModal'));
                tradeModal.show();
                
                // Set tab to Sell
                document.getElementById('sell-tab').click();
            });
        });
        
        // Handle chart button clicks
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ticker = this.getAttribute('data-ticker');
                // In a real app, this would open a detailed chart view
                // For this demo, we'll redirect to the prediction page
                window.location.href = `/?ticker=${ticker}`;
            });
        });
        
        // Calculate estimated cost when shares or price changes
        document.getElementById('buyShares').addEventListener('input', calculateEstimatedCost);
        document.getElementById('buySymbol').addEventListener('change', updateBuyPrice);
        
        function calculateEstimatedCost() {
            const shares = parseFloat(document.getElementById('buyShares').value) || 0;
            const price = parseFloat(document.getElementById('buyPrice').value) || 0;
            const estimatedCost = shares * price;
            document.getElementById('estimatedCost').textContent = '$' + estimatedCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('totalCost').textContent = '$' + estimatedCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        
        function updateBuyPrice() {
            const ticker = document.getElementById('buySymbol').value;
            const prices = {
                'AAPL': 246.78,
                'MSFT': 412.36,
                'GOOGL': 178.32,
                'AMZN': 196.48,
                'NVDA': 875.62,
                'JNJ': 168.32,
                'V': 285.42,
                'XOM': 118.57
            };
            
            document.getElementById('buyPrice').value = prices[ticker] || '0.00';
            calculateEstimatedCost();
        }
        
        // Calculate estimated proceeds when shares or price changes
        document.getElementById('sellShares').addEventListener('input', calculateEstimatedProceeds);
        document.getElementById('sellPosition').addEventListener('change', updateSellPrice);
        
        function calculateEstimatedProceeds() {
            const shares = parseFloat(document.getElementById('sellShares').value) || 0;
            const price = parseFloat(document.getElementById('sellPrice').value) || 0;
            const estimatedProceeds = shares * price;
            document.getElementById('estimatedProceeds').textContent = '$' + estimatedProceeds.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('totalProceeds').textContent = '$' + estimatedProceeds.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        
        function updateSellPrice() {
            const ticker = document.getElementById('sellPosition').value;
            const prices = {
                'AAPL': 246.78,
                'MSFT': 412.36,
                'GOOGL': 178.32,
                'AMZN': 196.48,
                'NVDA': 875.62,
                'JNJ': 168.32,
                'V': 285.42,
                'XOM': 118.57
            };
            
            document.getElementById('sellPrice').value = prices[ticker] || '0.00';
            calculateEstimatedProceeds();
        }
        
        // Handle order type changes
        document.getElementById('buyOrderType').addEventListener('change', function() {
            const orderType = this.value;
            const limitPriceDiv = document.getElementById('limitPriceDiv');
            
            if(orderType === 'limit' || orderType === 'stop') {
                limitPriceDiv.classList.remove('d-none');
            } else {
                limitPriceDiv.classList.add('d-none');
            }
        });
        
        document.getElementById('sellOrderType').addEventListener('change', function() {
            const orderType = this.value;
            const limitPriceDiv = document.getElementById('sellLimitPriceDiv');
            
            if(orderType === 'limit' || orderType === 'stop') {
                limitPriceDiv.classList.remove('d-none');
            } else {
                limitPriceDiv.classList.add('d-none');
            }
        });
        
        // Handle funding source change
        document.getElementById('fundingSource').addEventListener('change', function() {
            const source = this.value;
            const newFundingDiv = document.getElementById('newFundingDiv');
            
            if(source === 'new') {
                newFundingDiv.classList.remove('d-none');
            } else {
                newFundingDiv.classList.add('d-none');
            }
        });
        
        // Handle deposit frequency change
        document.getElementById('depositFrequency').addEventListener('change', function() {
            const frequency = this.value;
            const recurringDepositDiv = document.getElementById('recurringDepositDiv');
            
            if(frequency !== 'oneTime') {
                recurringDepositDiv.classList.remove('d-none');
            } else {
                recurringDepositDiv.classList.add('d-none');
            }
        });
        
        // Execute trade button click
        document.getElementById('executeTradeBtn').addEventListener('click', function() {
            const activeTab = document.querySelector('#tradeType .nav-link.active');
            const isBuy = activeTab.id === 'buy-tab';
            
            if(isBuy) {
                const symbol = document.getElementById('buySymbol').value;
                const shares = parseInt(document.getElementById('buyShares').value) || 0;
                const price = parseFloat(document.getElementById('buyPrice').value) || 0;
                const orderType = document.getElementById('buyOrderType').value;
                
                if(!symbol) {
                    alert('Please enter a symbol');
                    return;
                }
                
                if(shares <= 0) {
                    alert('Please enter a valid number of shares');
                    return;
                }
                
                // In a real app, this would submit a trade order
                // For demo, show success message
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('tradeModal'));
                modal.hide();
                
                // Show success notification
                showNotification('success', `Order placed: Buy ${shares} shares of ${symbol} at ${orderType} price $${price.toFixed(2)}`);
                
                // Reset form
                document.getElementById('buySymbol').value = '';
                document.getElementById('buyShares').value = '';
                document.getElementById('buyPrice').value = '';
                document.getElementById('buyOrderType').value = 'market';
                document.getElementById('limitPriceDiv').classList.add('d-none');
            } else {
                const position = document.getElementById('sellPosition');
                const symbol = position.value;
                const shares = parseInt(document.getElementById('sellShares').value) || 0;
                const price = parseFloat(document.getElementById('sellPrice').value) || 0;
                const orderType = document.getElementById('sellOrderType').value;
                
                if(!symbol) {
                    alert('Please select a position');
                    return;
                }
                
                if(shares <= 0) {
                    alert('Please enter a valid number of shares');
                    return;
                }
                
                // In a real app, this would submit a trade order
                // For demo, show success message
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('tradeModal'));
                modal.hide();
                
                // Show success notification
                showNotification('success', `Order placed: Sell ${shares} shares of ${symbol} at ${orderType} price $${price.toFixed(2)}`);
                
                // Reset form
                position.selectedIndex = 0;
                document.getElementById('sellShares').value = '';
                document.getElementById('sellPrice').value = '';
                document.getElementById('sellOrderType').value = 'market';
                document.getElementById('sellLimitPriceDiv').classList.add('d-none');
            }
        });
        
        // Deposit button click
        document.getElementById('depositBtn').addEventListener('click', function() {
            const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
            const source = document.getElementById('fundingSource').value;
            const frequency = document.getElementById('depositFrequency').value;
            
            if(amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            
            // In a real app, this would initiate a deposit
            // For demo, show success message
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('depositModal'));
            modal.hide();
            
            // Show success notification
            const frequencyText = frequency === 'oneTime' ? 'One-time' : 
                                 (frequency === 'weekly' ? 'Weekly' :
                                  frequency === 'biweekly' ? 'Bi-weekly' : 'Monthly');
            
            showNotification('success', `${frequencyText} deposit of $${amount.toLocaleString()} initiated`);
            
            // Reset form
            document.getElementById('depositAmount').value = '';
            document.getElementById('fundingSource').value = 'bank1';
            document.getElementById('depositFrequency').value = 'oneTime';
            document.getElementById('newFundingDiv').classList.add('d-none');
            document.getElementById('recurringDepositDiv').classList.add('d-none');
        });
        
        // Helper function to show notifications
        function showNotification(type, message) {
            const toast = document.createElement('div');
            toast.className = 'toast align-items-center text-white border-0 position-fixed bottom-0 end-0 m-3';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            toast.setAttribute('aria-atomic', 'true');
            
            if(type === 'success') {
                toast.style.backgroundColor = 'rgba(76, 217, 100, 0.9)';
            } else if(type === 'warning') {
                toast.style.backgroundColor = 'rgba(255, 204, 0, 0.9)';
            } else if(type === 'error') {
                toast.style.backgroundColor = 'rgba(255, 59, 48, 0.9)';
            } else {
                toast.style.backgroundColor = 'rgba(32, 41, 64, 0.9)';
            }
            
            toast.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                         type === 'warning' ? 'exclamation-circle' : 
                                         type === 'error' ? 'times-circle' : 'info-circle'}"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            `;
            
            document.body.appendChild(toast);
            const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 5000 });
            bsToast.show();
            
            // Remove from DOM after hiding
            toast.addEventListener('hidden.bs.toast', function() {
                document.body.removeChild(toast);
            });
        }
        
        // Search holdings functionality
        document.getElementById('searchHoldings').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.portfolio-table tbody tr');
            
            rows.forEach(row => {
                const symbol = row.querySelector('td:first-child').textContent.toLowerCase();
                const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                if(symbol.includes(searchTerm) || name.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
        
        // Sort holdings functionality
        document.querySelectorAll('#sortDropdown .dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const sortType = this.getAttribute('data-sort');
                sortHoldings(sortType);
            });
        });
        
        function sortHoldings(sortType) {
            const tbody = document.querySelector('.portfolio-table tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            // Sort the rows
            rows.sort((a, b) => {
                let aValue, bValue;
                
                switch(sortType) {
                    case 'name':
                        aValue = a.querySelector('td:nth-child(2)').textContent;
                        bValue = b.querySelector('td:nth-child(2)').textContent;
                        return aValue.localeCompare(bValue);
                    case 'value-desc':
                        aValue = parseFloat(a.querySelector('td:nth-child(8)').textContent.replace(/[^0-9.-]+/g, ''));
                        bValue = parseFloat(b.querySelector('td:nth-child(8)').textContent.replace(/[^0-9.-]+/g, ''));
                        return bValue - aValue;
                    case 'value-asc':
                        aValue = parseFloat(a.querySelector('td:nth-child(8)').textContent.replace(/[^0-9.-]+/g, ''));
                        bValue = parseFloat(b.querySelector('td:nth-child(8)').textContent.replace(/[^0-9.-]+/g, ''));
                        return aValue - bValue;
                    case 'gain-desc':
                        aValue = parseFloat(a.querySelector('td:nth-child(7)').textContent.match(/\(([^)]+)\)/)[1].replace(/[^0-9.-]+/g, ''));
                        bValue = parseFloat(b.querySelector('td:nth-child(7)').textContent.match(/\(([^)]+)\)/)[1].replace(/[^0-9.-]+/g, ''));
                        return bValue - aValue;
                    case 'gain-asc':
                        aValue = parseFloat(a.querySelector('td:nth-child(7)').textContent.match(/\(([^)]+)\)/)[1].replace(/[^0-9.-]+/g, ''));
                        bValue = parseFloat(b.querySelector('td:nth-child(7)').textContent.match(/\(([^)]+)\)/)[1].replace(/[^0-9.-]+/g, ''));
                        return aValue - bValue;
                    default:
                        return 0;
                }
            });
            
            // Clear and re-add rows in sorted order
            while(tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            
            rows.forEach(row => tbody.appendChild(row));
            
            // Show notification
            let sortDescription = '';
            switch(sortType) {
                case 'name':
                    sortDescription = 'Name (A-Z)';
                    break;
                case 'value-desc':
                    sortDescription = 'Value (High-Low)';
                    break;
                case 'value-asc':
                    sortDescription = 'Value (Low-High)';
                    break;
                case 'gain-desc':
                    sortDescription = 'Gain (High-Low)';
                    break;
                case 'gain-asc':
                    sortDescription = 'Gain (Low-High)';
                    break;
            }
            
            showNotification('info', `Holdings sorted by: ${sortDescription}`);
        }
    
        // Live data simulation - update a random position every few seconds
        setInterval(() => {
            // Select a random position
            const allRows = document.querySelectorAll('.position-row');
            if (allRows.length === 0) return;
            
            const randomRow = allRows[Math.floor(Math.random() * allRows.length)];
            const priceCell = randomRow.querySelector('td:nth-child(5)');
            const todayReturnCell = randomRow.querySelector('td:nth-child(6)');
            
            // Get current price and generate new price
            let currentPrice = parseFloat(priceCell.textContent.replace(/[^\d.-]/g, ''));
            const changeAmount = (Math.random() * 2 - 1).toFixed(2);
            const newPrice = (currentPrice + parseFloat(changeAmount)).toFixed(2);
            
            // Calculate new day return
            const shares = parseInt(randomRow.querySelector('td:nth-child(3)').textContent);
            const dayChangeAmount = (shares * parseFloat(changeAmount)).toFixed(2);
            const dayChangePercent = (parseFloat(changeAmount) / newPrice * 100).toFixed(2);
            const isDayPositive = parseFloat(dayChangeAmount) >= 0;
            
            // Flash effect
            priceCell.classList.add(isDayPositive ? 'flash-positive' : 'flash-negative');
            
            // Update values
            priceCell.textContent = `$${newPrice}`;
            todayReturnCell.textContent = `${isDayPositive ? '+' : ''}$${Math.abs(dayChangeAmount)} (${isDayPositive ? '+' : ''}${Math.abs(dayChangePercent)}%)`;
            todayReturnCell.className = isDayPositive ? 'positive' : 'negative';
            
            // Update total portfolio value
            const currentPortfolioValue = parseFloat(document.querySelector('.value-amount').textContent.replace(/[^\d.-]/g, ''));
            const newPortfolioValue = (currentPortfolioValue + parseFloat(dayChangeAmount)).toFixed(2);
            document.querySelector('.value-amount').textContent = `$${numberWithCommas(newPortfolioValue)}`;
            
            // Remove flash effect after animation
            setTimeout(() => {
                priceCell.classList.remove('flash-positive', 'flash-negative');
            }, 1000);
            
        }, 8000);
    
        // Helper function for number formatting
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    
        // Set current user if defined (already in HTML)
        if (document.querySelector('.user-info')) {
            document.querySelector('.user-info').innerHTML = `<i class="fas fa-user-circle me-1"></i> lucifer0177`;
        }
    });