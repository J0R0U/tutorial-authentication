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

## Initialer Check
Unser Login ist nun Session gebunden und kann somit auch noch bestehen, wenn die Seite initial aufgerufen wird.
Deswegen bauen wir noch einen internen Check ein:

```typescript
    componentDidMount():void{
        AppActionHandler.OnCheckLoginState();   
    }
```

```typescript
    export function OnCheckLoginState():void{
        AppDispatcher.dispatch( {
            ActionType : AppActionType.AT_CHECK_LOGIN ,
            Data : {}
        } ); 
    }
```

```typescript
    private CheckLogin():void{
        $.ajax(
            {
                type: 'GET',
                url: 'http://localhost:8080/check',
                success: this.OnCheckSucceeded,
                error: this.OnCheckFailed
            }
        );   
    }

    private OnCheckSucceeded( _Response : string ): void {
        AppActionHandler.OnLoginSucceeded( _Response );
    }

    private OnCheckFailed(_Response: any): void {
        AppActionHandler.OnLoginFailed(_Response.message);
    }
```


```typescript
        // Check
        this.Application.get( '/check' , this.OnCheck );
    }

    private OnCheck(_Request: Express.Request, _Response: Express.Response): void {
        if( _Request.user ){
            _Response.end(_Request.user);
        } else {
            _Response.status(500).send({ error : '_User isnt logged In' });
        }
    }
```