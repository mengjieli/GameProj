require("./com/requirecom");
require("./net/requirenet");

require("./clients/localClient/LocalClient");

startLocalClient();


var httpServer = new HttpServer(16800, "./../");
httpServer.start();