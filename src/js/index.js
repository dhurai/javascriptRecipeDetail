import Search from './models/Search';
import List from './models/list';
import Like from './models/likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { domElements, setLoader, clearLoader} from './views/base';
import Recipe from './models/recipe';
/* Global states of the App
1 - search the object
2 - current object
3 - shopping list
4 - likes the recipe
*/
const state    =  {}

/**
 * Search Controller
 */
const searchControl =   async () => {
    // getting search query
        const queryData =   searchView.getSearchInput();
    if(queryData) {
        // create new search object
            state.searchData    =   new Search(queryData);
        //clear search input and UI
            searchView.clearSearchInput();
            searchView.clearResultUI();
            setLoader(domElements.fullResults);
        //getting the result data
            await state.searchData.getSearchResults();
        // remove Loader
            clearLoader()
        //Render the data on UI
            searchView.renderUI(state.searchData.resultData);
    }
}
domElements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    searchControl();
})

domElements.resultPage.addEventListener('click', e=>{
    const btnTarget =   e.target.closest('.btn-inline')
    if(btnTarget) {
        const pageVal   =  parseInt(btnTarget.dataset.goto, 10);
        searchView.clearResultUI();
        searchView.renderUI(state.searchData.resultData, pageVal);
    }
})


/**
 * Recipe Controller
 */

 const controlRecipe =  async () =>{
    // getting ID
    const ID    =   window.location.hash.replace("#", "");

    if(ID) {
        //prepare Ui for Changes
        recipeView.clearRecipeUI()
        //highlight selected recipe
        if(state.searchData) {
            searchView.highlightingRecipe(ID)
        }
        setLoader(domElements.recipeDetails);

        //create Recipe Model
        state.currentRecipe =   new Recipe(ID)
        try{
            // get Recipe Data
            await state.currentRecipe.getRecipe()
            state.currentRecipe.parseIngredients()
            // calc time and serving
            state.currentRecipe.calcTime()
            state.currentRecipe.servingMem()
            clearLoader()
            //render Recipe in UI
            recipeView.RenderRecipe(
                state.currentRecipe, 
                state.likes.isLiked(ID)
                )
        } catch(error) {
            alert('Error while Processing recipe!!!')
        }

    }
}

/**
 * List Controller
 */

 const controlList = () => {
    // create a new list it it's not
    if(!state.list) state.list  =   new List();

    // adding ingredients to the list
    state.currentRecipe.ingredients.forEach(el => {
        const item  =   state.list.addingItem(el.count, el.unit, el.ingredient);
        listView.renderItemList(item);
    })
 }

/**
 * Likes Controller
 */
const controlLikes = () =>{
     if(!state.likes) state.likes    =   new Like();
    //  getting current ID
    const currentID =   state.currentRecipe.id;
    // Current Recipe NOT yet liked
    if(!state.likes.isLiked(currentID)) {
        // Adding Recipe to the state
        const title         =   state.currentRecipe.title;
        const author        =   state.currentRecipe.author;
        const img           =   state.currentRecipe.image
        const newLike       =   state.likes.addingLikedItem(currentID, title, author, img);

        // Toggle the button
        likeView.toggleLikeBtn(true)


        // adding Item to like list UI
        likeView.renderLikeUI(newLike)
        console.log(state.likes)
    // Current Recipe has likked already
    } else {
        // Removing Recipe from the state
        state.likes.deletingLikedItem(currentID);

        // Toggle the button
        likeView.toggleLikeBtn(false)

        // Removing Item to  like list UI
        likeView.deleteLike(currentID)
        console.log(state.likes)
    }
    likeView.toggleHeartBtn(state.likes.numberOfLikes());
}

 // deleting and updating list 
 domElements.shoppingList.addEventListener('click', e=>{
    const itemId =   e.target.closest('.shopping__item').dataset.itemid;
    // delete the item
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deletingItem(itemId)
        listView.deleteItem(itemId);
    } else if(e.target.matches('.shopping__count-value, .shopping__count-value *')) {
        const newCount  =   parseFloat(e.target.value, 10);
        if(state.list.count >= 1) state.list.updateItem(itemId, newCount);
    }
 })

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', () => {
    state.likes    =   new Like();
    // restoring the local storage
    state.likes.readingData()

    //  toggle the heart button
    likeView.toggleHeartBtn(state.likes.numberOfLikes());

    //Render the like UI
    state.likes.likes.forEach(el => likeView.renderLikeUI(el))
    
});

domElements.recipeDetails.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked
        if(state.currentRecipe.servings > 1) {
            state.currentRecipe.updateServings('Dec')
            recipeView.updateServingIngredients(state.currentRecipe)
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button clicked
        state.currentRecipe.updateServings('Inc');
        recipeView.updateServingIngredients(state.currentRecipe);
    } else if(e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        // adding ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        // adding like to the recipe
        controlLikes();
    }
})
