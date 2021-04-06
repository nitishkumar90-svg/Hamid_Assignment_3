const express = require("express")
const app = express()
const myAxios = require("axios")
const fileStream = require('fs')
const port = 4444
const fetchContent = true
const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

//#region Express
app.get('/', function (req, resp) {
    resp.send(fetchRecords())
})

app.listen(port, function () {
    console.log(`Server is running on port ${port}`)
})

//#endregion

const newFileWithContent = (records, fileName) => {
    if (fileName === undefined)
        fileName = 'dummy.txt'
    if (records === undefined) {
        console.log('No record found')
        return
    }
    const fileWS = fileStream.createWriteStream(`${fileName}`)
    fileWS.on('error', (error) => {
        console.log(`Error: ${error}`)
    })
    logMessageToFile(`----------> ${currentDate} <----------\n\n`, fileWS)
    records.map((record) => {
        logMessageToFile(`Id: ${record.id}, Name:${record.name}, Email Address: ${record.email} \n\n`, fileWS)
    })
    fileWS.end();
    return 'Copied!!'
}

const logMessageToFile = (message, fileWS) => {
    fileWS.write(message)
}

const fetchRecords = () => {
    const fileName = process.argv[2]
    const querySelectors = process.argv[3]
    if (fetchContent) {
        myAxios.get('https://jsonplaceholder.typicode.com/users')
            .then(response => response.data).then(response => {
                newFileWithContent(response, fileName)
                return 'Copied!!'
            })
            .catch(function (error) {
                // handle error
                console.log(error)
                return error
            })
            .then(function () {
                return 'Hiiiii'
            })
    }
}