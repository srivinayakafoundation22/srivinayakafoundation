// Donate page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Amount selection functionality
    const amountButtons = document.querySelectorAll('.amount-btn');
    const amountInput = document.querySelector('.amount-input');
    const donationAmountDisplay = document.getElementById('donationAmount');
    const tipAmountDisplay = document.getElementById('tipAmount');
    const totalAmountDisplay = document.getElementById('totalAmount');
    const proceedBtn = document.getElementById('proceedBtn');
    
    let currentAmount = 2500; // Default amount
    let tipPercentage = 8; // Default tip percentage
    
    // Initialize with default values
    updateSummary();
    
    // Amount button selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Update current amount
            currentAmount = parseInt(this.getAttribute('data-amount'));
            
            // Clear custom input
            amountInput.value = '';
            
            // Update summary
            updateSummary();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Custom amount input
    amountInput.addEventListener('input', function() {
        const customAmount = parseInt(this.value);
        
        if (customAmount && customAmount >= 300) {
            // Remove selected class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Update current amount
            currentAmount = customAmount;
            
            // Update summary
            updateSummary();
        } else if (!this.value) {
            // If input is empty, select default amount
            currentAmount = 2500;
            amountButtons[1].classList.add('selected'); // Select the popular option
            updateSummary();
        }
    });
    
    // Tip percentage functionality
    const tipPercentageElement = document.querySelector('.tip-percentage');
    tipPercentageElement.addEventListener('click', function() {
        // Create dropdown for tip percentage (simplified)
        const tipOptions = [0, 5, 8, 10, 15];
        const currentIndex = tipOptions.indexOf(tipPercentage);
        const nextIndex = (currentIndex + 1) % tipOptions.length;
        
        tipPercentage = tipOptions[nextIndex];
        document.querySelector('.tip-percent').textContent = tipPercentage + '%';
        
        updateSummary();
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Update summary function
    function updateSummary() {
        const tipAmount = Math.round((currentAmount * tipPercentage) / 100);
        const tipAmountDisplay = document.getElementById('tipAmount');
        const totalAmountDisplay = document.getElementById('totalAmount');
        const totalAmount = currentAmount + tipAmount;
        
        donationAmountDisplay.textContent = `₹${currentAmount.toLocaleString()}`;
        tipAmountDisplay.textContent = `₹${tipAmount.toLocaleString()}`;
        totalAmountDisplay.textContent = `₹${totalAmount.toLocaleString()}`;
        proceedBtn.innerHTML = `
            Proceed to pay ₹${totalAmount.toLocaleString()}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        `;
    }
    
    // Form validation and submission
    const donorForm = document.getElementById('donorForm');
    const proceedButton = document.getElementById('proceedBtn');
    
    proceedButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate form
        const formData = new FormData(donorForm);
        const data = Object.fromEntries(formData);
        
        // Check required fields
        const requiredFields = ['fullName', 'email', 'phone', 'address'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!data[field] || data[field].trim() === '') {
                input.style.borderColor = '#ef4444';
                input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                isValid = false;
            } else {
                input.style.borderColor = '#22c55e';
                input.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            document.getElementById('email').style.borderColor = '#ef4444';
            document.getElementById('email').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        this.disabled = true;
        this.innerHTML = `
            <div class="loading-spinner"></div>
            Processing...
        `;
        this.style.background = '#9ca3af';
        
        // Simulate payment processing
        setTimeout(() => {
            showPaymentSuccess();
        }, 3000);
    });
    
    // Show payment success
    function showPaymentSuccess() {
        const successModal = document.createElement('div');
        successModal.className = 'payment-success-modal';
        successModal.innerHTML = `
            <div class="success-overlay">
                <div class="success-content">
                    <div class="success-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>Thank you for your generous donation of ₹${(currentAmount + Math.round((currentAmount * tipPercentage) / 100)).toLocaleString()}</p>
                    <p>You will receive a confirmation email and tax certificate shortly.</p>
                    <div class="success-actions">
                        <button class="success-btn primary" onclick="window.location.href='index.html'">Back to Home</button>
                        <button class="success-btn secondary" onclick="window.print()">Print Receipt</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(successModal);
        
        setTimeout(() => {
            successModal.querySelector('.success-overlay').style.opacity = '1';
            successModal.querySelector('.success-content').style.transform = 'translateY(0) scale(1)';
        }, 10);
    }
    
    // Real-time form validation
    const formInputs = donorForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
                this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(this.value)) {
                    this.style.borderColor = '#22c55e';
                    this.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                } else {
                    this.style.borderColor = '#ef4444';
                    this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            } else if (this.value.trim()) {
                this.style.borderColor = '#22c55e';
                this.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
            } else {
                this.style.borderColor = '#e5e7eb';
                this.style.boxShadow = 'none';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#ef4444';
            this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        });
    });
    
    // Notification system (reuse from main script)
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        const closeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        };
        
        notification.querySelector('.notification-close').addEventListener('click', closeNotification);
        
        setTimeout(closeNotification, 5000);
    }
    
    // Initialize with popular amount selected
    amountButtons[1].classList.add('selected');
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
});

// Additional CSS for success modal and loading spinner
const additionalStyles = `
.payment-success-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
}

.success-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(5px);
}

.success-content {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    transform: translateY(-50px) scale(0.9);
    transition: transform 0.3s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.success-icon {
    width: 80px;
    height: 80px;
    background: #22c55e;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
}

.success-content h2 {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
}

.success-content p {
    font-size: 16px;
    color: #666;
    margin-bottom: 12px;
    line-height: 1.5;
}

.success-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 32px;
}

.success-btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.success-btn.primary {
    background: #ef4444;
    color: white;
}

.success-btn.primary:hover {
    background: #dc2626;
    transform: translateY(-2px);
}

.success-btn.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.success-btn.secondary:hover {
    background: #e5e7eb;
    transform: translateY(-2px);
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .success-content {
        padding: 30px 20px;
        margin: 20px;
    }
    
    .success-actions {
        flex-direction: column;
    }
    
    .success-btn {
        width: 100%;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);