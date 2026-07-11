const rabbitMQAdapter = require('./RabbitMQ_Adapter');

class EventBus {
    async publish(eventName, payload) {
        await rabbitMQAdapter.connectBroker();
        const channel = rabbitMQAdapter.getChannel();
        await channel.assertExchange(eventName, 'fanout', { durable: false });
        channel.publish(eventName, '', Buffer.from(JSON.stringify(payload)));
        console.log(`[x] Published ${eventName}`);
    }

    async subscribe(eventName, callback) {
        await rabbitMQAdapter.connectBroker();
        const channel = rabbitMQAdapter.getChannel();
        await channel.assertExchange(eventName, 'fanout', { durable: false });
        
        const q = await channel.assertQueue('', { exclusive: true });
        console.log(`[*] Waiting for messages in ${eventName}. To exit press CTRL+C`);
        
        channel.bindQueue(q.queue, eventName, '');
        
        channel.consume(q.queue, (msg) => {
            if (msg.content) {
                const payload = JSON.parse(msg.content.toString());
                callback(payload);
            }
        }, { noAck: true });
    }
}

module.exports = new EventBus();
