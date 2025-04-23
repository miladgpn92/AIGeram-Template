document.addEventListener('DOMContentLoaded', () => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="text"]')).reverse();
    const resendButton = document.querySelector<HTMLButtonElement>('.text-blue-600');
    const timerSpan = document.querySelector<HTMLSpanElement>('.text-gray-400');
    
    let timeLeft = 60; // یک دقیقه
    let timerId: number | null = null;

    // تابع شروع تایمر
    const startTimer = () => {
        if (resendButton && timerSpan) {
            resendButton.disabled = true;
            resendButton.classList.add('opacity-50', 'cursor-not-allowed');
            timeLeft = 60;
            
            if (timerId) clearInterval(timerId);
            
            timerId = window.setInterval(() => {
                timeLeft--;
                if (timerSpan) {
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    timerSpan.textContent = `(${minutes.toString().padStart(2, '۰')}:${seconds.toString().padStart(2, '۰')})`;
                }
                
                if (timeLeft <= 0) {
                    if (timerId) clearInterval(timerId);
                    if (resendButton) {
                        resendButton.disabled = false;
                        resendButton.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                }
            }, 1000);
        }
    };

    // شروع تایمر در لود صفحه
    startTimer();

    // اضافه کردن event listener برای دکمه ارسال مجدد
    if (resendButton) {
        resendButton.addEventListener('click', () => {
            if (!resendButton.disabled) {
                // اینجا می‌توانید کد مربوط به ارسال مجدد را اضافه کنید
                console.log('درخواست ارسال مجدد کد');
                startTimer();
            }
        });
    }
    
    inputs.forEach((input, index) => {
        // مدیریت ورودی
        input.addEventListener('keydown', (e) => {
            const target = e.target as HTMLInputElement;
            
            // اجازه دادن به کلیدهای خاص
            if (
                e.key === 'Backspace' ||
                e.key === 'Tab' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Delete'
            ) {
                return;
            }

            // جلوگیری از ورود کاراکترهای غیر عددی
            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
                return;
            }
        });

        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            
            // تبدیل اعداد فارسی به انگلیسی
            const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            let value = target.value;
            
            for (let i = 0; i < 10; i++) {
                const regex = new RegExp(persianNumbers[i], 'g');
                value = value.replace(regex, i.toString());
            }
            
            // فقط عدد نگه داشته شود
            value = value.replace(/[^0-9]/g, '');
            
            if (value.length > 0) {
                target.value = value[0];
                // انتقال به فیلد بعدی
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });

        // مدیریت کلید Backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                const target = e.target as HTMLInputElement;
                if (target.value === '') {
                    // اگر این اولین input نیست، به input قبلی برو
                    if (index > 0) {
                        e.preventDefault();
                        inputs[index - 1].focus();
                        inputs[index - 1].value = '';
                    }
                }
            }
        });

        // مدیریت Paste کردن
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = (e.clipboardData || (window as any).clipboardData)
                .getData('text')
                .replace(/[^0-9۰-۹]/g, '') // اجازه دادن به اعداد فارسی و انگلیسی
                .slice(0, inputs.length);

            // تبدیل اعداد فارسی به انگلیسی
            let englishNumbers = pastedData;
            const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            for (let i = 0; i < 10; i++) {
                const regex = new RegExp(persianNumbers[i], 'g');
                englishNumbers = englishNumbers.replace(regex, i.toString());
            }

            [...englishNumbers].forEach((char, i) => {
                if (i < inputs.length) {
                    inputs[i].value = char;
                    if (i < inputs.length - 1) {
                        inputs[i + 1].focus();
                    }
                }
            });
        });
    });
}); 