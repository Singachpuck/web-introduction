window.onload = () => {
    const form = document.querySelector('#form'),
        emailInput = document.querySelector('#email-input'),
        passwordInput = document.querySelector('#password-input');


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const payload = formDataToJson(new FormData(form));

        fetch('/api/auth/token', {
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status != 200) {
                emailInput.classList.add('is-invalid');
                passwordInput.classList.add('is-invalid');
            } else {
                res.json().then(data => {
                    document.cookie = `token=${btoa(JSON.stringify(data))}; expires=${new Date(Date.now() + data.expiresIn * 1000)}; path=/`;
                    window.location.href = '/content';
                }).catch(err => {
                    emailInput.classList.add('is-invalid');
                    passwordInput.classList.add('is-invalid');
                });
            }
        }).catch(err => {
            console.log(err);   
        });
    });
}