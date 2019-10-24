import { domElements} from './base';
import {titleLimitation} from './searchView'

export const  toggleLikeBtn    =   isLiked => {
    const likeString    =   isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${likeString}`)
}

export const toggleHeartBtn =   numOfLikes => {
    domElements.heartBtn.style.visibility    =   numOfLikes === 0 ? 'hidden' : 'visible'; 
}


export const renderLikeUI = like =>{
    const markup    =   `
            <li>
                <a class="likes__link" href=#${like.id}>
                    <figure class="likes__fig">
                        <img src=${like.img} alt=${like.title}>
                    </figure>
                    <div class="likes__data">
                        <h4 class="likes__name">${titleLimitation(like.title)}</h4>
                        <p class="likes__author">${like.author}</p>
                    </div>
                </a>
            </li>
        `
        domElements.likeList.insertAdjacentHTML('beforeend', markup)
}

export const deleteLike = id =>{
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement
   if(el) el.parentElement.removeChild(el);
}