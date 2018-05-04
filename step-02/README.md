# Step 02: Sessions
## Ausgangslage
Beim Test stellen wir fest, dass der Login nun korrekt funktioniert, jedoch der Logout fehlschlägt (Der User ist dort unbekannt).
Dies liegt daran, dass die von uns entwickelte Authentifizierung Requestspezifisch ist, es wird keine Nutzersession angelegt.
Dies entwickeln wir nun.

## Sessions aktivieren
Wir werden die einfachste Variante von Sessions nutzen: Die Authentifizierung über Cookies.
Dazu installieren wir uns eine Middleware von Express:
```
npm install --save express-session @types/express-session
```

Nun aktivieren wir Sessions in unserem Server:
```typescript
    private InitializeMiddleware() {
        this.Application.use(Express.static('public'));
        this.Application.use( Session( { secret : 'ballspielvereinborussiadortmundvon1909' } ) );
        this.Application.use(BodyParser.urlencoded( { extended : false } ));
        this.Application.use(Passport.initialize());
        this.Application.use(Passport.session()); // for session support
    }

    private InitializeRoutes() {
        // Login
        this.Application.post('/login', Passport.authenticate('local'), this.OnLogin);

        // Logout
        this.Application.post( '/logout', this.OnLogout );
    }
```

Außerdem müssen wir die SerializeUser und DeserializeUser Methoden von Passport setzen, damit ein Nutzer in eine Session serialisiert werden kann:
```typescript
    private InitializeStrategies():void{
        // Default for Options are "username" and "password"
        Passport.use( new LocalStrategy.Strategy( { usernameField:'User' , passwordField:'Password'} , this.LocalVerify ) );

        Passport.serializeUser( this.SerializeUser );
        Passport.deserializeUser( this.DeserializeUser );
    }

    private SerializeUser( _User : any , _Done : ( _Error : any , _ID? : any ) => void ):void{
        // User is string
        _Done( null , _User );
    }

    private DeserializeUser(  _ID : any , _Done : ( _Error : any , _User : any ) => void  ):void{
        // ID is whole User
        _Done( null , _ID );
    }
```

Die Nutzung von Sessions erfolgt nun automatisch über den Server und den Browser.