const path = require('path');
const fs = require('fs');

console.log(process.argv);

const filename = `${process.argv[2]}/index.html`;

const indexFile = path.resolve(filename);
fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Something went wrong:', err);
    }

    let newFile = data.replace(/(\r\n)*<script.*?\/script>(\r\n)*/g, '');

    //replace for local environment
    // newFile = newFile.replace(/<client-script>/, '<script src="/b2c/assets/js-static/domManipulation.js">');

    //replace for production build
    newFile = newFile.replace(/<client-script>/, '<script src="/__b2cPath__/b2c/assets/js-static/domManipulation.js">');

    //replace ending "client-script" tag
    newFile = newFile.replace(/<\/client-script>/, '</script>');

    fs.writeFile(filename, newFile, () => { });
});