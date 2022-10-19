import { createHTMLElement } from './domInteractions.js';
import { respForCharacterData } from './requests.js';

class Favorites {
    constructor() {
        this.favoriteList = document.getElementById('favoritesList');
        this.fetchAndDisplayListOfFavorites();
        this.setupListeners();
    };

    setupListeners = () => {
        Array.from(document.querySelectorAll('[data-display-mode]')).forEach(btn => {
            btn.addEventListener('click', this.changeDisplayMode);
          });
    };

    createFavoriteCharacterCard = character => {
        let card = document.createElement('div');
        card.classList = 'fav-card';
    
        card.appendChild(createHTMLElement('h2', character.name));
        card.appendChild(createHTMLElement('img', null, null, character.image));
        
        let removeBtn = createHTMLElement('button', 'Delete', 'btn');
        removeBtn.setAttribute('data-name', character.name);
        removeBtn.addEventListener('click', this.removeFromFavorite);
        card.appendChild(removeBtn);

        return card;
    }

    fetchAndDisplayListOfFavorites = () => {
        respForCharacterData()
        .then(data => data.forEach(character => {
            if (localStorage.getItem(character.name)) {
                let card = this.createFavoriteCharacterCard(character);
                this.favoriteList.appendChild(card);
            };
        }));
    };

    removeFromFavorite = event => {
        const name = event.target.dataset.name;
        localStorage.removeItem(name);
        event.path[1].remove();
    };

    changeDisplayMode = event => {
        let btn = event.target;
        let displayMode = event.target.dataset.displayMode;
        if (displayMode === '5') {
            this.favoriteList.classList = 'favorites-list favorites-list--row-5';
        } else if (displayMode === '3') {
            this.favoriteList.classList = 'favorites-list favorites-list--row-3';
        } else if (displayMode ==='1') {
            this.favoriteList.classList = 'favorites-list favorites-list--column';
        };
        document.getElementsByClassName('selected')[0].classList.remove('selected');
        event.target.classList.add('selected');    
    };
};

document.addEventListener('DOMContentLoaded', new Favorites());