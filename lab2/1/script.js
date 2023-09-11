window.onload = () => {
    const body = document.querySelector('body'),
        btn = document.querySelector('.verify-btn'),
        nameInput = document.querySelector('input[name="name"]'),
        groupInput = document.querySelector('input[name="group"]'),
        birthInput = document.querySelector('input[name="birth"]'),
        cardInput = document.querySelector('input[name="card"]'),
        emailInput = document.querySelector('input[name="email"]');

    btn.addEventListener('click', e => {
        e.preventDefault();
        if (verify()) {
            displayPayload();
        }
    });

    function verify() {
        const namePattern = /[A-ZА-ЯІЇ][a-zа-яії]{1,20} [A-ZА-ЯІЇ]\.[A-ZА-ЯІЇ]\./,
            groupPattern = /[A-ZА-ЯІЇ][A-ZА-ЯІЇ]-\d\d/,
            birthPattern = /\d\d\.\d\d\.\d\d\d\d/,
            cardPattern = /[A-ZА-ЯІЇ]{2} №\d{6}/,
            emailPattern = /\w+@\w+\.com/;

        const inputs = [nameInput, groupInput, birthInput, cardInput, emailInput];
        const patterns = [namePattern, groupPattern, birthPattern, cardPattern, emailPattern];

        let result = true;
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].classList.remove('error-input');
            if (!inputs[i].value.match(patterns[i])) {
                inputs[i].classList.add('error-input');
                result = false;
            }
        }
        return result;
    }

    function displayPayload() {
        const displayWrapper = document.createElement('div'),
            displayHeader = document.createElement('h3'),
            payloadList = document.createElement('ul');

        displayHeader.textContent = 'Generated Payload';

        [nameInput, groupInput, birthInput, cardInput, emailInput].forEach(item => {
            payloadList.innerHTML += `<li class="list-item"><b>${item.placeholder}:</b> ${item.value}</li>`;
        });

        displayWrapper.appendChild(displayHeader);
        displayWrapper.appendChild(payloadList);
        displayWrapper.style.position = 'absolute';
        displayWrapper.style.right = '50px';
        displayWrapper.style.top = '20px';
        body.appendChild(displayWrapper);

        setTimeout(() => {
            body.removeChild(displayWrapper);
        }, 4000)
    }
}