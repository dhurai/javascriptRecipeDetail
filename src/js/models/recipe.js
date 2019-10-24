import axios from 'axios'
import {apiKey, proxy} from '../config'

export default class Recipe {
    constructor(id) {
        this.id     =   id;
    }

    async getRecipe() {
        try {
            const resultRecipe  =   await axios(`https://www.food2fork.com/api/get?key=${apiKey}&rId=${this.id}`)
            this.title          =   resultRecipe.data.recipe.title;
            this.image          =   resultRecipe.data.recipe.image_url;
            this.author         =   resultRecipe.data.recipe.publisher;
            this.url            =   resultRecipe.data.recipe.source_url;
            this.ingredients    =   resultRecipe.data.recipe.ingredients;
        } catch (error) {
            console.log(error)
        }
    }

    calcTime() {
        const numOfIng      =   this.ingredients.length;
        const periogOfIng   =   Math.ceil(numOfIng/3);
        this.duration       =   periogOfIng * 15;
    }

    servingMem() {
        this.servings   =   5;
    }

    parseIngredients() {
    // uniform units
        const parsedIngredients     =   this.ingredients.map(el =>{
            const unitslong   =   ['tablespoon', 'tablespoons', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds']
            const unitShort   =   ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
            const units       =   [...unitShort, 'kg', 'g']
            let ingredient  =   el.toLowerCase()
            unitslong.forEach((unit, index) => {
                ingredient  =   ingredient.replace(unit, unitShort[index])
            });

    // remove paratheses
        ingredient  =   ingredient.replace(/ *\([^)]*\) */g, " ");

    // parse ingredients into quantity unit ingredients
        const arrIngredients    =   ingredient.split(" ");
        const unitCount         =   arrIngredients.findIndex(ele=> units.includes(ele));
        let ingObj;
        if(unitCount > -1) {
            //there is unit
            const ingCount  =   arrIngredients.slice(0, unitCount)
            let count
            if (ingCount.length === 1) {
                count   =   eval(arrIngredients[0].replace('-', '+'))
            } else {
                count   =   eval(arrIngredients.slice(0, unitCount).join('+'))
            }
            ingObj  =   {
                count,
                unit: arrIngredients[unitCount],
                ingredient: arrIngredients.slice(unitCount+1).join(" ")
            }
        } else if(parseInt(arrIngredients[0], 10)) {
            //there is no unit bt there is num in 1st pos
            ingObj  =   {
                count: parseInt(arrIngredients[0], 10),
                unit: "",
                ingredient: arrIngredients.slice(1).join(" ")
            }
        } else if(unitCount === -1) {
            ingObj  =   {
                count: 1,
                unit: "",
                ingredient
            }
        }
        return ingObj;
        })
        this.ingredients    =   parsedIngredients;
    }

    updateServings(type) {
        // serving
        const newServing    =   type === 'Dec' ? this.servings - 1 : this.servings + 1

        // ingredients
        this.ingredients.forEach(ing =>{
            ing.count *= (newServing / this.servings)
        })
        this.servings   =   newServing;
    }
}