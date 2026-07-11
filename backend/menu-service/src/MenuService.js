const menuRepository = require('./MenuRepository');
const EventBus = require('../../shared/events/EventBus');
const EventContracts = require('../../shared/events/EventContracts');

class MenuService {
    async getAllCategories() {
        return menuRepository.getAllCategories();
    }

    async getMenuItem(id) {
        return menuRepository.getMenuItem(id);
    }

    async addCategory(name, sort) {
        const category = await menuRepository.createCategory({ name, sort: sort || 0 });
        EventBus.publish(EventContracts.MenuUpdatedEvent, { action: 'ADD_CATEGORY', category });
        return category;
    }

    async addMenuItem(data) {
        const menuItem = await menuRepository.createMenuItem(data);
        EventBus.publish(EventContracts.MenuUpdatedEvent, { action: 'ADD_MENU_ITEM', menuItem });
        return menuItem;
    }
}

module.exports = new MenuService();
