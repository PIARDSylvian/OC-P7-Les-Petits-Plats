/**
 * Return search in Recipes with tag
 */
class RecipesSearch extends Search { // eslint-disable-line
    constructor(data, search, tags) {
        super(data, search);
        this._tags = tags;

    }

    /**
     * Return true if tag is valid
     * 
     * @param {string | object} data 
     * @param {string} tag
     *  
     * @returns {boolean} 
     */
    tagValid(data, tag) {
        let valid = false;
        if (typeof data === 'string') {
            valid = data.toLowerCase() === tag;
        } else if (typeof data === 'object') {
            const dataLength = data.length;
            for (let index = 0; index < dataLength; index++) {
                    valid = data[index].toLowerCase() === tag;
                    if (valid) break;
            }
        } else {
            throw 'Unknown data format';
        }
    
        return valid;
    }

    /**
     * Get result of research
     * 
     * @returns {Array} result
     */
    getResult() {
        const length = this._data.length;
        let result = [];
        for (let index = 0; index < length; index++) {
            const element = this._data[index];
            
            let valid = this.search(element.name, this._search);
            if (valid.length === 0) {
                valid = this.search(element.description, this._search);
            }
            if (valid.length === 0) {
                const typesLength = element.ingredients.length;
                let ingredients = [];
                for (let index = 0; index < typesLength; index++) {
                    ingredients.push(element.ingredients[index].ingredient);
                }
                valid = this.search(ingredients, this._search);
            }
            if (valid.length > 0) {
                const tagsLength = this._tags.length;
                let tagValid = true;
                for (let index = 0; index < tagsLength; index++) {
                    const tag = this._tags[index];

                    if(tag.type === 'ingredients') {
                        const typesLength = element.ingredients.length;
                        let data = [];
                        for (let index = 0; index < typesLength; index++) {
                            data.push(element.ingredients[index].ingredient);
                        }
                        if (tagValid) {
                            tagValid = this.tagValid(data, tag.value);
                        }
                    } else {
                        if (tagValid) {
                            tagValid = this.tagValid(element[tag.type], tag.value);
                        }
                    }
                }

                if (tagValid) {
                    result.push(element);
                }
            }
        }

        return result;
    }
}