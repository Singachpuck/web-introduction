window.onload = () => {
    const email = document.querySelector('.email');
    const tokenCookie = getCookie('token');
    email.textContent = JSON.parse(atob(tokenCookie)).email;
}