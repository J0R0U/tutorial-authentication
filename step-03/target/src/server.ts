import Express = require('express');
import Passport = require('passport');
import BodyParser = require('body-parser');
import Session = require('express-session');
import JWT = require('jsonwebtoken');
import JWTStrategy = require('passport-jwt');
import { ExtractJwt } from 'passport-jwt';

class AuthenticationServer {

    private Application: Express.Application;

    constructor() {
        this.Application = Express();

        this.InitializeStrategies();
        this.InitializeMiddleware();
        this.InitializeRoutes();

        this.OnServerStart = this.OnServerStart.bind(this);
    }

    private get Port(): number {
        return 8080;
    }

    private InitializeStrategies():void{
        let HOptions : JWTStrategy.StrategyOptions = {
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken() ,
            secretOrKey : 'ballspielvereinborussiadortmundvon1909'
        } ;

        let HStrategy : Passport.Strategy = new JWTStrategy( HOptions , this.JwtVerify );

        Passport.use(HStrategy);
    }

    private JwtVerify( _Payload : any , _Callback : (error: any, user?: any, info?: any) => void ): void {
        console.log( 'payload received', _Payload );
        if( _Payload.User == 'fzentgra' && _Payload.Password == '1234' ){
            _Callback( null , _Payload.User ) ;
        } else {
            _Callback( null , false ) ;
        }
    }

    private InitializeMiddleware() {
        this.Application.use(Express.static('public'));
        this.Application.use(BodyParser.urlencoded( { extended : false } ));
        this.Application.use(BodyParser.json());
        this.Application.use(Passport.initialize());
        this.Application.use(Passport.session()); // for session support
    }

    private InitializeRoutes() {
        // Login
        this.Application.post('/login', this.OnLogin);

        // Logout
        this.Application.post( '/logout', this.OnLogout );

        // Check
        this.Application.get( '/secret' , Passport.authenticate('jwt', { session : false }), this.OnSecret );
    }

    private OnSecret(_Request: Express.Request, _Response: Express.Response): void {
        _Response.end('Great! You cant see this without a token!');
    }

    private OnLogin(_Request: Express.Request, _Response: Express.Response): void {
        if( _Request.body.User == 'fzentgra' && _Request.body.Password == '1234' ){
            let HPayload : any = { 'User' : _Request.body.User } ;
            let HToken : string = JWT.sign( HPayload , 'ballspielvereinborussiadortmundvon1909' );
            _Response.end(HToken);
        } else {
            _Response.status(500);
        }

        
    }

    private OnLogout(_Request: Express.Request, _Response: Express.Response): void {
        // doesnt work. maybe because of sessions?
        console.log('logout ' + _Request.user);
        if( _Request.user ){
            _Request.logout();
            _Response.end('success');
        } else {
            _Response.end('error');
        }
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