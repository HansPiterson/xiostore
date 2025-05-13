document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.querySelector('.close-btn');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    body.appendChild(overlay);

    // Function to open sidebar
    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
    }

    // Function to close sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    // Event listeners
    hamburgerMenu.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // Get the first product card (Movie Ticket)
    const movieTicketCard = document.querySelector('.product-card');
    const productPreview = document.getElementById('productPreview');
    const backButton = document.querySelector('.back-button');

    // Show preview when clicking on the movie ticket card
    movieTicketCard.addEventListener('click', function() {
        productPreview.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Hide preview when clicking the back button
    backButton.addEventListener('click', function() {
        productPreview.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Show checkout preview when clicking the buy button
    document.querySelector('.buy-button').addEventListener('click', function() {
        document.getElementById('checkoutPreview').classList.add('active');
        document.getElementById('productPreview').classList.remove('active');
    });

    // Hide checkout preview and return to product preview when clicking the back button
    document.querySelector('.checkout-preview .back-button').addEventListener('click', function() {
        document.getElementById('checkoutPreview').classList.remove('active');
        document.getElementById('productPreview').classList.add('active');
    });

    const confirmButton = document.querySelector('.confirm-button');
    const paymentPreview = document.getElementById('paymentPreview');
    const closeModal = document.querySelector('.close-modal');
    const uploadArea = document.getElementById('uploadArea');
    const paymentProofInput = document.getElementById('payment-proof');
    const previewImage = document.getElementById('preview-image');
    const finishPaymentButton = document.getElementById('finishPayment');
    const buyerForm = document.querySelector('.buyer-info');
    
    // Redirect to payment link
    confirmButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'https://take.app/voucher/pay?amount=31500';
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        paymentPreview.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });
    
    // Handle file input
    paymentProofInput.addEventListener('change', function(e) {
        handleFile(e.target.files[0]);
    });
    
    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File terlalu besar. Maksimal 2MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.style.display = 'block';
                previewImage.innerHTML = `<img src="${e.target.result}" alt="Payment Proof">`;
                uploadArea.style.display = 'none';
                finishPaymentButton.style.display = 'flex';
                
                // Store in localStorage
                localStorage.setItem('paymentProof', e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file');
        }
    }
    
    function validateForm() {
        const name = document.getElementById('name').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const email = document.getElementById('email').value;
        
        if (!name || !whatsapp || !email) {
            alert('Mohon lengkapi semua data');
            return false;
        }
        return true;
    }
    
    // Handle finish payment click
    finishPaymentButton.addEventListener('click', function() {
        // Get form data
        const name = document.getElementById('name').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const email = document.getElementById('email').value;
        
        // Store transaction data
        const transactionData = {
            name: name,
            whatsapp: whatsapp,
            email: email,
            product: 'Tiket Bioskop Promo',
            price: 'Rp 31.500',
            timestamp: new Date().toISOString(),
            paymentProof: localStorage.getItem('paymentProof')
        };
        
        // Store in localStorage
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.push(transactionData);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Prepare WhatsApp message
        const message = `Halo, saya sudah melakukan pembayaran untuk:
        
Produk: Tiket Bioskop Promo
Nama: ${name}
WhatsApp: ${whatsapp}
Email: ${email}
Total: Rp 31.500

Mohon diproses pesanan saya. Terima kasih!`;
        
        // Open WhatsApp
        const waNumber = '+6282182085025'; // Replace with your WhatsApp number
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    });
});