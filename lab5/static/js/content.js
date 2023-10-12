window.onload = () => {
    const email = document.querySelector('.email'),
        deleteBtn = document.querySelector('.delete-btn'),
        editForm = document.querySelector('#editForm'),
        editEmail = document.querySelector('#editEmail');
    
    const tokenCookie = getCookie('token');
    const token = JSON.parse(atob(tokenCookie));
    email.textContent = token.email;
    editEmail.value = token.email;

    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        fetch('/api/auth/' + token.email, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token.token
            }
        }).then(res => {
            if (res.status === 204) {
                deleteCookie('token');
                window.location.href = '/login';
            }
        });
    });

    editForm.addEventListener('submit', e => {
        e.preventDefault();

        const payload = JSON.stringify({
            email: editEmail.value
        });

        fetch('/api/auth/' + token.email, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token.token,
                'Content-Type': 'application/json'
            },
            body: payload
        }).then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    const obj = JSON.parse(data);
                    document.cookie = `token=${btoa(data)}; expires=${new Date(Date.now() + obj.expiresIn * 1000)}; path=/`;
                    window.location.reload();
                });
            }
        });
    });
}