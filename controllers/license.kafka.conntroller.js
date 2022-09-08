const kafkaClient = require("../kafka")
const license = require("../controllers/license.controller.js");



const consumer = kafkaClient.consumer

exports.init = () => {
    consumer.subscribe({ topics: ['userapi'] }).then(() => {
        console.log("subscribing to user api topic")
    })
    consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
            console.log({
                value: message.value.toString(),
                headers: message.headers,
            })

            payload = JSON.parse(message.value)
            if (payload.action == "USER_CREATE_SUCCESS") {
                var userId = payload.payload.id
                console.log("user id is :: " + userId)
                body = {"userId": userId}
                license.createTrigger(body)
            }
        },
    })
}