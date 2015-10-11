var express = require('express'),
  	passport = require('passport'),
  	FacebookStrategy = require('passport-facebook').Strategy,
  	bodyParser = require('body-parser'),
  	session = require('express-session'),
  	credentials = require('./configuration/credentials'),
    engine = require('ejs-locals'),
  	app = express();


app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('public'));

app.listen(app.get('port'), function() {
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
    callbackURL: credentials.callback_url,
    profileFields: ['id', 'displayName', 'photos', 'emails', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      	return done(null, profile);
    });
  }
));


/*Rotas*/
app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', usuarioAutenticado, function(req, res){
  console.log(req.user.photos[0].value);

	res.render('perfil', {user: req.user});
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
	res.redirect('/');
})

function usuarioAutenticado(req, res, next) {
  if (req.isAuthenticated())
    return next(); 
  res.redirect('/login')
}