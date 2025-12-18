const http = require('http')
const app = require("./src/config/express.config");

const httpServer = http.createServer(app);

// TODO:move to environment
const HostName = "localhost"
const PortNo = 9005

httpServer.listen(PortNo, HostName, (err) => {
    if (!err) {
        console.log(`server is running on http://${HostName}:${PortNo}`)
        console.log(`Press CTRL+C to stop server ...`)
    }
});
