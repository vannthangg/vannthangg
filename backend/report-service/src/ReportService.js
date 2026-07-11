const reportRepository = require('./ReportRepository');
const EventBus = require('../../shared/events/EventBus');
const EventContracts = require('../../shared/events/EventContracts');

class ReportService {
    constructor() {
        this.initEventListeners();
    }

    async initEventListeners() {
        // Listen to completed payments to update daily stats
        EventBus.subscribe(EventContracts.PaymentCompletedEvent, async (payment) => {
            console.log(`[ReportService] Processing PaymentCompletedEvent for payment ${payment.id}`);
            // In a real system, you'd fetch the order total here or it would be included in the event
            // For now, we simulate incrementing with a dummy revenue
            const date = new Date();
            date.setHours(0, 0, 0, 0); // start of day
            await reportRepository.incrementDailyStat(date, 0); 
        });
    }

    async createRating(data) {
        return reportRepository.createRating(data);
    }

    async getRatings() {
        return reportRepository.getRatings();
    }
}

module.exports = new ReportService();
