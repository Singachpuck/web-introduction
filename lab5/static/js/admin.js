function onUserDelete(target) {
    const tokenCookie = JSON.parse(atob(getCookie('token')));
    let email = target.dataset.userEmail;

    fetch('/api/auth/' + email, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + tokenCookie.token
        }
    }).then(res => {
        if (res.status === 204) {
            if (email === tokenCookie.email) {
                deleteCookie('token');
                window.location.href = '/login';
            } else {
                window.location.reload();
            }
        }
    });
}

window.onload = () => {    
    const email = document.querySelector('.email'),
        userTable = document.querySelector('.user-table > tbody');
    const tokenCookie = JSON.parse(atob(getCookie('token')));
    email.textContent = tokenCookie.email;

    fetch('/api/users', {
        headers: {
            Authorization: 'Bearer ' + tokenCookie.token
        }
    }).then(res => {
        if (res.ok) {
            res.json().then(data => {
                data.forEach(user => {
                    let child = document.createElement('tr');
                    child.innerHTML = `<td>${user.email}</td><td>${user.permissions}</td><td><button class="btn btn-danger" data-user-email="${user.email}" onclick="onUserDelete(this)">Delete</button></td>`;
                    userTable.appendChild(child);
                });
            });
        }
    });
}