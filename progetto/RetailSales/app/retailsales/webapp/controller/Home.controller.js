sap.ui.define([
    "./Base.controller",
    "../utils/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, Filter, FilterOperator, MessageBox) {
        "use strict";

        return Controller.extend("modes.com.retailsales.controller.Home", {
            formatter: formatter,
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteHome").attachPatternMatched(this._onObjectMatched, this);
             
            },
            _onObjectMatched: function (oEvent) {
                var oDialog = this.getView().byId("helloDialog");
                oDialog.open();
            },
            closeDialogListRegistrazione: function () {
                if (!this.byId("dateRange").getDateValue()) {
                    MessageBox.information("Inserire una data");
                    return
                }
                var dateDa = this.byId("dateRange").getDateValue()
                var dateA = this.byId("dateRange").getSecondDateValue()
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-dd" });
                var dateFormatLabel = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd-MM-YYYY" });
                var dataDaFormatted = dateFormat.format(dateDa);
                var dataAFormatted = dateFormat.format(dateA);
                this.dataDaFormattedForLabel = dateFormatLabel.format(dateDa);
                this.dataAFormattedForLabel = dateFormatLabel.format(dateA);
                let oTempModel = this.getView().getModel("temp");
                this.byId("labelData").setText("Periodo selezionato: "+this.dataDaFormattedForLabel+" / "+this.dataAFormattedForLabel)
                let oModel = this.getView().getModel();
                sap.ui.core.BusyIndicator.show(0)
                oModel.read(`/RetailSales(InDateFrom=${dataDaFormatted},InDateTo=${dataAFormatted})/Set`, {
                    success: function (data) {
                        this.creatFilter(data.results)
                        oTempModel.setProperty("/RetailSales", data.results);
                        sap.ui.core.BusyIndicator.hide()
                        this.byId("helloDialog").close();
                    }.bind(this),
                    error: err => {
                        console.log(err);
                    }
                });
            },
            openDialogRange: function () {
                var oDialog = this.getView().byId("helloDialog");
                oDialog.open();
            },
            onExportCurrent:  async function  () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Export in corso",
                    text: "L'operazione potrebbe richiedere qualche secondo..."
                });
                // Open the busy dialog
                oBusyDialog.open();
                //console.log(aFilteredDatasetExport);
                //let aDataset = []
                if (!this._oTable) {
                    this._oTable = this.byId('TableRetails');
                }
                let oTable = this._oTable;

                let oRowBinding = oTable.getBinding('items');
                for (var obj of oTable.getBinding().oList) {
                    if (obj["PIECES_SOLD"])
                        obj["PIECES_SOLD"] = obj["PIECES_SOLD"].toString()
                }
                
                let aRowItems =  oTable.getBinding().oList.map((
                    { BRAND, BRAND_ID,BUSINESSPARTNER,BUSINESSPARTNEREMAIL,BUSINESSPARTNERID,DOCUMENTPOSSALESPERSONID,DOCUMENTPOSSALESPERSON,DOCUMENTDATESTRING, COMPANY, COMPANYID,CURRENCY, DISCOUNT_APPLIED, DISCOUNT_PERCENTAGE,DOCUMENTDATE, DOCUMENTENTRY, DOCUMENTTYPE, FAMILY, FAMILY_ID, GENDER, IMAGE_URL, MATERIAL, MATERIAL_ID, PIECES_SOLD, REFERENCE_MATERIAL, REFERENCE_MATERIAL_ID, RETAIL_FULL_PRICE, SELL_OUT_PRICE, SKU_SEASON, STORE, STOREID, UM_WHOLESALE_PRICE,WHOLESALE_PRICE }
                ) => (
                    { BRAND, BRAND_ID,BUSINESSPARTNER,BUSINESSPARTNEREMAIL,BUSINESSPARTNERID,DOCUMENTPOSSALESPERSONID,DOCUMENTPOSSALESPERSON,DOCUMENTDATESTRING, COMPANY, COMPANYID,CURRENCY, DISCOUNT_APPLIED, DISCOUNT_PERCENTAGE,DOCUMENTDATE, DOCUMENTENTRY, DOCUMENTTYPE, FAMILY, FAMILY_ID, GENDER, IMAGE_URL, MATERIAL, MATERIAL_ID, PIECES_SOLD, REFERENCE_MATERIAL, REFERENCE_MATERIAL_ID, RETAIL_FULL_PRICE, SELL_OUT_PRICE, SKU_SEASON, STORE, STOREID, UM_WHOLESALE_PRICE, WHOLESALE_PRICE }));

                var that = this

                const datasetsByBrand = aRowItems.reduce((result, item) => {
                   /* const data=item.DOCUMENTDATESTRING
                    const datasplit=data.split("-")
                    const MESE=datasplit[1]
                    if (!result[MESE]) {
                        result[MESE] = [];
                    }
                    result[MESE].push(item);
                    return result;*/

                    const COMPANY = item.COMPANY;
                    if (!result[COMPANY]) {
                        result[COMPANY] = [];
                    }
                    result[COMPANY].push(item);
                    return result;
                }, {});

                const arrayOfArrays = Object.values(datasetsByBrand);

                var that = this
                let requestsDone = 0;
                const totalRequests = arrayOfArrays.length;
                console.log(totalRequests);
                var FilesList = [];

                for (const dataset of arrayOfArrays) {
                    const resultFile = await that._onFormatExcel2(dataset,that,requestsDone,totalRequests);
                    if (resultFile.base64 !== '') {
                        FilesList.push(resultFile);
                        requestsDone++;
                    }

                }

                if (requestsDone === totalRequests) {
                    const zip = new JSZip();
                    FilesList.forEach(item => {
                    var base64 = item.base64;
                    var data=item.lineItems[0].COMPANY
                    //var datasplit=data.split("-")
                    //var MESE=datasplit[1]
                    //var ANNO=datasplit[2]
                    var name = data
                    //name = name.replace("/", "-");
            
                    let type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    let testBlob = that.b64toBlob(base64, type)
                    zip.file(name + '.xlsx', testBlob);
                    that.getView().getModel("temp").setProperty("/OK", 0);
                    
                    });
                    zip.generateAsync({type:"blob"})
                      .then(function(content) {
                        // Crea un link di download
                        const link = document.createElement('a');
                        link.download = "Raggruppamento_Company" + ".zip";
                        link.href = window.URL.createObjectURL(content);
                        link.click();
                      });
                    oBusyDialog.close();
                }

            },
            
            _onFormatExcel2: function (dataset,that,requestsDone,totalRequests) {
                return new Promise( (resolve, reject) => {

                    $.ajax({
                        url: that.getView().getModel("exportService").sServiceUrl + "/format_excel",
                        type: "POST",
                        data: JSON.stringify({ lineItems: dataset }),
                        contentType: "application/json; charset=utf-8",
                        responseType: "text",
                        success: function (data) {
                            var result= {result: "ok", base64:data.d.format_excel, lineItems: dataset};
                            
                            resolve (result);
                        },
                        error: function (xhr, status, error) {
                            var result= {result: "ko", lineItems: dataset};
                            requestsDone++;

                        if (requestsDone === totalRequests) {
                            oBusyDialog.close();
                        }
                            reject(result);
                        }
                    });

                });
               
            },
            //Converte la response dell'ajax in blob in modo da poterla scaricare
            b64toBlob: function (b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            },
            
            onSearch: function (oEvent) {

                var dateDa = this.byId("dateRange").getDateValue()
                var that = this;
                let oTempModel = this.getView().getModel("temp");
                var dateA = this.byId("dateRange").getSecondDateValue()
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-dd" });
                var dataDaFormatted = dateFormat.format(dateDa);
                var dataAFormatted = dateFormat.format(dateA);
                var filtriCompany = this.byId("multiCompany").getSelectedKeys();
                var filtriDocumentType = this.byId("multiDocumenttype").getSelectedKeys();
                var filtriMultiRetailSales = this.byId("multiRetailSales").getSelectedKeys();
                var filtriMultiReferenceMaterial = this.byId("multiReferenceMaterial").getSelectedKeys();
                var filtriMultiMaterial = this.byId("multiMaterial").getSelectedKeys();
                var filtriMultiBrand = this.byId("multiBrand").getSelectedKeys();
                var filtriMultiGender = this.byId("multiGender").getSelectedKeys();
                var filtriMultiFamily = this.byId("multiFamily").getSelectedKeys();
                var filtriMultiSeason = this.byId("multiSeason").getSelectedKeys();
                var filtriMultiClient = this.byId("multiClient").getSelectedKeys();
                var filtriMultiPartner = this.byId("multiPartner").getSelectedKeys();
                var filtriMultiReceiptNumber=this.byId("multiReceiptNumber").getSelectedKeys();
                
                var aFilters = [];
                if (filtriCompany.length > 0) {
                    for (var i = 0; i < filtriCompany.length; i++) {
                        aFilters.push(new Filter("COMPANY", FilterOperator.EQ, filtriCompany[i]));
                    }
                }
                if (filtriDocumentType.length > 0) {
                    for (var i = 0; i < filtriDocumentType.length; i++) {
                        aFilters.push(new Filter("DOCUMENTTYPE", FilterOperator.EQ, filtriDocumentType[i]));
                    }
                }
                if (filtriMultiRetailSales.length > 0) {
                    for (var i = 0; i < filtriMultiRetailSales.length; i++) {
                        aFilters.push(new Filter("STOREID", FilterOperator.EQ, filtriMultiRetailSales[i]));
                    }
                }
                if (filtriMultiReferenceMaterial.length > 0) {
                    for (var i = 0; i < filtriMultiReferenceMaterial.length; i++) {
                        aFilters.push(new Filter("REFERENCE_MATERIAL_ID", FilterOperator.EQ, filtriMultiReferenceMaterial[i]));
                    }
                }
                if (filtriMultiBrand.length > 0) {
                    for (var i = 0; i < filtriMultiBrand.length; i++) {
                        aFilters.push(new Filter("BRAND", FilterOperator.EQ, filtriMultiBrand[i]));
                    }
                }
                if (filtriMultiGender.length > 0) {
                    for (var i = 0; i < filtriMultiGender.length; i++) {
                        aFilters.push(new Filter("GENDER", FilterOperator.EQ, filtriMultiGender[i]));
                    }
                }
                if (filtriMultiFamily.length > 0) {
                    for (var i = 0; i < filtriMultiFamily.length; i++) {
                        aFilters.push(new Filter("FAMILY", FilterOperator.EQ, filtriMultiFamily[i]));
                    }
                }
                if (filtriMultiSeason.length > 0) {
                    for (var i = 0; i < filtriMultiSeason.length; i++) {
                        aFilters.push(new Filter("SEASON", FilterOperator.EQ, filtriMultiSeason[i]));
                    }
                }
                if (filtriMultiMaterial.length > 0) {
                    for (var i = 0; i < filtriMultiMaterial.length; i++) {
                        aFilters.push(new Filter("MATERIAL_ID", FilterOperator.EQ, filtriMultiMaterial[i]));
                    }
                }
                if (filtriMultiClient.length > 0) {
                    for (var i = 0; i < filtriMultiClient.length; i++) {
                        aFilters.push(new Filter("DOCUMENTPOSSALESPERSONID", FilterOperator.EQ, filtriMultiClient[i]));
                    }
                }
                if (filtriMultiPartner.length > 0) {
                    for (var i = 0; i < filtriMultiPartner.length; i++) {
                        aFilters.push(new Filter("BUSINESSPARTNERID", FilterOperator.EQ, filtriMultiPartner[i]));
                    }
                }
                if (filtriMultiReceiptNumber.length > 0) {
                    for (var i = 0; i < filtriMultiReceiptNumber.length; i++) {
                        aFilters.push(new Filter("DOCUMENTENTRY", FilterOperator.EQ, filtriMultiReceiptNumber[i]));
                    }
                }
                let oModel = this.getView().getModel();
                sap.ui.core.BusyIndicator.show(0)
                oModel.read(`/RetailSales(InDateFrom=${dataDaFormatted},InDateTo=${dataAFormatted})/Set`, {
                    filters: aFilters,
                    success: function (oData) {
                        oTempModel.setProperty("/RetailSales", oData.results);
                        this.creatFilter(oData.results)
                        this.sommaSELL_OUT_PRICE=0;
                        this.sommaRETAIL_FULL_PRICE=0;
                        this.sommaPIECES_SOLD=0;
                        if (oData.results.length > 0) {
                            for (var i = 0; i < oData.results.length; i++) {
                               
                                if(oData.results[i].SELL_OUT_PRICE != "" && oData.results[i].SELL_OUT_PRICE != null){
                                    this.sommaSELL_OUT_PRICE=this.sommaSELL_OUT_PRICE+parseInt(oData.results[i].SELL_OUT_PRICE)
                                }
                                if(oData.results[i].RETAIL_FULL_PRICE != "" && oData.results[i].RETAIL_FULL_PRICE != null){
                                    this.sommaRETAIL_FULL_PRICE=this.sommaRETAIL_FULL_PRICE+parseInt(oData.results[i].RETAIL_FULL_PRICE)
                                }
                                if(oData.results[i].PIECES_SOLD != "" && oData.results[i].PIECES_SOLD != null){
                                    this.sommaPIECES_SOLD=this.sommaPIECES_SOLD+parseInt(oData.results[i].PIECES_SOLD)
                                } 
                            }
                            this.byId("labelSommaPIECES_SOLD").setText("Somma Pieces Sold = "+this.sommaPIECES_SOLD+" PZ ")
                            this.byId("labelSommaRETAIL_FULL_PRICE").setText("Somma Retail Full Price = "+this.sommaRETAIL_FULL_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" €")
                            this.byId("labelSommaSELL_OUT_PRICE").setText("Somma Sell Out Price ="+this.sommaSELL_OUT_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" €")
                            this.labelSommaPIECES_SOLDPDF="Somma Pieces Sold = "+this.sommaPIECES_SOLD+" PZ "
                            this.labelSommaRETAIL_FULL_PRICE="Somma Retail Full Price = "+this.sommaRETAIL_FULL_PRICE+" €"
                            this.labelSommaSELL_OUT_PRICE="Somma Sell Out Price ="+this.sommaSELL_OUT_PRICE+" €"
                }
                        sap.ui.core.BusyIndicator.hide()
                    }.bind(that),
                    error: function (oResponse) {

                    }
                });
                
            },
            creatFilter: function (data) {
                this.sommaSELL_OUT_PRICE=0;
                let oTempModel = this.getView().getModel("temp");
                oTempModel.setSizeLimit(1000)
                var company = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].COMPANY != "" && data[i].COMPANY != null){
                            company.push(data[i].COMPANY)
                        }
                    }
                }
                if (company.length > 0) {
                    var companyUniq = [...new Set(company)];
                    var locations = [];
                    for (var i = 0; i < companyUniq.length; i++) {
                        locations.push({
                            COMPANY: companyUniq[i],
                        });
                    }
                   
                    oTempModel.setProperty("/FilterCompanyUniq", locations);
                }
                var documentType = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].DOCUMENTTYPE != "" && data[i].DOCUMENTTYPE != null)
                            documentType.push(data[i].DOCUMENTTYPE)
                    }
                }
                if (documentType.length > 0) {
                    var documentTypeUniq = [...new Set(documentType)];
                    var locations = [];
                    for (var i = 0; i < documentTypeUniq.length; i++) {
                        locations.push({
                            DOCUMENTTYPE: documentTypeUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterDocumentTypeUniq", locations);
                }
                var store = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].STOREID != "" && data[i].STOREID != null)
                        store.push(data[i].STOREID+" - "+ data[i].STORE)
                    }
                }
                if (store.length > 0) {
                    var storeidUniq = [...new Set(store)];
                    var locations = [];
                    for (var i = 0; i < storeidUniq.length; i++) {
                        var storeSplit = storeidUniq[i].split(" - ")
                        locations.push({
                            STOREID: storeSplit[0],
                            STORE:storeSplit[1]
                        });
                    }
                    oTempModel.setProperty("/FilterStoreidUniq", locations);
                }
                var referenceMaterial = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].REFERENCE_MATERIAL_ID != "" && data[i].REFERENCE_MATERIAL_ID != null)
                            referenceMaterial.push(data[i].REFERENCE_MATERIAL_ID + " - " + data[i].REFERENCE_MATERIAL)
                    }
                }
                if (referenceMaterial.length > 0) {
                    var referenceMaterialUniq = [...new Set(referenceMaterial)];
                    var locations = [];
                    for (var i = 0; i < referenceMaterialUniq.length; i++) {
                        var referenceMaterial = referenceMaterialUniq[i].split(" - ")
                        locations.push({
                            REFERENCE_MATERIAL_ID: referenceMaterial[0],
                            REFERENCE_MATERIAL: referenceMaterial[1]
                        });
                    }
                    oTempModel.setProperty("/FilterReferenceMaterialUniq", locations);
                }

                var material = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].MATERIAL_ID != "" && data[i].MATERIAL_ID != null)
                            material.push(data[i].MATERIAL_ID + " - " + data[i].MATERIAL)
                    }
                }
                if (material.length > 0) {
                    var materialUniq = [...new Set(material)];
                    var locations = [];
                    for (var i = 0; i < materialUniq.length; i++) {
                        var material = materialUniq[i].split(" - ")
                        locations.push({
                            MATERIAL_ID: material[0],
                            MATERIAL: material[1]
                        });
                    }
                    oTempModel.setProperty("/FilterMaterialUniq", locations);
                }
                var client = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].DOCUMENTPOSSALESPERSONID != "" && data[i].DOCUMENTPOSSALESPERSONID != null)
                        client.push(data[i].DOCUMENTPOSSALESPERSONID + " - " + data[i].DOCUMENTPOSSALESPERSON)
                    }
                }
                if (client.length > 0) {
                    var clientUniq = [...new Set(client)];
                    var locations = [];
                    for (var i = 0; i < clientUniq.length; i++) {
                        var client = clientUniq[i].split(" - ")
                        locations.push({
                            DOCUMENTPOSSALESPERSONID: client[0],
                            DOCUMENTPOSSALESPERSON: client[1]
                        });
                    }
                    oTempModel.setProperty("/FilterClientlUniq", locations);
                }

                var partner = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].BUSINESSPARTNERID != "" && data[i].BUSINESSPARTNERID != null)
                        partner.push(data[i].BUSINESSPARTNERID + " - " + data[i].BUSINESSPARTNER)
                    }
                }
                if (partner.length > 0) {
                    var partnerUniq = [...new Set(partner)];
                    var locations = [];
                    for (var i = 0; i < partnerUniq.length; i++) {
                        var partner = partnerUniq[i].split(" - ")
                        locations.push({
                            BUSINESSPARTNERID: partner[0],
                            BUSINESSPARTNER: partner[1]
                        });
                    }
                    oTempModel.setProperty("/FilterPartnerlUniq", locations);
                }
                var brand = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].BRAND != "" && data[i].BRAND != null)
                            brand.push(data[i].BRAND)
                    }
                }
                if (brand.length > 0) {
                    var brandUniq = [...new Set(brand)];
                    var locations = [];
                    var brandForOrder=[]
                    for (var i = 0; i < brandUniq.length; i++) {
                        brandForOrder.push(brandUniq[i])
                       
                    }
                    brandForOrder.sort()
                    for (var i = 0; i < brandForOrder.length; i++) {
                       
                        locations.push({
                            BRAND: brandForOrder[i],
                        })
                    }
                    oTempModel.setProperty("/FilterBrandUniq", locations);
                }
                var gender = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].GENDER != "" && data[i].GENDER != null)
                            gender.push(data[i].GENDER)
                    }
                }
                if (gender.length > 0) {
                    var genderUniq = [...new Set(gender)];
                    var locations = [];
                    for (var i = 0; i < genderUniq.length; i++) {
                        locations.push({
                            GENDER: genderUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterGenderUniq", locations);
                }
                var family = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].FAMILY != "" && data[i].FAMILY != null)
                            family.push(data[i].FAMILY)
                    }
                }
                if (family.length > 0) {
                    var familyUniq = [...new Set(family)];
                    var locations = [];
                    for (var i = 0; i < familyUniq.length; i++) {
                        locations.push({
                            FAMILY: familyUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterFamilyUniq", locations);
                }
                var receiptNumber = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].DOCUMENTENTRY != "" && data[i].DOCUMENTENTRY != null)
                        receiptNumber.push(data[i].DOCUMENTENTRY)
                    }
                }
                if (receiptNumber.length > 0) {
                    var receiptNumberUniq = [...new Set(receiptNumber)];
                    var locations = [];
                    for (var i = 0; i < receiptNumberUniq.length; i++) {
                        locations.push({
                            DOCUMENTENTRY: receiptNumberUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterReceiptNumberUniq", locations);
                }
                this.sommaSELL_OUT_PRICE=0;
                this.sommaRETAIL_FULL_PRICE=0;
                this.sommaPIECES_SOLD=0;
                var season = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].SKU_SEASON != "" && data[i].SKU_SEASON != null){
                            season.push(data[i].SKU_SEASON)
                        }
                          if(data[i].SELL_OUT_PRICE != "" && data[i].SELL_OUT_PRICE != null){
                            this.sommaSELL_OUT_PRICE=this.sommaSELL_OUT_PRICE+parseInt(data[i].SELL_OUT_PRICE)
                          }
                          if(data[i].RETAIL_FULL_PRICE != "" && data[i].RETAIL_FULL_PRICE != null){
                            this.sommaRETAIL_FULL_PRICE=this.sommaRETAIL_FULL_PRICE+parseInt(data[i].RETAIL_FULL_PRICE)
                          }
                          if(data[i].PIECES_SOLD != "" && data[i].PIECES_SOLD != null){
                            this.sommaPIECES_SOLD=this.sommaPIECES_SOLD+parseInt(data[i].PIECES_SOLD)
                          } 
                    }
                }
                if (season.length > 0) {
                    var seasonUniq = [...new Set(season)];
                    var locations = [];
                    for (var i = 0; i < seasonUniq.length; i++) {
                        locations.push({
                            SKU_SEASON: seasonUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterSeasonUniq", locations);
                }
                this.byId("labelSommaPIECES_SOLD").setText("Somma Pieces Sold = "+this.sommaPIECES_SOLD+" PZ ")
                this.byId("labelSommaRETAIL_FULL_PRICE").setText("Somma Retail Full Price = "+this.sommaRETAIL_FULL_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" €")
                this.byId("labelSommaSELL_OUT_PRICE").setText("Somma Sell Out Price ="+this.sommaSELL_OUT_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" €")
                this.labelSommaPIECES_SOLDPDF="Somma Pieces Sold = "+this.sommaPIECES_SOLD+" PZ "
                this.labelSommaRETAIL_FULL_PRICE="Somma Retail Full Price = "+this.sommaRETAIL_FULL_PRICE+" €"
                this.labelSommaSELL_OUT_PRICE="Somma Sell Out Price ="+this.sommaSELL_OUT_PRICE+" €"
            },
            onExportPDF: function (oEvent) {
                if (!this._oTable) {
                    this._oTable = this.byId('TableRetails');
                }
                let oTable = this._oTable;

                var tabledata = oTable.getBinding().oList;
                //var modelData = this.getView().getModel("genericAlias").getData();
                var fullHtml = "";
                //Calling method....
                var header = this.getHeaderForm(tabledata);
                fullHtml += header;
                //Making student table....
                var headertable1 = "<table border='1' style='height:200px;'>" +
                "<caption style='color:green;font-weight: bold;'> REPORT DEL VENDUTO GIORNALIERO "+ this.dataDaFormattedForLabel+" / "+this.dataAFormattedForLabel+"</caption>" +
                "<caption style='text-align: start;'> Somma Pieces Sold = "+this.sommaPIECES_SOLD+" PZ "+"</caption>" +
                "<caption style='text-align: start;'> Somma Retail Full Price = "+this.sommaRETAIL_FULL_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" €"+"</caption>" +
                "<caption style='text-align: start;'> Somma Sell Out Price ="+this.sommaSELL_OUT_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" €"+"</caption>" +
                "<th style='color:green;font-size: 6px !important'>ORDER DATA</th>" +
                "<th style='color:green;font-size: 6px !important'>STORE</th>"+
                "<th style='color:green;font-size: 6px !important'>RECEIPT NUMBER</th>" +
                "<th style='color:green;font-size: 6px !important'>SEASON</th>" +
                "<th style='color:green;font-size: 6px !important'>BRAND</th>" +
                "<th style='color:green;font-size: 6px !important'>FAMILY</th>" +
                "<th style='color:green;font-size: 6px !important'>GENDER</th>" +
                "<th style='color:green;font-size: 6px !important'>IMAGE</th>" +
                "<th style='color:green;font-size: 6px !important'>SKU CHILDREN</th>" +
                "<th style='color:green;font-size: 6px !important'>PIECES SOLD/RETURN</th>" +
                "<th style='color:green;font-size: 6px !important'>RETAIL FULL PRICE</th>" +
                "<th style='color:green;font-size: 6px !important'>SELL OUT PRICE</th>" +
                "<th style='color:green;font-size: 6px !important'>DISCOUNT APPLIED</th>"+
                "<th style='color:green;font-size: 6px !important'>CUSTOMER</th></tr>";
               
                         //Adding row dynamically to student table....
                for (var i = 0; i < tabledata.length; i++) {
                 headertable1 += "<tr>" +
                 "<td style='font-size: 6px'> " + (tabledata[i].DOCUMENTDATESTRING ? tabledata[i].DOCUMENTDATESTRING: "") + "</td>" +
                 "<td style='font-size: 6px'>  " + ((tabledata[i].STOREID ? tabledata[i].STOREID :"") +"- "+(tabledata[i].STORE ? tabledata[i].STORE:"")) + "  </td>" +
                 "<td style='font-size: 6px'>  " + (tabledata[i].DOCUMENTENTRY ? tabledata[i].DOCUMENTENTRY:"")  + "  </td>" +
                 "<td style='font-size: 6px'> " + (tabledata[i].SKU_SEASON ? tabledata[i].SKU_SEASON:"") + "</td>" +
                 "<td style='font-size: 6px'>  " + (tabledata[i].BRAND ? tabledata[i].BRAND: "")+ "  </td>" +
                 "<td style='font-size: 6px'>  " + (tabledata[i].FAMILY ? tabledata[i].FAMILY:"") + "  </td>" +
                 "<td style='font-size: 6px'>  " + (tabledata[i].GENDER ? tabledata[i].GENDER:"") + "  </td>" +
                 "<td style='font-size: 6px'> <Img src=" + tabledata[i].IMAGE_URL + " style='width='150px' height='120px'/> </td>" +
                 "<td style='font-size: 6px'> " + (tabledata[i].MATERIAL_ID ? tabledata[i].MATERIAL_ID: "") + "</td>" +
                 "<td style='font-size: 6px'>  " + (tabledata[i].PIECES_SOLD ? tabledata[i].PIECES_SOLD: "")  + " PZ </td>" +
                 "<td style='font-size: 6px'>  " + ((tabledata[i].RETAIL_FULL_PRICE ? tabledata[i].RETAIL_FULL_PRICE: "") + " "+(tabledata[i].CURRENCY ? tabledata[i].CURRENCY: "")) +"  </td>" +
                 "<td style='font-size: 6px'>  " + ((tabledata[i].SELL_OUT_PRICE ?  tabledata[i].SELL_OUT_PRICE:"") + " "+(tabledata[i].CURRENCY ? tabledata[i].CURRENCY: ""))  +"  </td>" +
                 "<td style='font-size: 6px'>  " + (tabledata[i].DISCOUNT_PERCENTAGE ? tabledata[i].DISCOUNT_PERCENTAGE:"") + " % </td>" +
                 "<td style='font-size: 6px'>  " + (tabledata[i].BUSINESSPARTNER ? tabledata[i].BUSINESSPARTNER: "") + "  </td>" +
                  "</tr>";
                }
                headertable1 += "<tr>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'> </td>" +
                 "<td style='font-size: 6px'>"+this.sommaPIECES_SOLD+" PZ </td>" +
                 "<td style='font-size: 6px'>"+this.sommaRETAIL_FULL_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" € </td>" +
                 "<td style='font-size: 6px'>"+this.sommaSELL_OUT_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" € </td>" +
                 "<td style='font-size: 6px'></td>" +
                 "<td style='font-size: 6px'> </td>" +
                  "</tr>";
                headertable1 += "</table>";
                fullHtml += headertable1;
                // Making branch table....
                
                   
                
                // window.open(URL, name, specs, replace)

                
              
                var wind = window.open(' ', ' ');
               wind.document.write('<style>@page{size:landscape;}</style>');
                //wind.document.write('</head><body >');
                wind.document.write(fullHtml);
                //wind.document.write('</body></html>');
                setTimeout(function () {
                 wind.print();
                 wind.close();
               }, 10); 
               },
               
               //Returing header data(Called method).... 
               getHeaderForm: function (tabledata) {
                
                   return "<div>" +
                 "<div  style=float:left>" +
                 
                 "</div></div>";
               },
               
            beat : function(){
              
                console.log('beat..');
                
            },
        });
    });