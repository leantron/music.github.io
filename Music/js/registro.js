"use strict"
    let btnToggle = document.querySelector('#btn-open');
    btnToggle.addEventListener('click', toggleMenu);

    function toggleMenu() { 
        let menu = document.querySelector('#menu');
        menu.classList.toggle('open');
    }

    document.getElementById('btn-oscuro').addEventListener('click', function() {
        document.body.classList.toggle('modo-oscuro')
    });

    function generarCaptcha() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let captcha = '';
    for (let i = 0; i < 6; i++) { 
        captcha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    document.getElementById('captcha-text').innerText = captcha;
    return captcha;
    }

let captchaGenerado = generarCaptcha(); 

document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();
    const captchaIngresado = document.getElementById('captcha-input').value; 
    const resultado = document.getElementById('resultado');
    
    if (captchaIngresado === captchaGenerado) {
        resultado.innerText = 'Captcha Válido';
        resultado.style.color = 'green';
    } else {
        resultado.innerText = 'Captcha Inválido';
        resultado.style.color = 'blue';
    }

    document.getElementById('nombre').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('contraseña').value = '';
    document.getElementById('captcha-input').value = '';

    captchaGenerado = generarCaptcha();
});