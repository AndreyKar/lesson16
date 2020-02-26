// jshint esversion: 6
window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent'),
        // Первичное назначение кнопки из содержимого первого таба
        btnMore = document.querySelectorAll('.description-btn');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    hideTabContent(1);
    info.addEventListener('click', function (event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            hideTabContent(0);
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // Timer

    let deadline = '2020-03-10';

    // Использование: addZero(исходное число: число, длина результата: число)
    // функция вернет исходное число с нулями до числа в виде строки
    function addZero(source, length) {
        let str = source + ''; //перевели в текстовый формат
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function getTimeRemaining(endTime) {
        let t = Date.parse(endTime) - Date.parse(new Date()),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / 1000 / 60 / 60));

        if (t <= 0) {
            return {
                'total': 0,
                'seconds': 0,
                'minutes': 0,
                'hours': 0
            };
        }
        return {
            'total': t,
            'seconds': seconds,
            'minutes': minutes,
            'hours': hours
        };
    }

    function setClock(id, endTime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endTime);
            hours.textContent = addZero(t.hours, 2);
            minutes.textContent = addZero(t.minutes, 2);
            seconds.textContent = addZero(t.seconds, 2);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('timer', deadline);

    // Modal window

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function () {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    for (let i = 0; i < btnMore.length; i++) {
        btnMore[i].addEventListener('click', function () {
            overlay.style.display = 'block';
            this.classList.add('more-splash');
            document.body.style.overflow = 'hidden';
        });
    }

    close.addEventListener('click', function () {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    // Form

    function sendForm(formName) {
        let message = {
            loading: 'Загружается...',
            success: 'Спасибо, скоро мы с вами свяжемся!',
            failure: 'Что-то пошло не так!'
        };

        let form = document.querySelector(formName),
            input = form.getElementsByTagName('input'),
            statusMessage = document.createElement('div');

        statusMessage.classList.add('status');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            form.appendChild(statusMessage);
            let formData = new FormData(form);

            function postData(data) {
                return new Promise(function (resolve, reject) {
                    let request = new XMLHttpRequest();
                    request.open('POST', 'server.php');
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    request.onreadystatechange = function() {
                        if (request.readyState < 4) {
                            resolve();
                        } else if (request.readyState === 4) {
                            if (request.status == 200 && request.status < 3) {
                                resolve();
                            }    
                        } else {
                            reject();
                        }
                    };

                    request.send(formData);
                });
            }

            function clearInput() {
                for (let i = 0; i < input.length; i++) {
                    input[i].value = '';
                }
            }

            postData(formData)
                .then(()=> statusMessage.innerHTML = message.loading)
                .then(()=> statusMessage.innerHTML = message.success)
                .catch(()=> statusMessage.innerHTML = message.failure)
                .then(clearInput);
        });
    }

    sendForm('.main-form');
    sendForm('form');

    // Slider

    let slides = document.querySelectorAll('.slider-item'),
        dotsWrapper = document.querySelector('.slider-dots'),
        dots = dotsWrapper.querySelectorAll('.dot'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        slideIndex = 1;

    function showSlide(n) {
        if (n <= 0) {
            slideIndex = slides.length;
        }
        if (n > slides.length) {
            slideIndex = 1;
        }

        slides.forEach((item) => item.style.display = 'none');
        slides[slideIndex - 1].style.display = 'block';
        dots.forEach((item) => item.classList.remove('dot-active'));
        dots[slideIndex - 1].classList.add('dot-active');
    }

    prev.addEventListener('click', function() {
        slideIndex -= 1;
        showSlide(slideIndex);
    });

    next.addEventListener('click', function() {
        slideIndex += 1;
        showSlide(slideIndex);
    });

    dotsWrapper.addEventListener('click', function(event) {
        for(let i = 0; i < dots.length; i++) {
            if (event.target == dots[i]) {
                slideIndex = i + 1;
                showSlide(slideIndex);
            }
        }

    });
    showSlide(slideIndex);
    let sliderTimer = setTimeout(function run() {
        slideIndex += 1;
        showSlide(slideIndex);      
        setTimeout(run, 6000);
    }, 6000);
 
    // Calculator

    let persons = document.querySelectorAll('.counter-block-input')[0],
        days = document.querySelectorAll('.counter-block-input')[1],
        base = document.getElementById('select'),
        totalSum = document.getElementById('total'),
        personsNumber = 0,
        daysNumber = 0,
        baseCost = 1;

    totalSum.innerHTML = '0';
    persons.addEventListener('change', function() {
        personsNumber = persons.value;
        totalSum.innerHTML = personsNumber * daysNumber * baseCost * 4000;
    });

    days.addEventListener('change', function() {
        daysNumber = days.value;
        totalSum.innerHTML = personsNumber * daysNumber * baseCost * 4000;
    });

    base.addEventListener('change', function() {
        let n = base.options.selectedIndex;
        baseCost = base.options[n].value;
        totalSum.innerHTML = personsNumber * daysNumber * baseCost * 4000;
    });
});