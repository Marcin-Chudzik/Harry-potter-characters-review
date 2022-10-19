export const getAllCharacters = () => {
    return fetch(`https://hp-api.herokuapp.com/api/characters`).then(resp => resp.json());
};

export const getAllCharactersFromHouse = house => {
    return fetch(`https://hp-api.herokuapp.com/api/characters/house/${house}`).then(resp => resp.json());
};

export const respForCharacterData = async () => {
    return await getAllCharacters();
};