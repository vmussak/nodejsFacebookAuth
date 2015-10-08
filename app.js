var express = require('express'),
  	passport = require('passport'),
  	FacebookStrategy = require('passport-facebook').Strategy,
  	bodyParser = require('body-parser'),
  	session = require('express-session'),
  	credentials = require('./configuration/credentials'),
  	app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000, function() {
    console.log('Aplicação rodando!');
});

/*Configurações do passport*/
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: credentials.facebook_api_key,
    clientSecret:credentials.facebook_api_secret ,
    callbackURL: credentials.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      	return done(null, profile);
    });
  }
));


/*Rotas*/
app.get('/', function(req, res){
  res.send('API de autenticação com Redes sociais');
});

app.get('/account', usuarioAutenticado, function(req, res){
	console.log(req);
	res.json(req.user);
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/login', function(req, res){
	res.send('Faça autenticacao para prosseguir!');
})

function usuarioAutenticado(req, res, next) {
  if (req.isAuthenticated())
  	return next(); 
  res.redirect('/login')
}