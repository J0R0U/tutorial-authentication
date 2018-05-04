import flux = require('flux');
import AppAction from './app-action';

var AppDispatcher: flux.Dispatcher<AppAction> = new flux.Dispatcher();

export = AppDispatcher;