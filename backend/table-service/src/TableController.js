const tableService = require('./TableService');

class TableController {
    async getAllTables(req, res, next) {
        try {
            const tables = await tableService.getAllTables();
            res.json(tables);
        } catch (error) {
            next(error);
        }
    }

    async getTableById(req, res, next) {
        try {
            const { id } = req.params;
            const table = await tableService.getTableById(id);
            if (!table) return res.status(404).json({ error: 'Table not found' });
            res.json(table);
        } catch (error) {
            next(error);
        }
    }

    async callStaff(req, res, next) {
        try {
            const { id } = req.params;
            const { type } = req.body;
            const call = await tableService.callStaff(id, type);
            res.json(call);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TableController();
