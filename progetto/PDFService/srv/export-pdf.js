
const PDFDocument = require("pdfkit-table");
const axios = require('axios');
const sharp = require("sharp");
module.exports = cds.service.impl(function () {
    this.on('getCSRFToken', () => {
        return "Token"
    });
    this.on('format_PDF', async (req) => {
        console.log("dentro")
        let lineItems = req.data.results
        if(lineItems.length>0){
            let rowsItems = lineItems.length - 1;
            console.log(lineItems.length)
            let rowsCount = 0;
            let dataCorrente = new Date();
            let stringData = dataCorrente.toLocaleDateString();
            var data;
            let header;
            var doc = new PDFDocument({
                bufferPages: true,
                layout: 'landscape',
                
            })
            let rowsItem = [];
            var arrayImages = []
            var SommaRETAIL_FULL_PRICE=0;
            var SommaPIECES_SOLD=0;
            var SommaSELL_OUT_PRICE=0;
            for (const item of lineItems) {
                header = Object.keys(item);
                for (var i = header.length - 1; i >= 0; i--) {
                    if (header[i].toUpperCase() === "IMAGE_URL") {
                        let result = item[header[i]];
                        if (result.includes("https")) {
                            arrayImages.push(item[header[i]])
                        }
                        header.splice(i, 1);
                    }
                    if(header[i].toUpperCase() === "PIECES_SOLD"){
                        let valoreDaSomma=item[header[i]]
                        
                        SommaPIECES_SOLD=SommaPIECES_SOLD+(parseFloat(valoreDaSomma))
                    }
                    if(header[i].toUpperCase() === "RETAIL_FULL_PRICE"){
                        let valoreDaSomma=item[header[i]]
                        SommaRETAIL_FULL_PRICE=SommaRETAIL_FULL_PRICE+(parseFloat(valoreDaSomma))
                    }
                    if(header[i].toUpperCase() === "SELL_OUT_PRICE"){
                        let valoreDaSomma=item[header[i]]
                        SommaSELL_OUT_PRICE=SommaSELL_OUT_PRICE+(parseFloat(valoreDaSomma))
                    }
                    
                }
                let onerows = [];
                for (let i = 0; i < header.length; i++) {
    
                    let result = item[header[i]];
                    if(result!=null){
                        if (result.includes("https")) {
    
                            arrayImages.push(item[header[i]])
                            onerows.push("-")
                        } else {
                            onerows.push(item[header[i]])
                        }
                    }else{
                        onerows.push("-")
                    }
                   
                }
                if (arrayImages.length > 0) {
                    onerows.splice(0, 0, "");
                }
                rowsItem.push(onerows)
            }
            if (arrayImages.length > 0) {
                header.splice(0, 0, "Images");
            }
            const table2 = {
                title: "Retail Sales daily report " + stringData,
                subtitle: "Somma Pieces Sold ="+SommaPIECES_SOLD +"PZ"+"\n"+"Somma Retail Full Price ="+SommaRETAIL_FULL_PRICE+"€"+"\n"+"Somma Sell Out Price ="+SommaSELL_OUT_PRICE+"€"
                ,
                headers: header,
                rows: rowsItem
            }
            let imageDataArray = []
            for (let i = 0; i < arrayImages.length; i++) {
                let element = arrayImages[i];
                try {
                    const image = await axios.get(element, { responseType: "arraybuffer" });
                    const resizedImage = await sharp(image.data)
                        .resize(20, 20)
                        .toBuffer();
                    const imageData = Buffer.from(resizedImage, "binary");
                    imageDataArray.push(imageData)
                } catch (error) {
                    // Handle any errors that occur while processing the image
                    console.error(`Error processing image for line item ${i}: ${error}`);
                    imageDataArray.push("-")
                }
                
            }
            doc.table(table2, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(5),
                prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                   
                    const { x, y, width, height } = rectCell;
                    doc.font("Helvetica").fontSize(5);
                    console.log("indexRow ->" + indexRow)
                    console.log("indexColumn ->" + indexColumn)
                    if (imageDataArray.length > 0) {
                        if (indexRow == rowsCount) {
                            if (rowsCount <= rowsItems) {
                                const range = doc.bufferedPageRange();
                                if(imageDataArray[rowsCount]=="-"){
                                    rowsCount++
                                      
                                }else{
                                   
                                    doc.image(imageDataArray[rowsCount], x, y);
                                    rowsCount++
                                }
                                
                            }
                        }
                    }
                },
                minRowHeight: 45
            });

        }else{
            let dataCorrente = new Date();
            let stringData = dataCorrente.toLocaleDateString();
            var doc = new PDFDocument({
                bufferPages: true,
                layout: 'landscape',
                
            })
            doc.text("Retail Sales daily report " + stringData)
            doc.text("Nessun Elemento da stampare")
        }
       
        doc.end(); // will trigger the stream to end
        data = doc.read();
        return data.toString("base64")
    })
})