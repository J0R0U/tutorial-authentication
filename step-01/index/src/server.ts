import Express = require('express');

class AuthenticationServer {

    private Application: Express.Application;

    constructor() {
        this.Application = Express();

        this.InitializeMiddleware();
        this.InitializeRoutes();

        this.OnServerStart = this.OnServerStart.bind(this);
    }

    private get Port(): number {
        return 8080;
    }

    private InitializeMiddleware() {
        this.Application.use(Express.static('public'));
    }

    private InitializeRoutes() {
    }

    private OnServerStart() {
        console.log(`AuthenticationServer has been started on Port ${this.Port}`);
    }

    public Start(): void {
        this.Application.listen(this.Port, this.OnServerStart);
    }
}


let Server = new AuthenticationServer();
Server.Start();