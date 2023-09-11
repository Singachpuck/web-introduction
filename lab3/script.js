window.onload = () => {
    const usersToRead = 5,
        btn = document.querySelector('.load-btn'),
        errorMsg  = document.querySelector('.error-msg'),
        dataContainer = document.querySelector('.user-container');
    
    btn.addEventListener('click', () => {
        fetch('https://randomuser.me/api/?results=' + usersToRead).then(response => {
            response.json().then(data => {                    
                console.log(data);
                for (part of data.results) {
                    generateUser(part);
                }
            }).catch(err => {
                console.log(err);
                errorMsg.innerText = 'Load failed!';
            });
            errorMsg.innerText = 'Load successful!';
        }).catch(err => {
            errorMsg.innerText = 'Load failed!';
        });
    });

    // Picture, country, postcode, phone, name
    function generateUser(userData) {
        const userContainer = document.createElement('div'),
            photoContainer = document.createElement('div'),
            dataList = document.createElement('ul');
        
        userContainer.classList.add('user');

        photoContainer.classList.add('profile-image-container');
        photoContainer.innerHTML += `<img class="profile-image" src=${userData.picture.large} alt="Profile image"'>`;
        dataList.innerHTML += `<li class="data-item"><b>Name:</b> ${userData.name.title} ${userData.name.first} ${userData.name.last}</li>`;
        dataList.innerHTML += `<li class="data-item"><b>Country:</b> ${userData.location.country}</li>`;
        dataList.innerHTML += `<li class="data-item"><b>Postcode:</b> ${userData.location.postcode}</li>`;
        dataList.innerHTML += `<li class="data-item"><b>Phone:</b> ${userData.phone}</li>`;

        userContainer.appendChild(photoContainer);
        userContainer.appendChild(dataList);
        dataContainer.appendChild(userContainer);
    }
}