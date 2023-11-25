const express=require("express");
const amqp = require("amqplib");
const app =express();
app.use(express.json())
let channel,connection;
async function connectQueue() {   
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
        
    } catch (error) {
        console.log(error)
    }
}
connectQueue()
async function sendData (data) {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    // await channel.close();
    // await connection.close(); 
}
app.get("/send-msg",(req,res)=>{
    const data={
        title:"Wings of fire",
        author:"APJ Abdul Kalam"
    }
    sendData(data)
    console.log("Message sent to queue")
    res.send("Message Sent")
})
app.listen(3000,()=>{
    console.log("Server is listening on port 3000")
})