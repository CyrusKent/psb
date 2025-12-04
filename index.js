// index.js - Enhanced Authentication for PlastiCycle

document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    const registerLink = document.querySelector('.register-link-btn');
    const loginLink = document.querySelector('.login-link-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Get all created users from localStorage or initialize empty array
    let allUsers = JSON.parse(localStorage.getItem('plastiCycleUsers')) || [];
    
    // Pre-populate with demo users if none exist
    if (allUsers.length === 0) {
        const demoUsers = [
            { 
                id: 1,
                username: 'admin', 
                email: 'admin@plasticycle.com',
                password: 'admin123', 
                points: 154,
                memberSince: '2024-01-01',
                transactions: [
                    { date: '2024-12-02', type: 'redeem', amount: 20, description: 'Redeemed Code: PLASTIC20' },
                    { date: '2024-12-01', type: 'recycle', amount: 15, description: 'PET Bottles (5 units)' }
                ]
            },
            { 
                id: 2,
                username: 'cyrus', 
                email: 'cyrus@example.com',
                password: 'password123', 
                points: 100,
                memberSince: '2024-11-15',
                transactions: []
            }
        ];
        
        allUsers = demoUsers;
        localStorage.setItem('plastiCycleUsers', JSON.stringify(allUsers));
    }
    
    // Toggle between login and register forms
    function showRegister() {
        container.classList.add('active');
    }
    
    function showLogin() {
        container.classList.remove('active');
    }
    
    if (registerBtn) registerBtn.addEventListener('click', showRegister);
    if (loginBtn) loginBtn.addEventListener('click', showLogin);
    if (registerLink) registerLink.addEventListener('click', showRegister);
    if (loginLink) loginLink.addEventListener('click', showLogin);
    
    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('bxs-lock-alt');
            this.classList.toggle('bxs-lock-open');
        });
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('register-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strengthDiv = this.parentElement.querySelector('.password-strength');
            if (strengthDiv) {
                const password = this.value;
                let strength = 0;
                let message = '';
                let color = '#ef4444'; // red
                
                if (password.length >= 8) strength++;
                if (/[A-Z]/.test(password)) strength++;
                if (/[0-9]/.test(password)) strength++;
                if (/[^A-Za-z0-9]/.test(password)) strength++;
                
                switch(strength) {
                    case 0:
                        message = 'Very Weak';
                        color = '#ef4444';
                        break;
                    case 1:
                        message = 'Weak';
                        color = '#f97316';
                        break;
                    case 2:
                        message = 'Fair';
                        color = '#eab308';
                        break;
                    case 3:
                        message = 'Good';
                        color = '#22c55e';
                        break;
                    case 4:
                        message = 'Strong';
                        color = '#10b981';
                        break;
                }
                
                strengthDiv.textContent = message;
                strengthDiv.style.color = color;
                strengthDiv.style.fontSize = '12px';
                strengthDiv.style.marginTop = '5px';
                strengthDiv.style.fontWeight = '600';
            }
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            
            // Show loading state
            const submitBtn = loginForm.querySelector('.btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            
            // Clear previous errors
            clearErrors();
            
            // Validation
            let isValid = true;
            
            if (!username) {
                showError('login-username', 'Username or email is required');
                isValid = false;
            }
            
            if (!password) {
                showError('login-password', 'Password is required');
                isValid = false;
            }
            
            if (!isValid) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Check credentials
            setTimeout(() => {
                // Find user by username OR email
                const user = allUsers.find(u => 
                    (u.username === username || u.email === username) && 
                    u.password === password
                );
                
                if (user) {
                    // Store current user in localStorage
                    localStorage.setItem('plastiCycleCurrentUser', JSON.stringify(user));
                    
                    showMessage('✅ Login successful! Welcome back, ' + user.username + '!', 'success');
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showError('login-password', 'Invalid username or password');
                    showMessage('❌ Invalid credentials. Try: admin / admin123', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 500);
        });
    }
    
    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const confirmPassword = document.getElementById('register-confirm').value.trim();
            const terms = document.getElementById('terms').checked;
            
            // Show loading state
            const submitBtn = registerForm.querySelector('.btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;
            
            // Clear previous errors
            clearErrors();
            
            // Validation
            let isValid = true;
            
            if (!username) {
                showError('register-username', 'Username is required');
                isValid = false;
            } else if (username.length < 3) {
                showError('register-username', 'Username must be at least 3 characters');
                isValid = false;
            } else if (allUsers.some(u => u.username === username)) {
                showError('register-username', 'Username already exists');
                isValid = false;
            }
            
            if (!email) {
                showError('register-email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('register-email', 'Please enter a valid email');
                isValid = false;
            } else if (allUsers.some(u => u.email === email)) {
                showError('register-email', 'Email already registered');
                isValid = false;
            }
            
            if (!password) {
                showError('register-password', 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showError('register-password', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            if (!confirmPassword) {
                showError('register-confirm', 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError('register-confirm', 'Passwords do not match');
                isValid = false;
            }
            
            if (!terms) {
                showMessage('You must agree to the Terms & Conditions', 'error');
                isValid = false;
            }
            
            if (!isValid) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Create new user
            setTimeout(() => {
                const newUser = {
                    id: Date.now(), // Unique ID
                    username: username,
                    email: email,
                    password: password,
                    points: 100, // Starting bonus
                    memberSince: new Date().toISOString().split('T')[0],
                    fullName: '',
                    phone: '',
                    location: '',
                    totalRecycled: 0,
                    transactions: [
                        {
                            date: new Date().toISOString().split('T')[0],
                            type: 'welcome',
                            amount: 100,
                            description: 'Welcome bonus for joining PlastiCycle!'
                        }
                    ]
                };
                
                // Add to users array
                allUsers.push(newUser);
                localStorage.setItem('plastiCycleUsers', JSON.stringify(allUsers));
                
                // Set as current user
                localStorage.setItem('plastiCycleCurrentUser', JSON.stringify(newUser));
                
                showMessage('✅ Account created successfully! Welcome to PlastiCycle!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 500);
        });
    }
    
    // Forgot password functionality
    const forgotLink = document.getElementById('forgot-password');
    const forgotModal = document.getElementById('forgotModal');
    
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotModal.style.display = 'flex';
        });
    }
    
    if (forgotModal) {
        // Cancel button
        const cancelBtn = document.getElementById('cancelReset');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                forgotModal.style.display = 'none';
            });
        }
        
        // Send reset button
        const sendBtn = document.getElementById('sendReset');
        if (sendBtn) {
            sendBtn.addEventListener('click', function() {
                const email = document.getElementById('reset-email').value.trim();
                
                if (!email || !isValidEmail(email)) {
                    showMessage('Please enter a valid email address', 'error');
                    return;
                }
                
                // Check if email exists
                const userExists = allUsers.some(u => u.email === email);
                
                if (userExists) {
                    this.textContent = 'Sending...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        showMessage('✅ Password reset link sent to your email!', 'success');
                        forgotModal.style.display = 'none';
                        this.textContent = 'Send Reset Link';
                        this.disabled = false;
                    }, 1000);
                } else {
                    showMessage('❌ No account found with this email', 'error');
                }
            });
        }
        
        // Close modal when clicking outside
        forgotModal.addEventListener('click', function(e) {
            if (e.target === forgotModal) {
                forgotModal.style.display = 'none';
            }
        });
    }
    
    // Helper functions
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showError(inputId, message) {
        const inputBox = document.getElementById(inputId).parentElement;
        inputBox.classList.add('error');
        const errorDiv = inputBox.querySelector('.error-text');
        errorDiv.textContent = message;
    }
    
    function clearErrors() {
        document.querySelectorAll('.input-box.error').forEach(box => {
            box.classList.remove('error');
        });
        document.querySelectorAll('.error-text').forEach(div => {
            div.textContent = '';
        });
    }
    
    function showMessage(message, type) {
        // Remove any existing messages
        const existingMsg = document.querySelector('.auth-message');
        if (existingMsg) existingMsg.remove();
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.4s ease forwards';
                setTimeout(() => {
                    if (messageDiv.parentNode) messageDiv.remove();
                }, 400);
            }
        }, 4000);
    }
    
    // Auto-fill demo credentials on double click
    const demoUsername = document.getElementById('login-username');
    if (demoUsername) {
        demoUsername.addEventListener('dblclick', function() {
            this.value = 'admin';
            const loginPassword = document.getElementById('login-password');
            if (loginPassword) {
                loginPassword.value = 'admin123';
                showMessage('Demo credentials filled! Click Login to continue.', 'success');
            }
        });
    }
});