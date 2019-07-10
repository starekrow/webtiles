define(function(require) {
    "use strict"
    //var Api = require("Api");
    var titleTile = require("tile!title")
    var env;

    function Title(fields, environment)
    {
        env = environment;
        this.fields = fields;

        let titleFields = new FieldSet({
            username:       env.prefs.username,
            password:       env.prefs.password,
            forgotPassword: field => {
                titleFields.busy = true;
                require(["logic/ForgotPassword"], (ForgotPassword) => {
                    new ForgotPassword({
                        username: titleFields.username
                    }, env);
                });
            },
            signIn:         field => {
                titleFields.loading = true;
                env.api.signin({
                    "username" : titleFields.username.value,
                    "password" : titleFields.password.value
                }).then(
                    result => {
                        titleFields.loginResult.value = result;
                        app.homeScreen();
                    },
                    error => {
                        titleFields.loginError = error;
                    }
                );
            },
            termsLink:      field => {
                titleFields.busy = true;
                require(["logic/TermsOfUse"], (terms) => {
                    new terms(null, env);
                })
            },
            privacyLink:      field => {
                titleFields.busy = true;
                require(["logic/PrivacyPolicy"], (ppol) => {
                    new ppol(null, env);
                })
            }
        }, fields);
        titleTile.render("screen", titleFields, env);

        let screen = new Screen("title");
        let sf = screen.fields;


        var d = document.createElement("div");
        
        document.body.appendChild(d);
        try {        
            var tag = riot.mount(d, 'example-1')[0];
        } catch(e) {
            console.log( "Mount failed, " + e.toString());
        }
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
