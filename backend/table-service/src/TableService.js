const tableRepository = require('./TableRepository');

class TableService {
    async getAllTables() {
        return tableRepository.getAllTables();
    }

    async getTableById(id) {
        return tableRepository.getTableById(id);
    }

    async callStaff(tableId, type) {
        const table = await this.getTableById(tableId);
        if (!table) throw new Error('Table not found');
        return tableRepository.createCallRequest({
            tableId: table.id,
            tableName: table.name,
            type
        });
    }
}

module.exports = new TableService();
