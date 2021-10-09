const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/dbConnect");
const methodOverride = require("method-override");
const {
  formatDate,
  trimText,
  removeTags,
  editIcon,
  select,
  upperCase,
} = require("./helpers/hbs");

const app = express();
connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
dotenv.config({ path: "./config/config.env" });

require("./config/passport")(passport);

app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, trimText, removeTags, editIcon, select, upperCase },
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));
app.use(function (req, res, next) {
  res.render("error/404", { profileImg: req.user.image });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
