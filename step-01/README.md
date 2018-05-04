# Step 01: Grundlegende Authentifizierung
## Ausgangslage

## Authentifierung
Für die Authentifierung nutzen wir die sehr bekannte Library [PassportJS](http://www.passportjs.org/).
PassportJS bietet ein relativ simples Authentifzierungssystem, das auf so genannten "Strategien" basiert.
Es gibt bereits fertige Strategien für eine Authentifizierung über Facebook, Twitter, GitHub, LDAP, etc.

Wir schreiben heute unsere Authentifizierung selber und nutzen dafür [passport-local](https://github.com/jaredhanson/passport-local).

```
npm install --save passport @types/passport passport-local @types/passport-local
```

## Server Seite
Zunächst importieren wir die beiden Bibliotheken in unserem Server.
```typescript
    import Passport = require('passport');
    import LocalStrategy = require('passport-local');
```

Anschließend binden wir Passport als Middleware ein:
```typescript
    this.Application.use(Passport.initialize());
```

Außerdem müssen wir Passport noch entsprechend konfigurieren: Dies tun wir in einer neuen Methode.
```typescript
    private InitializeStrategies():void{
        // Default for Options are "username" and "password"
        Passport.use( new LocalStrategy.Strategy( { usernameField:'User' , passwordField:'Password'} , this.LocalVerify ) );
    }
```

Jede Passport Strategie hat eine so genannte Verify Methode, in der die Korrektheit der Nutzerdaten überprüft werden.
Unsere sieht so aus:

```typescript
    private LocalVerify( _User: string, _Password: string, _Done: ( _Error: any, _User?: any, _Options?: LocalStrategy.IVerifyOptions) => void ): void {
        // Hier könnten Ihr Nutzerdaten stehen!
        if( _User == 'fzentgra' && _Password == '1234' ){
            return _Done( null , _User );
        } else {
            return _Done( null , false , { message : 'Incorrect data' } );
        }
    }
```

Damit Passport an die Nutzerdaten rankommt, benötigen wir zusätzlich noch einen BodyParser:
```
npm install --save body-parser @types/body-parser
```
```typescript
import BodyParser = require('body-parser');
// ...
this.Application.use(BodyParser.urlencoded( { extended : false } ));
```


Jetzt fehlen uns noch die tatsächliche Aufrufe, um sich einzuloggen.
Dazu legen wir Listener für Post-Befehle auf zwei Pfade unserer Wahl:

```typescript
    private InitializeRoutes() {
        // Login
        this.Application.post('/login', Passport.authenticate('local'), this.OnLogin);

        // Logout
        this.Application.post( '/logout', this.OnLogout );
    }

    private OnLogin(_Request: Express.Request, _Response: Express.Response): void {
        console.log('login');
        _Response.end(_Request.user);
    }

    private OnLogout(_Request: Express.Request, _Response: Express.Response): void {
        // doesnt work. maybe because of sessions?
        console.log('logout' + _Request.user);
        if( _Request.user ){
            _Request.logout();
            _Response.end('success');
        } else {
            _Response.end('error');
        }
    }
```

Man kann, wenn man nicht mit einem ClientRouter arbeitet, auch direkte Redirects einbauen:
```typescript
    this.Application.post( '/login' , Passport.authenticate( 'local' , { successRedirect : '/super/secret/page' , failureRedirect : '/login' , failureFlash : true } )  ;
```

## Client Seite
Jetzt müssen wir natürlich den Server noch korrekt anfunken.
Dazu öffnen wir den Login Store und füllen die Login/Logout Methoden mit Leben:
```typescript
        $.ajax(
            {
                type: 'POST',
                url: 'http://localhost:8080/login',
                data: { 'User': _Username, 'Password': _Password },
                success: this.OnLoginSucceeded,
                error: this.OnLoginFailed
            }
        );
```
```typescript
        $.ajax(
            {
                type: 'POST',
                url: 'http://localhost:8080/logout',
                success: this.OnLogoutSucceeded,
                error: this.OnLogoutFailed
            }
        );
```