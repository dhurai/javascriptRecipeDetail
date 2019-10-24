import uniqid from 'uniqid'

export default class List {
    constructor() {
        this.item = []
    }

    addingItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.item.push(item);
        return item;
    }

    deletingItem(id) {
        const index =   this.item.findIndex(el => el.id === id);
        this.item.splice(index, 1);
    }

    updateItem(id, newCount) {
        this.item.find(el => el.id === id).count = newCount;
    }
}