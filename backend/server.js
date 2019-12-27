const http =require('http');
const app=require('./app');
const port=process.env.port ||3000;
app.set("port",port);

OnError=error=>{
    console.log(error);
}

onListen=()=>{
    console.log("Listening at Port :"+port);
}
const server=http.createServer(app);
server.on('error',OnError)
server.on('listening',onListen);
server.listen(port);

//cY0Iba24qkDzS2ZM // mongodb