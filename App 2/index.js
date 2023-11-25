
const express=require("express");
const amqp = require("amqplib");
const app =express();
app.use(express.json())
let channel,connection;
connectQueue()  // call the connect function
 
async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
        
        channel.consume("test-queue", data => {
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        })
    } catch (error) {
        console.log(error);
    }
}
app.get("/",(req,res)=>{
    res.send("Hello world")
})
app.listen(3001,()=>{
    console.log("Server is listening on port 3001")
})