const jsonServer = require("json-server")

const server = jsonServer.create();

const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
    console.log("Request Recieved");
    res.header("Access-COntrl-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
    next();
});

server.use(router)

server.listen(3001, () => {
    console.log("JSON server is running at: 3001")
})