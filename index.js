const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const process = require('process')


function isDirectory(dir) {
   try {
    //    process.chdir(dir)
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

function getFileMimeType(dir, cb) {
    return getFiles(dir, (err, files)=> {
        if (err) return cb(err, null)
        files.forEach(file => {
            let fullPath = path.join(dir, file)
            exec(`file ${fullPath} --mime-type -b`, (err,stdout, stderr)=> {
                if(err) return cb(err, null)
                if(stderr) process.exit()
                cb(null, stdout, fullPath)
            })
        })
    })
}

function printMessage(fileName) {
    return (err, newDir)=> {
        if (err) throw err
        console.log(`moved ${fileName} to  ${newDir}`)
    } 
}

function groupFiles(dir) {
    return getFileMimeType(dir, (err, mimeType, file)=> {
        if (err) throw err
        const type = mimeType.split('/')[0]
        const fileName = path.basename(file)
        switch(type) {
            case 'text': {
                return moveToNewDirectory(file, 'Document', printMessage(fileName))
            }
            case 'application': {
                return moveToNewDirectory(file, 'Application', printMessage(fileName))
            }
            case 'image': {
                return moveToNewDirectory(file, 'Application', printMessage(fileName))
            }
            default: return
        }
    })
}

function moveToNewDirectory(file, folder, cb) {
    const fileName = path.basename(file)
    const dirName = path.dirname(file)
    const newDir = path.join(dirName, folder)
    const newPath = path.resolve(newDir, fileName)
    
   
    if (fs.existsSync(newDir)) {
        fs.rename(file, newPath, (err)=> {
            if (err) return cb(err, null)
            cb(null, newDir)
        })   
    }
    else {
        fs.mkdir(newDir, (err)=> {
            if (err) return cb(err, null)
            fs.rename(file, newPath, (err)=> {
                if (err) cb(err, null)
                cb(null, newDir)
            }) 
        })
    }
   
}

// const url = path.join(__dirname, 'test')
const url = '/home/vndrkl/Documents'
groupFiles(url)