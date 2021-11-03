const express = require("express")
const path = require("path");
const { sign } = require('pdf-signer-brazil')
const fs = require('fs')
const moment = require("moment")

const app = express()

app.get("/", async (req, res) => {
    const p12Buffer = fs.readFileSync(path.resolve("./certs/cert.pfx"))
    const pdfBuffer = fs.readFileSync(path.resolve("./assets/test.pdf"))

    const signature = 'Your Name'
    const password = '22059'
    const signedPdf = sign(pdfBuffer, p12Buffer, password, {
        reason: 'Test',
        email: 'mail@mail.com',
        location: 'City, BR',
        signerName: signature,
        annotationAppearanceOptions: {
            signatureCoordinates: { left: 20, bottom: 120, right: 190, top: 20 },
            signatureDetails: [
                {
                    value: signature,
                    fontSize: 5,
                    transformOptions: { rotate: 0, space: 2, tilt: 0, xPos: 0, yPos: 32 },
                },
                {
                    value: 'Este arquivo foi assinado digitalmente',
                    fontSize: 5,
                    transformOptions: { rotate: 0, space: 2, tilt: 0, xPos: 0, yPos: 25.4 },
                },
                {
                    value: 'Assinado em ' + moment().format("DD/MM/YYYY HH:mm"),
                    fontSize: 5,
                    transformOptions: { rotate: 0, space: 2, tilt: 0, xPos: 0, yPos: 18 },
                },
                {
                    value: 'Verifique o arquivo em verificador.iti.gov.br',
                    fontSize: 5,
                    transformOptions: { rotate: 0, space: 2, tilt: 0, xPos: 0, yPos: 11 },
                },
            ]
        },
    })

    signedPdf.then(content => {
        fs.writeFileSync('./assets/signed.pdf', content)
        res.header('Content-Type', 'application/pdf')
        res.send(content)
    })
    .catch(err => {
        res.status(500).json({ error: err })
    })
})

app.listen(8000, () => {
    console.log("Listening on port 8000!")
})