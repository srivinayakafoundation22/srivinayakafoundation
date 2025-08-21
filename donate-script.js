document.addEventListener('DOMContentLoaded', function() {
    // ... (All your existing code for amount selection and summary updates remains the same)
    const amountButtons = document.querySelectorAll('.amount-btn');
    const amountInput = document.querySelector('.amount-input');
    const donationAmountDisplay = document.getElementById('donationAmount');
    const tipAmountDisplay = document.getElementById('tipAmount');
    const totalAmountDisplay = document.getElementById('totalAmount');
    const proceedBtn = document.getElementById('proceedBtn');
    
    let currentAmount = 2500;
    let tipPercentage = 8;
    
    updateSummary();
    
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            currentAmount = parseInt(this.getAttribute('data-amount'));
            amountInput.value = '';
            updateSummary();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    });
    
    amountInput.addEventListener('input', function() {
        const customAmount = parseInt(this.value);
        if (customAmount && customAmount >= 0) {
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            currentAmount = customAmount;
            updateSummary();
        } else if (!this.value) {
            currentAmount = 2500;
            amountButtons[1].classList.add('selected');
            updateSummary();
        }
    });
    
    const tipPercentageElement = document.querySelector('.tip-percentage');
    tipPercentageElement.addEventListener('click', function() {
        const tipOptions = [0, 5, 8, 10, 15];
        const currentIndex = tipOptions.indexOf(tipPercentage);
        const nextIndex = (currentIndex + 1) % tipOptions.length;
        tipPercentage = tipOptions[nextIndex];
        document.querySelector('.tip-percent').textContent = tipPercentage + '%';
        updateSummary();
        this.style.transform = 'scale(0.95)';
        setTimeout(() => { this.style.transform = ''; }, 150);
    });
    
    function updateSummary() {
        const tipAmount = Math.round((currentAmount * tipPercentage) / 100);
        const totalAmount = currentAmount + tipAmount;
        donationAmountDisplay.textContent = `₹${currentAmount.toLocaleString()}`;
        tipAmountDisplay.textContent = `₹${tipAmount.toLocaleString()}`;
        totalAmountDisplay.textContent = `₹${totalAmount.toLocaleString()}`;
        proceedBtn.innerHTML = `
            Proceed to pay ₹${totalAmount.toLocaleString()}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
        `;
    }
    
    const donorForm = document.getElementById('donorForm');
    const proceedButton = document.getElementById('proceedBtn');
    
    // ===================================================================
    // MODIFIED SECTION: This is the part that has been changed for Razorpay
    // ===================================================================
    
    proceedButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // 1. Validate form
        const requiredFields = ['fullName', 'email', 'phone', 'address'];
        let isValid = true;
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value || input.value.trim() === '') {
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                input.style.borderColor = '#22c55e';
            }
        });
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = document.getElementById('email');
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
            isValid = false;
        }

        if (!isValid) {
            showNotification('Please fill in all required fields with valid information.', 'error');
            return;
        }

        // 2. Show loading state
        this.disabled = true;
        this.innerHTML = `<div class="loading-spinner"></div> Processing...`;
        this.style.background = '#9ca3af';

        // 3. Create Razorpay order by calling our serverless function
        const tipAmount = Math.round((currentAmount * tipPercentage) / 100);
        const totalAmount = currentAmount + tipAmount;

        try {
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount }),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment order.');
            }

            const order = await response.json();

            // 4. Configure Razorpay options and open checkout
            const options = {
                key: "rzp_live_R7zPmr4qLF9EIH", // This is your public key
                amount: order.amount,
                currency: "INR",
                name: "Sri Vinayaka Foundation",
                description: "Donation to support our causes",
                image: "public/logo/logo.png",
                order_id: order.id,
                handler: function (response){
                    // This function is called after a successful payment
                    console.log('Payment successful:', response);
                    showPaymentSuccess();
                },
                prefill: {
                    name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    contact: document.getElementById('phone').value
                },
                notes: {
                    address: document.getElementById('address').value
                },
                theme: {
                    color: "#ef4444"
                },
                modal: {
                    ondismiss: function() {
                        // This function is called when the user closes the modal
                        console.log('Payment modal closed');
                        // Restore button state
                        proceedButton.disabled = false;
                        updateSummary(); // Resets the button text and amount
                        proceedButton.style.background = '#ef4444';
                    }
                }
            };
            
            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Error:', error);
            showNotification('Payment failed. Please try again.', 'error');
            // Restore button state
            this.disabled = false;
            updateSummary();
            this.style.background = '#ef4444';
        }
    });

    // ===============================================================
    // END OF MODIFIED SECTION
    // ===============================================================

    // All your other functions (showPaymentSuccess, showNotification, etc.) remain the same
    function showPaymentSuccess() {
        const totalAmount = currentAmount + Math.round((currentAmount * tipPercentage) / 100);
        const successModal = document.createElement('div');
        successModal.className = 'payment-success-modal';
        successModal.innerHTML = `
            <div class="success-overlay">
                <div class="success-content">
                    <div class="success-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>Thank you for your generous donation of ₹${totalAmount.toLocaleString()}</p>
                    <p>You will receive a confirmation email and tax certificate shortly.</p>
                    <div class="success-actions">
                        <button class="success-btn primary" onclick="window.location.href='index.html'">Back to Home</button>
                        <button class="success-btn secondary" onclick="window.print()">Print Receipt</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(successModal);
        setTimeout(() => {
            successModal.querySelector('.success-overlay').style.opacity = '1';
            successModal.querySelector('.success-content').style.transform = 'translateY(0) scale(1)';
        }, 10);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>`;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; notification.style.opacity = '1'; }, 10);
        const closeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => { if (notification.parentNode) { document.body.removeChild(notification); } }, 300);
        };
        notification.querySelector('.notification-close').addEventListener('click', closeNotification);
        setTimeout(closeNotification, 5000);
    }
    
    // ... (rest of your existing code like form validation on blur, loading animations, etc.)
    amountButtons[1].classList.add('selected');
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    window.addEventListener('load', function() { document.body.style.opacity = '1'; });
});

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);