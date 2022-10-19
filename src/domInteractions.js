const _getDOMElement = (attribute, value) => {
    return document.querySelector(`[${attribute}="${value}"`);
};


export const mapListToDOMElements = (listOfValues, attribute) => {
    const _viewElements = {};

    for (const value of listOfValues) {
        _viewElements[value] = _getDOMElement(attribute, value);
    };
    
    return _viewElements;
};


export const createTableElement = (tagName, innerText, className) => {
    const cell = document.createElement(tagName);
    cell.innerText = innerText;
    if (className) { cell.classList = className };

    return cell;
};

export const createTableRow = (innerData, innerElementTag, className) => {
    let row = document.createElement('tr');
    row.classList = className;

    for (const data of innerData) {
        let cell = createTableElement(innerElementTag, data);
        row.appendChild(cell);
    };

    return row
};

export const createCharactersTableRow = character => {
    const characterDataset = [
        ['data-name', character.name],
        ['data-date-of-birth', character.dateOfBirth],
        ['data-character-house', character.house]
    ];
    let row = document.createElement('tr');
    row.classList = 'table__row'
    
    for (const data of characterDataset) {
        // If character information is empty, then set it as null.
        if (data[1] === '') {
            row.setAttribute(data[0], 'NaN');
        } else {
            row.setAttribute(data[0], data[1]);
        };
    };
    
    // Append characters data as table data into table row.
    let characterData = [
        createTableElement('td', character.name),
        createTableElement('td', character.dateOfBirth),
        createTableElement('td', character.house),
        createTableElement('td', character.wizard),
        createTableElement('td', character.ancestry),
    ];
    if (character.hogwartsStudent) {
        characterData.push(createTableElement('td', character.hogwartsStudent));
    } else if (character.hogwartsStaff) {
        characterData.push(createTableElement('td', character.hogwartsStaff));
    } else {
        characterData.push(createTableElement('td', 'false'));
    };
    // Fillng empty data fields.
    characterData.forEach(element => {
        if (element.innerText === '') {
            element.innerText = 'NaN';
        };
    });
    // Append character data into a table row.
    for (const data of characterData) {
        row.appendChild(data);
    };

    return row
};

export const createHTMLElement = (tagName, innerText, className, src) => {
    let element = document.createElement(tagName);
    if (innerText ) { element.innerText = innerText };
    if (className) {element.classList = className };

    if (src) { element.setAttribute('src', src) };

    return element
};
