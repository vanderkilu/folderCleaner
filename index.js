const fs = require('fs')
const path = require('path')

function isDirectory(dir) {
   try {
       return fs.lstatSync(dir).isDirectory()
   }
   catch(err) {
       return false
   }
}

function getFiles(dir, cb) {
    if (!isDirectory(dir)) {
       return cb(new Error('path is not a directory or does not exist'), null)
    }
    fs.readdir(dir, (err, files)=> {
        if (err) return cb(new Error('error reading file'), null)
        cb(null, files)
    })
}

function checkFile(dir) {
    getFiles(dir, (err, files)=> {
        if (err) throw err
        files.forEach(file => {
            let fullPath = path.join(dir, file)
            console.log(fullPath)
        })
    })
}

const url = path.join(__dirname, 'test')
checkFile(url)