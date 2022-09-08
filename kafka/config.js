module.exports = {
    KAFKA_BROKERS: process.env.KAFKA_HOST || "localhost:9092",
    KAFKA_CLIENTID: process.env.KAFKA_CLIENTID || "license_api",
    KAFKA_GROUPID: process.env.KAFKA_GROUPID  || "license_api",
    KAFKA_TOPIC: process.env.KAFKA_TOPIC  || "licenseapi",
};