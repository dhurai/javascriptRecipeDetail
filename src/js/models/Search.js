import axios from 'axios'
import {apiKey} from '../config'
export default class Search {
    constructor (queryParams) {
        this.queryParams    =   queryParams;
    }
    async getSearchResults() {
/*
    Fetch Method
    =============
    const searchResults =   await fetch(`https://www.food2fork.com/api/search?key=${params}&q=rice`)
    const jsonData   =   await searchResults.json()
    console.log(jsonData)
*/    
        try {
            const searchResults =   await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.queryParams}`)
            this.resultData    =   searchResults.data.recipes
        } catch(error) {
            console.log(`The error is ${error}`)
        }
    }
}