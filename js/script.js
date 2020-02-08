window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent (a) {
        for (let i = a; i < tabContent.length; i++) {
                tabContent[i].classList.remove('show');
                tabContent[i].classList.add('hide');
        }
    }

    function showTabContent (b) {
        if ( tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    hideTabContent(1);
    info.addEventListener('click', function(event) {
        let target = event.target;
        if(target && target.classList.contains('info-header-tab')) {
            hideTabContent(0);
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    showTabContent(i);
                    break;
                }
            }
        }
    });
});