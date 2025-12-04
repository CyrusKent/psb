// dashboard.js - Enhanced with redeem code functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== REDEEM CODE FUNCTIONALITY ==========
    
    // Available codes with point values
    const availableCodes = [
        { code: "PLASTIC20", points: 20, type: "plastic" },
        { code: "RECYCLE15", points: 15, type: "general" },
        { code: "GREEN25", points: 25, type: "bonus" },
        { code: "ECO10", points: 10, type: "general" },
        { code: "BOTTLE30", points: 30, type: "bottle" },
        { code: "SAVE5", points: 5, type: "general" },
        { code: "897234", points: 1, type: "general" },
        { code: "890234", points: 5, type: "general" },
        { code: "236418", points: 5, type: "general" },
        { code: "895382", points: 5, type: "general" },
        { code: "PLANET50", points: 50, type: "special" }
    ];
    
    // Codes already redeemed (stored in localStorage)
    let redeemedCodes = JSON.parse(localStorage.getItem('redeemedCodes')) || [];
    
    // User's current points
    let userPoints = parseInt(document.querySelector('.bal-amount').textContent) || 154;
    
    // Generate 3 random codes to display
    function generateRandomCodes() {
        const shuffled = [...availableCodes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }
    
    // Display available codes
    function displayAvailableCodes() {
        const codesList = document.getElementById('codesList');
        const randomCodes = generateRandomCodes();
        
        codesList.innerHTML = '';
        
        randomCodes.forEach(codeData => {
            const isRedeemed = redeemedCodes.includes(codeData.code);
            
            const codeElement = document.createElement('div');
            codeElement.className = 'code-tag';
            codeElement.style.cssText = `
                padding: 0.5rem 0.75rem;
                background: ${isRedeemed ? '#f3f4f6' : 'var(--primary)'};
                color: ${isRedeemed ? '#9ca3af' : 'white'};
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: ${isRedeemed ? 'default' : 'pointer'};
                opacity: ${isRedeemed ? '0.6' : '1'};
                transition: all 0.2s ease;
            `;
            
            codeElement.textContent = codeData.code;
            codeElement.title = isRedeemed ? 'Already redeemed' : `Click to use - ${codeData.points} points`;
            
            if (!isRedeemed) {
                codeElement.addEventListener('click', function() {
                    document.getElementById('redeemCodeInput').value = codeData.code;
                });
                
                codeElement.addEventListener('mouseenter', function() {
                    if (!isRedeemed) {
                        this.style.transform = 'translateY(-2px)';
                        this.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.2)';
                    }
                });
                
                codeElement.addEventListener('mouseleave', function() {
                    if (!isRedeemed) {
                        this.style.transform = 'translateY(0)';
                        this.style.boxShadow = 'none';
                    }
                });
            }
            
            codesList.appendChild(codeElement);
        });
    }
    
    // Validate and redeem code
    function redeemCode(code) {
        const codeInput = code.toUpperCase().trim();
        const messageDiv = document.getElementById('redeemMessage');
        
        // Clear previous message
        messageDiv.textContent = '';
        messageDiv.style.color = '';
        
        // Check if code is empty
        if (!codeInput) {
            messageDiv.textContent = 'Please enter a code';
            messageDiv.style.color = 'var(--danger)';
            return false;
        }
        
        // Check if already redeemed
        if (redeemedCodes.includes(codeInput)) {
            messageDiv.textContent = 'Code already redeemed';
            messageDiv.style.color = 'var(--danger)';
            return false;
        }
        
        // Find the code in available codes
        const codeData = availableCodes.find(c => c.code === codeInput);
        
        if (!codeData) {
            messageDiv.textContent = 'Invalid code';
            messageDiv.style.color = 'var(--danger)';
            return false;
        }
        
        // Success - redeem the code
        redeemedCodes.push(codeInput);
        localStorage.setItem('redeemedCodes', JSON.stringify(redeemedCodes));
        
        // Add points
        userPoints += codeData.points;
        document.querySelector('.bal-amount').textContent = userPoints;
        
        // Show success message
        document.getElementById('successMessage').textContent = 
            `You redeemed ${codeData.points} points with code ${codeInput}!`;
        document.getElementById('successModal').style.display = 'flex';
        
        // Add to transaction history
        addTransactionToHistory(codeInput, codeData.points);
        
        // Update displayed codes
        displayAvailableCodes();
        
        return true;
    }
    
    // Add transaction to history
    function addTransactionToHistory(code, points) {
        const transactionsSection = document.querySelector('.right-section .section:last-child');
        const transactionsContainer = transactionsSection.querySelector('.tx:first-child').parentNode;
        
        const newTransaction = document.createElement('div');
        newTransaction.className = 'tx';
        newTransaction.innerHTML = `
            <svg class="qr-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v8m0-8a2 2 0 110-4 2 2 0 010 4zm0 0v1m0 7v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <path d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" stroke-width="1.6"/>
                <path d="M12 16l-2-2 2-2 2 2-2 2z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="meta">
                <div class="name">Redeemed Code: ${code}</div>
                <div class="time">${getCurrentDateTime()}</div>
            </div>
            <div class="amount">+${points} Points</div>
        `;
        
        // Insert at the top of transactions
        transactionsContainer.insertBefore(newTransaction, transactionsContainer.firstChild);
    }
    
    // Get current date and time
    function getCurrentDateTime() {
        const now = new Date();
        const month = now.toLocaleString('default', { month: 'short' });
        const day = now.getDate();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${month} ${day} · ${hours}:${minutes}`;
    }
    
    // ========== EVENT LISTENERS ==========
    
    // Redeem Code button click
    const redeemCodeBtn = document.querySelector('.qr-quick');
    if (redeemCodeBtn) {
        redeemCodeBtn.addEventListener('click', function() {
            const modal = document.getElementById('redeemModal');
            if (modal) {
                modal.style.display = 'flex';
                document.getElementById('redeemCodeInput').value = '';
                document.getElementById('redeemMessage').textContent = '';
                displayAvailableCodes();
            }
        });
    }
    
    // Redeem Modal event listeners
    const redeemModal = document.getElementById('redeemModal');
    if (redeemModal) {
        // Cancel button
        const cancelBtn = document.getElementById('cancelRedeem');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                redeemModal.style.display = 'none';
            });
        }
        
        // Confirm redeem button
        const confirmBtn = document.getElementById('confirmRedeem');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                const codeInput = document.getElementById('redeemCodeInput').value;
                if (redeemCode(codeInput)) {
                    redeemModal.style.display = 'none';
                }
            });
        }
        
        // Enter key in input field
        const codeInput = document.getElementById('redeemCodeInput');
        if (codeInput) {
            codeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const codeInput = document.getElementById('redeemCodeInput').value;
                    if (redeemCode(codeInput)) {
                        redeemModal.style.display = 'none';
                    }
                }
            });
        }
        
        // Close modal when clicking outside
        redeemModal.addEventListener('click', function(e) {
            if (e.target === redeemModal) {
                redeemModal.style.display = 'none';
            }
        });
    }
    
    // Success Modal close
    const successModal = document.getElementById('successModal');
    if (successModal) {
        const closeBtn = document.getElementById('closeSuccess');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                successModal.style.display = 'none';
            });
        }
        
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }
    
    // ========== LOGOUT FUNCTIONALITY ==========
    
    // Handle logout button click
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation modal
            const modal = document.getElementById('logoutModal');
            if (modal) {
                modal.style.display = 'flex';
                
                // Handle cancel button
                const cancelBtn = modal.querySelector('.cancel-btn');
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', function() {
                        modal.style.display = 'none';
                    });
                }
                
                // Handle confirm logout button
                const confirmBtn = modal.querySelector('.confirm-btn');
                if (confirmBtn) {
                    confirmBtn.addEventListener('click', function() {
                        // Show loading state
                        this.textContent = 'Logging out...';
                        this.disabled = true;
                        
                        // Clear user data from localStorage
                        localStorage.removeItem('plastiCycleUser');
                        
                        // Redirect to signup page
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 500);
                    });
                }
                
                // Close modal when clicking outside
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            }
        });
    }
});