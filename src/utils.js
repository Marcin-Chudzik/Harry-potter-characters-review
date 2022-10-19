export const moveDropdownContent = () => {
    let element = document.getElementById("navButtons");
    if (element.style.top === '-270px' || element.style.top === '') {
        element.style.top = '20px';
    } else {
        element.style.top = '-270px';
    };
};

export const backToTop = () => {
    let top1 = document.body.scrollTop;
    let top2 = document.documentElement.scrollTop;
    if (top1 > '0' || top2 > '0') {
        let spell = document.getElementById("spell");
        spell.style.animationName = 'fadeInOut';
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        setTimeout('spell.style.animationName = ""', 1000);
    };    
};

export const camelize = str => {
    let arr = str.split('-');
    let result = arr[0];
    if (arr.length > 1) {
        for (const word of arr.slice(1)) {
             result += word.charAt(0).toUpperCase() + word.slice(1);
        };
    };    
    
    return result;
};

export const normalizeString = str => {
    if (typeof(str) === 'string') {
        let result = '';
        for (let char of str) {
            if (char === char.toUpperCase()) {
                result += ` ${char.toLowerCase()}`;
            } else {
                result += char;
            };
        };
        result = result.replace('_', ' ');
        return result;
    } else {
        return str;
    };
};
