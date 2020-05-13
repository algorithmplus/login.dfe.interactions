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
    newFile = newFile.replace(/client-script/g, 'script');

    fs.writeFile(filename, newFile, () => { });
});