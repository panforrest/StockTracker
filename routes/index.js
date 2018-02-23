// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
// router.get('/', function(req, res){
//     if(req.vertexSession.user) {
//         res.redirect('/stocks')
//     } else {
//         res.render('index', {text: 'This is the dynamic data. Open index.js from the routes directory to see.'})
//     }
// })

router.get('/', function(req, res){
    if(req.vertexSession.user) {
        res.redirect('/stocks')
    } else {
        let loginmessage = req.query.loginmessage
        let signupmessage = req.query.signupmessage
        res.render('index', {loginmessage: loginmessage, signupmessage: signupmessage})
    }
})

router.get('/stocks', function(req, res) {
    if(req.vertexSession.user) {
        res.status(200).json({
            confirmation: 'success'
        })
    } else {
        res.redirect('/')
    }
})

router.post('/login', function(req, res) {
    turbo.login(req.body)
    .then(data => {
        req.vertexSession.user = {id: data.id}
        res.redirect('/stocks')
    })
    .catch(err => {
        res.redirect('/?loginmessage=' + err.message)
    })
})

router.post('/signup', function(req, res) {
    turbo.createUser(req.body)
    .then(data => {
        req.vertexSession.user = {id: data.id}
        res.redirect('/stocks')
    })
    .catch(err => {
        res.redirect('/?signupmessage' + err.message)
    })
})

router.get('/logout', (req, res) => {
    req.vertexSession.reset()
    res.redirect('/')
})

module.exports = router
