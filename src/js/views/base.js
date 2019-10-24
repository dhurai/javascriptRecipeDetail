export const domElements    =   {
    searchForm  : document.querySelector('.search'),
    searchQuery :   document.querySelector('.search__field'),
    resultList: document.querySelector('.results__list'),
    fullResults: document.querySelector('.results'),
    resultPage: document.querySelector('.results__pages'),
    recipeDetails: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    heartBtn:document.querySelector('.likes__field'),
    likeList:document.querySelector('.likes__list')
}

export const elementStrings =   {
    loaderString:'loader'
}

export const setLoader  =   parent => {
    const loader =    `
    <div class = ${elementStrings.loaderString}> 
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>`
    parent.insertAdjacentHTML('afterbegin', loader)
}

export const clearLoader = () => {
    const loader    =   document.querySelector(`.${elementStrings.loaderString}`)
    if(loader) {
        loader.parentElement.removeChild(loader)
    }
}