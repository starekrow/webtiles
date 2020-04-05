define(function(require) {
    "use strict"
    //var Api = require("Api");
    var registerTile = require("tile!register")
    var txOneLine = require("tile!txOneLine")
    var txTwoLine = require("tile!txTwoLine")
    var txView = require("tile!txView")
    var txEdit = require("tile!txEdit")
    var loadingOverlay = require("tile!loadingOverlay")

    function Register(fields)
    {
        let injected        = inject.me,


        this.Tile            = injected.Tile;

        let fields          = new injected.FieldSet();

        let tile = new Tile(registerTile, {

        }).draw(node);

        fields.transactions = txloaded;
        fields.

        fields.bindMethods(this.handlers);
        fields.bindHandlers(this);
        
        fields.viewTransaction.handle(field => {
            let vt = new Tile(txView, {
                tx: transactions.byId[field.value];
            }).draw();
        });
        fields.editTransaction.handle(field => {
            let vt = new Tile(txEdit, {
                tx: transactions.byId[field.value];
            }).draw();
        });
        fields.updateTransaction.handle(field => {
            let update = field.value;
            //let tx = transactions.byId[update.id];
            transactions.update(update.id, update.changes);
        });
        fields.deleteTransaction.handle(field => {
            transactions.remove(field.value);
        });
    }

    var _public = Register.prototype;
    var _static = Register;
    var _handlers = _public.handlers = {};

    _handlers.viewTransaction = function(field)
    {
        let vt = new this.Tile(txView, {
            tx: transactions.byId[field.value];
        }).draw();
    }

    _public.onLoginResult = function()
    {
        app.fields.set("api_token", result.token);
        app.fields.set("api_username", result.username);
        app.fields.set("api_userId", result.userId);
        app.fields.set("api_session", result.session);
        app.fields.api_token.value = result.token;
        app.fields.api_username.value = result.username;
        app.fields.api_userid.value = result.userId;
        app.fields.api_session.value = result.session;

        FieldSet.bind(app.fields, {
            api_token:          result.token,
            api_username:       result.username,
            api_userId:         result.userId,
            api_session:        result.session
        });

        app.fields.api_token = result.token;
        app.fields.api_username = result.username;
        app.fields.api_userid = result.userId;
        app.fields.api_session = result.session;
    }

    _public.draw = function(fields)
    {
        let prefs = fields.sessions;
        let sf = new FieldSet({
            api:            fields.api,
            username:       prefs.savedUsername,
            password:       "",
            forgotPassword: field => {
                app.forgotPassword(sf.username);
            }
        });
        let screen = new Screen("title");
        let sf = screen.fields;
        if (username) {
            sf.username = username;
        }
        sf.loginToken.bind(app);
        sf.loginResult.bind(app);
        tf.on("signin", field => {
            this.api.signin({
                "username" : sf.username.value,
                "password" : sf.password.value
            }).then(
                result => {
                    sf.loginResult.value = result;
                    app.homeScreen();
                },
                error => {
                    sf.loginErrorMessage.value = error.message;
                    sf.loginErrorCode.value = error.code;
                }
            );
        });
        tf.on("forgotPassword", field => {
            if (field.value) {
                app.forgotPassword(tf.username.value);
            }
        });
        screen.fadeIn();
    }

    _public.forgotPassword = function(username)
    {
        let screen = new Screen("forgotPassword");
        let sf = screen.fields;
        tf.on("submit", field => {
            this.api.forgotPassword({
                "email" : sf.email.value
            }).then(
                result => {
                    tf.set("submitted", true);
                },
                error => {
                    tf.set("netErrorMessage", error.message);
                    tf.set("netErrorCode", error.code);
                }
            );
        });
        screen.fields.on("continue", field => {
            this.title(values.username);
        });
        screen.fadeIn();
    }

    _public.homeScreen = function()
    {
        let home = new Screen("home");
        let hf = home.fields;
    }

    return Title;
})
