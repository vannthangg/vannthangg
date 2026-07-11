const amqp = require('amqplib');

class RabbitMQ_Adapter {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.url = process.env.RABBITMQ_URL || 'amqp://localhost';
    }

    async connectBroker() {
        if (!this.connection) {
            try {
                this.connection = await amqp.connect(this.url);
                this.channel = await this.connection.createChannel();
                console.log('Connected to RabbitMQ');
            } catch (error) {
                console.error('Failed to connect to RabbitMQ', error);
                throw error;
            }
        }
    }

    getChannel() {
        return this.channel;
    }
}

module.exports = new RabbitMQ_Adapter();
