const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User } = require("./model/use.js");
const { Clothes } = require("./model/Clothes.js");
const path = require('path');
const multer = require('multer');
var app = express();


// chuyển đổi file sang String với multer


// connect with mongooeDB
dotenv.config();
mongoose.connect("mongodb://127.0.0.1:27017/ass_gd1_huynvph20687", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(console.log('connect to mongooDB'))
    .catch(error => console.log(error));
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// app.engine('.ejs', exphbs.engine({ extname: ".ejs",
// defaultLayout: false,
// layoutsDir: "views/"}));
// // app.use(exphbs);
// // app.set('layout');
// app.set('view engine', 'ejs');
app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', '.hbs');

// up avata
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const str = file.originalname;
        const parts = str.split(".");
        let doandau = parts[0];
        let doansau = parts[1];

        cb(null, doandau + '-' + Date.now() + '.' + doansau)
    }
})

var upload = multer({ storage: storage })
// login logic

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/', (req, res) => {
    res.render('login');
});


app.get('/home', async (req, res) => {
    const data = await User.find();
    const dataProduct = await Clothes.find();
    res.render(
        'home',
        { titile: "huy", users: data.map(user => user.toJSON()), products: dataProduct.map(product => product.toJSON()) }
    );
});

app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({
        email: email,
        password: password
    })
        .then(user => {
            if (user) {
                res.redirect('/home');
            } else {
                res.send('<script>alert("Tài khoản hoặc mật khẩu không đúng!"); window.location.href="/login";</script>');
            }
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});





// đăng ký tài khoản
app.get('/register', (req, res) => {
    res.render('register');
});



app.post('/register', upload.single('myFile'), async (req, res) => {
    const file = req.file;
    const { name, email, password, repassword } = req.body;
   
    if (name === '' || password === '' || repassword === '' || email === '') {
        res.send('<script>alert("Vui lòng nhập đầy đủ thông tin đăng ký!"); window.location.href="/";</script>');
        res.render('register', { showSuccess: false });
        return ;
    } else {
        User.create(req.body).then(data => {
            res.render('login', { showSuccess: true });
        })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
    }
});

// thêm sản phẩm bán hàng
app.get('/addnewProduct', (req, res) => {
    res.render('addnewProduct');
});

app.post('/addnewProduct', async (req, res) => {
    if (req.body.id == '') {
        try {
            Clothes.create(req.body)
                .then(data => {
                    res.redirect('addnewProduct');
                })
                .catch(err => console.log(err));
        } catch (error) {
            console.log(error);
        }
        res.render('addnewProduct');
    } else {
        await Clothes.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });
        res.redirect('home');
    }

});

app.get('/update/:id', async (req, res) => {
    const cloth = await Clothes.findById(req.params.id);
    res.render('addnewProduct', { object: cloth.toJSON(), titile: "Cập nhật sản phẩm" });
});

app.get('/delete/:id', async (req, res) => {
    try {
        await Clothes.findByIdAndDelete(req.params.id, req.body);
        res.redirect('home');
    } catch (error) {
        res.sendStatus(500);
    }
});
// app.post('/user', async (req, res)=> {
//     try {
//         const user = new User(req.body);
//         await user.save();
//         res.sendStatus(200).json(user);
//     } catch (error) {
//         res.sendStatus(500).json(error);
//     }
// });



app.listen(3000, () => {
    console.log('Hello you');
})