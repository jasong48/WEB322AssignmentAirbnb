const express = require('express');
const app = express();
const exphbs = require('express-handlebars');



app.engine('hbs', exphbs({defaultLayout: '/home', extname: '.hbs'}));
app.set('view engine', 'hbs');


app.use(express.static(__dirname + '/public'));



//routing 
app.get("/", (req, res) => {
    res.render("home", { layout: false }); 
  });

  app.get("/home", (req, res) => {
    res.render("home", { layout: false }); 
  });

//routing
app.get("/room", (req, res) => {
    res.render("room", { layout: false }); 
  });

//routing
app.get("/reg", (req, res) => {
    res.render("reg", { layout: false }); 
  });

app.listen(8080, () => {
    console.log('Server is starting at port ', 8080);
})



