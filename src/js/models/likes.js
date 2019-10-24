export default class Like {
    constructor() {
        this.likes= [];
    }

    addingLikedItem(id, title, author, img) {
        const item = {id, title, author, img};
        this.likes.push(item);
        // persiat data after reloading
        this.persistData()
        return item;
    }

    deletingLikedItem(id) {
        const index =   this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        // persiat data after reloading
        this.persistData()
    }

    isLiked(id) {
        return this.likes.findIndex(el=> el.id === id) !== -1;
    }

    numberOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    readingData() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes = storage;
    }
}