// load the things we need
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const app = express();

// set the view engine to ejs
app.use(expressLayouts)
app.set('layout', './layouts/default.ejs')
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/assets', express.static('assets'));
app.use('/css', express.static('css'));
app.use('/scripts', express.static('scripts'));

app.get('/:pageName?', function (req, res) {
    const page = req.params.pageName || 'index';
    const options = {
        scripts: [],
        modules: [
            `./scripts/${page}.js`
        ]
    };

    if (['index', 'products', 'product'].includes(page)) {
        options.scripts.push(
            'https://cdn.amcharts.com/lib/4/core.js',
            'https://cdn.amcharts.com/lib/4/charts.js',
            'https://cdn.amcharts.com/lib/4/themes/animated.js',
        );

        if(page!='product') {
            options.modules = [
                `./scripts/app.js`
            ]
        }
    }

    if (['login', 'register'].includes(page)) {
        options.layout = './layouts/form.ejs';
    }

    res.render(page, options);
});


app.listen(8080, () => console.info(`App listening on port 8080`))