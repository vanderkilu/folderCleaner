const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')

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
            
        })
    })
}

const url = path.join(__dirname, 'test', 'file.txt')
console.log(url)
let chunk = readChunk.sync(url, 0, fileType.minimumBytes)
console.log(fileType(chunk))
// checkFile(url)