document.addEventListener('DOMContentLoaded', function() {
    console.log('profile.js: Initializing...');
    
    // Delay initialization to ensure cart.js runs first
    setTimeout(function() {
        let debounceTimeout;
        const editProfileBtn = document.getElementById('editProfileBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const profileView = document.getElementById('profileView');
        const profileEditForm = document.getElementById('profileEditForm');
        const fileInput = document.getElementById('editProfileImage');
        const avatarPreview = document.querySelector('.avatar-preview');
        const profileImage = avatarPreview?.querySelector('img');
        const defaultAvatar = document.querySelector('.default-avatar');
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const passwordModal = document.querySelector('.modal');
        const modalCloseBtn = passwordModal?.querySelector('.close');
        const currentPasswordInput = document.getElementById('currentPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmNewPassword');
        const savePasswordBtn = document.getElementById('savePasswordBtn');
        const passwordCheckResult = document.getElementById('passwordCheckResult');
        const creditLimitInput = document.getElementById('editCreditLimit');
        const creditLimitValidationResult = document.getElementById('creditLimitValidationResult');
        const saveProfileBtn = document.getElementById('saveProfileBtn');

        const luxeSides = document.querySelectorAll('.luxe-side');
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas?.getContext('2d');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        const celebration = document.getElementById('celebration');

        let confettiParticles = [];
        const confettiCount = 150;
        const gravity = 0.5;
        const terminalVelocity = 5;
        const drag = 0.075;
        const colors = [
            { front: '#ff6666', back: '#ff9999' }, 
            { front: '#66ff66', back: '#99ff99' }, 
            { front: '#6666ff', back: '#9999ff' }, 
            { front: '#ffff66', back: '#ffff99' }, 
            { front: '#ffcc66', back: '#ffcc99' }, 
            { front: '#ff66ff', back: '#ff99ff' },
            { front: '#cc66ff', back: '#cc99ff' }, 
            { front: '#66ffff', back: '#99ffff' }  
        ];
        let animationFrame;

        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                profileView.classList.remove('active');
                profileEditForm.classList.add('active');
            });
        }

        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', function() {
                profileEditForm.classList.remove('active');
                profileView.classList.add('active');
                resetAvatarPreview();
            });
        }

        if (avatarPreview) {
            avatarPreview.addEventListener('click', function(e) {
                if (e.target === avatarPreview || e.target === profileImage) {
                    fileInput.click();
                }
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        profileImage.src = event.target.result;
                        defaultAvatar.style.display = 'none';
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }

        function resetAvatarPreview() {
            if (profileImage && profileImage.dataset.defaultSrc) {
                profileImage.src = profileImage.dataset.defaultSrc;
                defaultAvatar.style.display = 'flex';
                fileInput.value = '';
            }
        }

        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function() {
                document.body.classList.add('modal-open');
                passwordModal.classList.add('show');
            });
        }

        function closePasswordModal() {
            document.body.classList.remove('modal-open');
            passwordModal.classList.remove('show');
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
            passwordCheckResult.textContent = '';
        }

        function showSuccessPopup() {
            const popup = document.getElementById('successPopup');
            
            // Create and add icon element if it doesn't exist
            if (!popup.querySelector('i')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-check-circle';
                popup.insertBefore(icon, popup.firstChild);
            }
            
            popup.style.display = 'block';
            setTimeout(() => {
                popup.classList.add('show');
            }, 10);
            
            // Auto-hide after 4 seconds
            setTimeout(() => {
                popup.classList.remove('show');
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 400);
            }, 4000);
        }

        const passwordMatchResult = document.getElementById('passwordMatchResult');

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                const newPassword = newPasswordInput.value.trim();
                const confirmPassword = this.value.trim();

                if (confirmPassword.length < 1) {
                    passwordMatchResult.textContent = '';
                    savePasswordBtn.disabled = true;
                    return;
                }

                if (newPassword === confirmPassword) {
                    passwordMatchResult.textContent = '✓ Matching';
                    passwordMatchResult.style.color = '#28a745';
                    savePasswordBtn.disabled = !currentPasswordInput.value || !passwordCheckResult.textContent.includes('Correct');
                } else {
                    passwordMatchResult.textContent = '✗ Not Match!';
                    passwordMatchResult.style.color = '#dc3545';
                    savePasswordBtn.disabled = true;
                }
            });
        }

        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function() {
                const newPassword = this.value.trim();
                const confirmPassword = confirmPasswordInput.value.trim();

                if (newPassword.length < 1) {
                    passwordMatchResult.textContent = '';
                    savePasswordBtn.disabled = true;
                    return;
                }

                if (confirmPassword && newPassword === confirmPassword) {
                    passwordMatchResult.textContent = '✓ Matching';
                    passwordMatchResult.style.color = '#28a745';
                    savePasswordBtn.disabled = !currentPasswordInput.value || !passwordCheckResult.textContent.includes('Correct');
                } else if (confirmPassword) {
                    passwordMatchResult.textContent = '✗ Not Match!';
                    passwordMatchResult.style.color = '#dc3545';
                    savePasswordBtn.disabled = true;
                }
            });
        }

        if (currentPasswordInput) {
            currentPasswordInput.addEventListener('input', function() {
                clearTimeout(debounceTimeout);
                const password = this.value.trim();
                
                if (password.length < 1) {
                    passwordCheckResult.textContent = '';
                    return;
                }

                debounceTimeout = setTimeout(async () => {
                    try {
                        const response = await fetch(`${window.contextPath}/checkPassword`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: `currentPassword=${encodeURIComponent(password)}`
                        });

                        console.log('Check Password Response Status:', response.status);
                        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
                        const data = await response.json();
                        console.log('Check Password Response Data:', data);
                        passwordCheckResult.textContent = data.valid ? '✓ Correct' : '✗ Incorrect';
                        passwordCheckResult.style.color = data.valid ? '#28a745' : '#dc3545';
                        savePasswordBtn.disabled = !data.valid;
                    } catch (error) {
                        console.error('Check Password Error:', error);
                        passwordCheckResult.textContent = '✗ Error';
                        passwordCheckResult.style.color = '#dc3545';
                        savePasswordBtn.disabled = true;
                    }
                }, 300);
            });
        }

        if (creditLimitInput) {
            creditLimitInput.addEventListener('input', function() {
                clearTimeout(debounceTimeout);
                const creditLimit = this.value.trim();

                if (creditLimit.length < 1) {
                    creditLimitValidationResult.textContent = '';
                    saveProfileBtn.disabled = true;
                    return;
                }

                debounceTimeout = setTimeout(async () => {
                    try {
                        const response = await fetch(`${window.contextPath}/checkCreditLimit`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: `creditLimit=${encodeURIComponent(creditLimit)}`
                        });

                        console.log('Check Credit Limit Response Status:', response.status);
                        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
                        const data = await response.json();
                        console.log('Check Credit Limit Response Data:', data);
                        creditLimitValidationResult.textContent = data.valid ? '✓ Valid' : '✗ Exceeds $100,000';
                        creditLimitValidationResult.style.color = data.valid ? '#28a745' : '#dc3545';
                        saveProfileBtn.disabled = !data.valid;
                    } catch (error) {
                        console.error('Check Credit Limit Error:', error);
                        creditLimitValidationResult.textContent = '✗ Error';
                        creditLimitValidationResult.style.color = '#dc3545';
                        saveProfileBtn.disabled = true;
                    }
                }, 300);
            });
        }

        if (savePasswordBtn) {
            savePasswordBtn.addEventListener('click', async function() {
                const currentPassword = currentPasswordInput.value.trim();
                const newPassword = newPasswordInput.value.trim();
                const confirmPassword = confirmPasswordInput.value.trim();

                if (!currentPassword || !newPassword || !confirmPassword) {
                    alert('Please fill in all password fields');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    passwordMatchResult.textContent = '✗ Not Match!';
                    passwordMatchResult.style.color = '#dc3545';
                    return;
                }

                try {
                    const response = await fetch(`${window.contextPath}/updatePassword`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: `currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`
                    });

                    console.log('Update Password Response Status:', response.status);
                    if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
                    const data = await response.json();
                    console.log('Update Password Response Data:', data);
                    
                    if (data.success) {
                        showSuccessPopup();
                        closePasswordModal();
                        celebrate();
                    } else {
                        alert(data.message || 'Failed to change password. Please try again.');
                    }
                } catch (error) {
                    console.error('Update Password Error:', error);
                    alert('An error occurred while changing password: ' + error.message);
                }
            });
        }

        // Confetti Functions
        function randomRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        function initConfetti() {
            confettiParticles = [];
            for (let i = 0; i < confettiCount; i++) {
                confettiParticles.push({
                    color: colors[Math.floor(randomRange(0, colors.length))],
                    dimensions: { x: randomRange(10, 20), y: randomRange(10, 30) },
                    position: { x: randomRange(0, canvas.width), y: canvas.height - 1 },
                    rotation: randomRange(0, 2 * Math.PI),
                    scale: { x: 1, y: 1 },
                    velocity: { x: randomRange(-25, 25), y: randomRange(0, -50) }
                });
            }
        }

        function renderConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confettiParticles.forEach((confetto, index) => {
                let width = confetto.dimensions.x * confetto.scale.x;
                let height = confetto.dimensions.y * confetto.scale.y;

                ctx.translate(confetto.position.x, confetto.position.y);
                ctx.rotate(confetto.rotation);

                confetto.velocity.x -= confetto.velocity.x * drag;
                confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
                confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

                confetto.position.x += confetto.velocity.x;
                confetto.position.y += confetto.velocity.y;

                if (confetto.position.y >= canvas.height) confettiParticles.splice(index, 1);

                confetto.scale.y = Math.cos(confetto.position.y * 0.1);
                ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

                ctx.fillRect(-width / 2, -height / 2, width, height);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            });

            if (confettiParticles.length > 0) animationFrame = requestAnimationFrame(renderConfetti);
        }

        function startConfetti() {
            initConfetti();
            renderConfetti();
        }

        function stopConfetti() {
            confettiParticles = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrame);
        }

        function getRandomPosition(existingElements) {
            let top, left;
            let overlap;
            do {
                top = randomRange(10, 90);
                left = randomRange(10, 90);
                overlap = existingElements.some(el => {
                    const rect = el.getBoundingClientRect();
                    return (
                        top > rect.top - 10 && top < rect.bottom + 10 &&
                        left > rect.left - 10 && left < rect.right + 10
                    );
                });
            } while (overlap);
            return { top, left };
        }

        function celebrate() {
            celebration.style.display = 'block';
            startConfetti();

            const existingElements = [];

            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                const { top, left } = getRandomPosition(existingElements);
                confetti.style.top = `${top}%`;
                confetti.style.left = `${left}%`;
                confetti.style.animationDuration = `${randomRange(2, 7)}s`;
                confetti.style.background = colors[Math.floor(randomRange(0, colors.length))].front;
                celebration.appendChild(confetti);
                existingElements.push(confetti);
            }

            setTimeout(() => {
                celebration.style.display = 'none';
                stopConfetti();
                
                const confettiElements = celebration.querySelectorAll('.confetti');
                confettiElements.forEach(el => el.remove());
            }, 1000);
        }

        luxeSides.forEach(side => {
            side.addEventListener('click', function(e) {
                const item = e.target.closest('.chair, .pillow, .table, .lamp, .clock');
                if (!item) return;

                item.style.transition = 'transform 0.3s, opacity 0.3s';
                item.style.transform = 'scale(1.5)';
                item.style.opacity = '0';

                celebrate();

                setTimeout(() => {
                    item.remove();

                    const newItem = document.createElement('div');
                    const classNames = ['chair', 'pillow', 'table', 'lamp', 'clock'];
                    const randomClass = classNames[Math.floor(Math.random() * classNames.length)];
                    newItem.className = randomClass;
                    newItem.style.backgroundImage = `url('https://pngimg.com/uploads/${randomClass}/${randomClass}_PNG${randomClass === 'chair' ? '7066' : randomClass === 'pillow' ? '14203' : randomClass === 'table' ? '6937' : randomClass === 'lamp' ? '101484' : '8'}.png')`;
                    newItem.style.top = `${Math.random() * 70 + 15}%`;
                    newItem.style.left = `${Math.random() * 60 + 20}%`;
                    side.appendChild(newItem);

                    setTimeout(() => {
                        newItem.style.transition = 'none';
                        newItem.style.transform = 'scale(1)';
                        newItem.style.opacity = '1';
                    }, 50);
                }, 300);
            });
        });

        luxeSides.forEach(side => {
            const items = side.querySelectorAll('.chair, .pillow, .table, .lamp, .clock');
            while (items.length < 4) {
                const newItem = document.createElement('div');
                const classNames = ['chair', 'pillow', 'table', 'lamp', 'clock'];
                const randomClass = classNames[Math.floor(Math.random() * classNames.length)];
                newItem.className = randomClass;
                newItem.style.backgroundImage = `url('https://pngimg.com/uploads/${randomClass}/${randomClass}_PNG${randomClass === 'chair' ? '7066' : randomClass === 'pillow' ? '14203' : randomClass === 'table' ? '6937' : randomClass === 'lamp' ? '101484' : '8'}.png')`;
                newItem.style.top = `${Math.random() * 70 + 15}%`;
                newItem.style.left = `${Math.random() * 60 + 20}%`;
                side.appendChild(newItem);
            }
        });

        console.log('profile.js: Initialization complete');
    }, 100);
});