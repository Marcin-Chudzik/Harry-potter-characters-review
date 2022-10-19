import { getAllCharacters, getAllCharactersFromHouse, respForCharacterData } from "./requests.js";
import { mapListToDOMElements, createCharactersTableRow, createTableRow, createHTMLElement } from './domInteractions.js';
import { moveDropdownContent, backToTop, camelize, normalizeString } from './utils.js';


class HarryPotterCharacters {
  constructor() {
    this.tableHeaders = ['Name', 'Date Of Birth', 'House', 'Wizard', 'Ancestry', 'Is student / staff'];
    this.viewElements = {};
    this.listOfCharacter = respForCharacterData();
    this.initializeApp();
  };

  initializeApp = () => {
    this.connectDOMElements();
    this.setupListeneres();
    this.fetchAndDisplayCharacters();
  };

  connectDOMElements = () => {
    // Mapping all DOM elements to the arrays.
    const listOfIds = Array.from(document.querySelectorAll('[id]')).map(element => element.id);
    const listOfHouses = Array.from(document.querySelectorAll('[data-house]')).map(element => element.dataset.house);

    this.viewElements = mapListToDOMElements(listOfIds, 'id');
    this.houseNameButtons = mapListToDOMElements(listOfHouses, 'data-house');
  };

  setupListeneres = () => {
    // Setting an click event listener on all dropdown menu buttons.
    Object.keys(this.houseNameButtons).forEach(houseName => {
      this.houseNameButtons[houseName].addEventListener('click', this.fetchAndDisplayCharacters);
    });
    // Setting an click event listeners on all table sorting buttons.
    Array.from(document.querySelectorAll('[data-sort-type]')).forEach(btn => {
      btn.addEventListener('click', this.sortTableData);
    });
    // Setting an other event listeners.
    this.viewElements.allStudents.addEventListener('click', this.fetchAndDisplayCharacters);
    this.viewElements.dropdownBtn.addEventListener('click', moveDropdownContent);
    this.viewElements.scrollToTop.addEventListener('click', backToTop);
    this.viewElements.addToFavorite.addEventListener('click', this.saveCharacterToFavorite);
    this.viewElements.characterDetailsCloseBtn.addEventListener('click', hideCharacterDetails => {
      this.viewElements.characterDetails.style.display = 'none';
      this.viewElements.characterDetailsContent.innerHTML = '';
    });
  };
  
  fetchAndDisplayCharacters = event => {
    // Load all students data on a first page loading, when no event.
    if (event === undefined) {
      this.viewElements.tableTitle.innerText = 'All Students';
      getAllCharacters().then(characters => this.displayCharactersInformationTable(characters));
      return;
    };
    // Set the selected button as a table title.
    this.viewElements.tableTitle.innerText = event.target.innerText;
    document.getElementsByClassName('selected')[0].classList.remove('selected');
    event.target.classList.add('selected');

    // Hide dropdown buttons.
    moveDropdownContent();
    // Creating a DOMElement for each show from API's response, based on JSON fields.
    if (event.target.id === 'allStudents') {
      getAllCharacters().then(characters => this.displayCharactersInformationTable(characters));
    } else if (event.target.dataset.house) {
      getAllCharactersFromHouse(event.target.dataset.house).then(characters => this.displayCharactersInformationTable(characters));
    };
  };

  cleanTableData = () => {
    // Clearing table and adding headers back.
    this.viewElements.charactersPreview.innerHTML = '';
    this.viewElements.charactersPreview.appendChild(createTableRow(this.tableHeaders, 'th', 'table__headers'));
  };

  displayCharactersInformationTable = characters => {
    this.cleanTableData();
    // Dynamic adding a table rows with data base on API's characters data.
    for (const character of characters) {
      const row = createCharactersTableRow(character);
      // Setting an click event listeners on a table row for opening character details.
      row.addEventListener('click', this.displayCharacterDetails);
      this.viewElements.charactersPreview.appendChild(row);
    };
  };

  sortTableData = event => {
    const sortingValueKebabCase = event.target.dataset.row;
    const sortingValueCamelCase = camelize(sortingValueKebabCase.slice(5));
    // Collecting all table rows and convert it to the array.
    const tableData = Array.from(document.querySelectorAll(`[${sortingValueKebabCase}]`));
    // Collecting all elements, after sorting they will be a base for finding HTML elements in table data.
    const listOfElements = tableData.map(character => character.dataset[`${sortingValueCamelCase}`]).sort();
    if (event.target.dataset.sortType === 'desc') { listOfElements.reverse() };
    // Clearing table data, before adding new sorted content.
    this.cleanTableData();
    // For every element in sorted elements list. Find a HTML element in the last displayed table data and append it into empty, cleaned table.
    for (const element of listOfElements) {
      // Fine a character in table's data.
      let findedCharacter = tableData.find(character => character.dataset[`${sortingValueCamelCase}`] === element);
      // Removing finded character from table data.
      tableData.splice(tableData.indexOf(findedCharacter), 1);
      this.viewElements.charactersPreview.appendChild(findedCharacter);
    };
  };  

  displayCharacterDetails = event => {
    if (this.viewElements.characterDetails.style.display === 'flex') { return alert('First close opened window!')};        
    
    this.listOfCharacter.then(characters => characters.find(character => character.name === event.path[1].dataset.name))
      .then(characterData => fetchAndDisplayCharacterDetails(characterData));

    const fetchAndDisplayCharacterDetails = characterData => {
      Object.keys(characterData).forEach(key => {
        key = normalizeString(key);
        let value = characterData[key];
        if (value === '' || value === undefined) { value = 'No information'}
        if (key === 'wand') {
          let wandDesc = createHTMLElement('span', null, 'wand-desc');
          for (const pair of Object.entries(characterData.wand)) {
            if (pair[1] === '' || pair[1] === null) { pair[1] = 'No information'}
            const wandDescPair = createHTMLElement('span', null, 'desc-pair');
            wandDescPair.appendChild(createHTMLElement('p', `${pair[0]}: `))
            wandDescPair.appendChild(createHTMLElement('p', pair[1]))
            wandDesc.appendChild(wandDescPair);
          };
          this.viewElements.characterDetailsContent.appendChild(wandDesc);
        } else if (key === 'image') {
          this.viewElements.characterDetailsContent.appendChild(createHTMLElement('img', null, null, value))
        } else {
          const informationPair = createHTMLElement('span', null, 'desc-pair');
          informationPair.appendChild(createHTMLElement('p', `${key}:`));
          informationPair.appendChild(createHTMLElement('p', value));
          this.viewElements.characterDetailsContent.appendChild(informationPair);
        };
        this.viewElements.addToFavorite.setAttribute('data-character-name', characterData.name);
        if (localStorage.getItem(characterData.name)) {
          this.viewElements.addToFavorite.classList.add('selected');
        } else {
          this.viewElements.addToFavorite.classList.remove('selected');
        };
      });
    };
    backToTop()
    this.viewElements.characterDetails.style.display = 'flex';
  };

  saveCharacterToFavorite = event => {
    const characterName = event.target.dataset.characterName;
    if (localStorage.getItem(characterName) === null) {
      event.target.classList.add('selected');
      this.listOfCharacter
        .then(characters => characters.find(character => character.name === characterName))
        .then(characterData => localStorage.setItem(characterName, characterData));
    } else {
      localStorage.removeItem(characterName);
      event.target.classList.remove('selected');
    };  
  };
};

document.addEventListener('DOMContentLoaded', new HarryPotterCharacters());
