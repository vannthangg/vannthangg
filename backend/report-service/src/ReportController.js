const reportService = require('./ReportService');

class ReportController {
    async submitRating(req, res, next) {
        try {
            const { tableId, tableName, stars, note } = req.body;
            const rating = await reportService.createRating({
                tableId: tableId ? parseInt(tableId) : null,
                tableName,
                stars: parseInt(stars),
                note
            });
            res.status(201).json(rating);
        } catch (error) {
            next(error);
        }
    }

    async getRatings(req, res, next) {
        try {
            const ratings = await reportService.getRatings();
            res.json(ratings);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();
