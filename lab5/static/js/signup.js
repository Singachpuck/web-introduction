window.onload = () => {
    const form = document.querySelector('#form'),
        emailInput = document.querySelector('#email-input'),
        passwordInput = document.querySelector('#password-input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const payload = formDataToJson(new FormData(form));

        fetch('/api/auth', {
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
                window.location.href = '/login';
            }
        }).catch(err => {
            console.log(err);   
        });
    });
}