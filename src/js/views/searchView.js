import { domElements} from './base';

export const getSearchInput =   () => domElements.searchQuery.value;

export const clearSearchInput   =   ()=>{
     domElements.searchQuery.value = ''
}

export const clearResultUI  =   () => {
    domElements.resultList.innerHTML    =   '';
    domElements.resultPage.innerHTML    =   '';
}

// highlighting selected recipe
export const highlightingRecipe    =   (id) =>{
    const elementsArr =   Array.from(document.querySelectorAll('.results__link'));
    elementsArr.forEach(el =>{
        el.classList.remove('results__link--active')
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active')
}

export const titleLimitation   =   (title, limit = 15) => {
    let newTitle    =   [];
    title.split(' ').reduce((prev, cur) => {
        if(prev + cur.length <=  limit) {
            newTitle.push(cur)
        }
        return prev+cur.length;
    }, 0)
    return `${newTitle.join(' ')}...`
}

const renderRecipe  =   recipe =>{
    const markup  =   `
                <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${titleLimitation(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li> 
                `;
    domElements.resultList.insertAdjacentHTML('beforeend', markup)
}

const createButton  =   (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page-1 : page+1}</span>
    </button>
`



const renderButtons =   (page, totalRes, resultPerPage) => {
    const totalPage =   Math.ceil(totalRes/resultPerPage);
    let button;
    if(page === 1 && totalPage > 1) {
        //only next button
        button = createButton(page, 'next')
    } else if(page < totalPage) {
        // both prev and next button
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    } else if(page === totalPage && totalPage > 1) {
        // ony prev button
        button = createButton(page, 'prev')
    }else {
        button  = 'That\'s All'
    }
    domElements.resultPage.insertAdjacentHTML('afterbegin', button)
}

export const renderUI   =   (recipes, page = 1, resultPerPage = 10) =>{
    // render the results in UI
    const start =   (page-1) * resultPerPage
    const end   =   page * resultPerPage
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination
    renderButtons(page, recipes.length,resultPerPage)

}