import Express = require('express');
import Passport = require('passport');
import BodyParser = require('body-parser');
import Session = require('express-session');
import JWT = require('jsonwebtoken');
import { Strategy as JWTStrategy, StrategyOptions as JWTStrategyOptions } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

const PRIVATE_KEY : string = 'ballspielvereinborussiadortmundvon1909' ;
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
        let HOptions : JWTStrategyOptions = {
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken() ,
            secretOrKey : PRIVATE_KEY
        } ;

        let HStrategy : Passport.Strategy = new JWTStrategy( HOptions , this.JwtVerify );

        Passport.use(HStrategy);
    }

    private JwtVerify( _Payload : any , _Callback : (error: any, user?: any, info?: any) => void ): void {
        console.log();
        console.log( 'payload received', _Payload );
        if( _Payload.User == 'fzentgra' ){
            _Callback( null , _Payload.User ) ;
        } else {
            _Callback( null , false ) ;
        }
    }

    private InitializeMiddleware() {
        this.Application.use(Passport.initialize());
        this.Application.use(BodyParser.urlencoded( { extended : true } ));
        this.Application.use(BodyParser.json());
    }

    private InitializeRoutes() {
        // Login
        this.Application.post('/login', this.OnLogin);

        // Check
        this.Application.get( '/secret' , Passport.authenticate('jwt', { session : false }), this.OnSecret );
    }

    private OnSecret(_Request: Express.Request, _Response: Express.Response): void {
        _Response.end('Great! You cant see this without a token!');
    }

    private OnLogin(_Request: Express.Request, _Response: Express.Response): void {
        if( _Request.body.User == 'fzentgra' && _Request.body.Password == '1234' ){
            let HPayload : any = { 'User' : _Request.body.User } ;
            let HToken : string = JWT.sign( HPayload , PRIVATE_KEY );
            _Response.end(HToken);
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