const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const routes = require('./controllers/');
const sequelize = require('./config/connection');
const hbs = exphbs.create();

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

require('dotenv').config();


const sess = {
  secret: process.env.SESS_sec,
  cookie: {},
  resave: false,
  saveUninitialize: true,
  store: new SequelizeStore({
    db: sequelize
  })
};


app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
