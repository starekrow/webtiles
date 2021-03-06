define(function(require) {
    "use strict"
    //var Api = require("Api");
    var titleTile = require("tile!title")

    function Title(fields)
    {
        let injected        = inject();
        let prefs           = injected.Preferences.data,
            Screen          = injected.Screen;

        Screen.Main.preload();
        Screen.ForgotPassword.preload();

        injected.viewGraph.append(new titleTile({
            username:       prefs.username,
            password:       "",
            forgotPassword: function() {
                this.busy = true;
                Screen.ForgotPassword.render({
                    username: this.username
                });
            },
            signIn:         function(value) {
                this.loading = true;
                let username = this.username;
                injected.api.signin({
                    "username" : username,
                    "password" : this.password
                }).then(
                    result => {
                        prefs.username = username;
                        published.loginResult = result;
                        if (result.goto) {
                            Screen.render(result.goto, result.data);
                        } else {
                            Screen.Main.render({});                            
                        }
                    },
                    error => {
                        this.loginError = error;
                    }
                );
            },
            termsLink:      function() {
                this.busy = true;
                creen.TermsOfUse.render({});
            },
            privacyLink:    function() {
                this.busy = true;
                Screen.PrivacyPolicy.render({});
            }
        }));
    }

    var _public = Title.prototype;
    var _static = Title;

    _public.start = function()
    {
        titleTile
        this.fields = new FieldSet();
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
