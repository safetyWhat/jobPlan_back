const express = require('express');
const app = express();
const router = require('./routes/router');
const cors = require('cors');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', router);

app.use((req, res) => {
    res.status(404).render('404');
    res.status(500).render('Something Broke!!!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});