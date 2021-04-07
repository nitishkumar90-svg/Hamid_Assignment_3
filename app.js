const express = require("express")
const app = express()
const myAxios = require("axios")
const fileStream = require('fs')
const port = 3232
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

const newFileWithContent = (record, fileName) => {
    if (record === undefined || record === null) {
        console.log('No record found')
        return
    }
    const fileWS = fileStream.createWriteStream(`${fileName}`)
    fileWS.on('error', (error) => {
        console.log(`Error: ${error}`)
    })
    logMessageToFile(`----------> ${currentDate} <----------\n\n`, fileWS)
    logMessageToFile(`Id: ${record.id}\nTitle:${record.title}\nBody: ${record.body}\n`, fileWS)
    logMessageToFile(`----------------------------------------------------------------\n\n\n`, fileWS)
    fileWS.end();
}

const logMessageToFile = (message, fileWS) => {
    fileWS.write(message)
}

const fetchRecords = () => {
    const fileName = process.argv[2]
    if (fileName === undefined)
        fileName = 'dummy.txt'
    const querySelectors = process.argv[3]
    if (fetchContent) {
        myAxios.get(`https://jsonplaceholder.typicode.com/posts/${querySelectors}`)
            .then(response => {
                newFileWithContent(response.data, fileName)
                console.log(`Data copied to ${fileName}`)
            })
            .catch(function (error) {
                console.log(`Error:`, error.message)
            })
            .then(function () {
            })
    }
}