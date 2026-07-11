const menuService = require('./MenuService');

class MenuController {
    async getAllCategories(req, res, next) {
        try {
            const categories = await menuService.getAllCategories();
            res.json({ categories });
        } catch (error) {
            next(error);
        }
    }

    async getMenuItem(req, res, next) {
        try {
            const { id } = req.params;
            const menuItem = await menuService.getMenuItem(id);
            if (!menuItem) {
                return res.status(404).json({ error: 'Menu item not found' });
            }
            res.json(menuItem);
        } catch (error) {
            next(error);
        }
    }

    async addCategory(req, res, next) {
        try {
            const { name, sort } = req.body;
            const category = await menuService.addCategory(name, sort);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }

    async addMenuItem(req, res, next) {
        try {
            const { name, description, price, isAvailable, categoryId } = req.body;
            // Handle image upload here if needed (req.file)
            const menuItem = await menuService.addMenuItem({
                name, description, price: parseFloat(price), isAvailable: isAvailable === 'true', categoryId: parseInt(categoryId)
            });
            res.json(menuItem);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MenuController();
