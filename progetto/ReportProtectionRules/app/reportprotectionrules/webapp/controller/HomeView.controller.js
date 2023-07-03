sap.ui.define([
    "./Base.controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Filter,FilterOperator) {
        "use strict";

        return Controller.extend("ReportProtectionRules.reportprotectionrules.controller.HomeView", {
            onInit: function () {
               
              //  var oRouter = this.getOwnerComponent().getRouter();
             //   oRouter.getRoute("RouteHomeView").attachPatternMatched(this._onObjectMatched, this);
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
                this.dateDa = this.byId("dateRange").getDateValue()
                this.dateA = this.byId("dateRange").getSecondDateValue()
                this.byId("helloDialog").close();
               
                let oModel = this.getView().getModel();
                this.getView().byId("LineItemsSmartTablePROTECTIONRULES_HIGHLEVEL").rebindTable(true);
                this.onBeforeRebindTablePROTECTIONRULES_LOWLEVEL()

            },
            onBeforeRebindTablePROTECTIONRULES_HIGHLEVEL: function(oSource){
                var binding = oSource.getParameter("bindingParams");

               
            } ,
            onBeforeRebindTablePROTECTIONRULES_LOWLEVEL:function(oSource){
                 if(this.dateDa!=undefined){
                    var aFilters=[]
                    var oFilter = new sap.ui.model.Filter("VALIDO_DA", sap.ui.model.FilterOperator.GE, this.dateDa);
                    var oFilter2 = new sap.ui.model.Filter("VALIDO_A", sap.ui.model.FilterOperator.LE, this.dateA);
                    aFilters.push(oFilter,oFilter2)
                    
                    this.binding.filters.push(aFilters);
                    
                 }else{
                    this.binding = oSource.getParameter("bindingParams");
                   //this.binding.filters.push(filters);
                 }
                //var binding = oSource.getParameter("bindingParams");
                //console.log(binding);
                
            },
            
            onExportCurrentPROTECTIONRULES_LOWLEVEL: function () {

                this.oBusyDialog = new sap.m.BusyDialog({
                    title: "Export in corso",
                    text: "L'operazione potrebbe richiedere qualche secondo..."
                });
                this.oBusyDialog.open();
                var filters = this.getView().byId("smartFilterPROTECTIONRULES_LOWLEVEL").getFilterData()
                var aFilters = [];
                for (var i in filters) {
                    if (filters[i]) {
                        var aQuery = filters[i].items
                        for (var obj of aQuery) {
                            aFilters.push(new Filter(i, FilterOperator.EQ, obj.key));
                        }
                    }
                }

                
                let oModel = this.getView().getModel();
                oModel.read(`/PROTECTIONRULES_LOWLEVEL`, {
                    filters:aFilters,
                    success: function (data) {
                        oTempModel.setProperty("/PROTECTIONRULES_LOWLEVEL", data.results);
                       this.callAjaxExcel()
                    }.bind(this),
                    error: err => {
                        this.oBusyDialog.close();
                        MessageBox.error(err);
                    }

                });


            },


            callAjaxExcel: async function (){
                let oTempModel = this.getView().getModel("temp");

                let aRowItems = oTempModel.getData().PROTECTIONRULES_LOWLEVEL.map((

                    { ARTICLE_DESCR, ARTICLE_ID, ARTICLE_IMG, BRAND, BRAND_ID, FAMILY, FAMILY_ID, GENDER, ID_REGOLA, PRODUCT_GROUP, QUANTITA_PROTETTA, QUANTITA_STOCK, RETAIL_PRICE, SALES_CHANNEL, SALES_CHANNEL_ID, SEASON, SEASON_YEAR, STORE_POINT, STORE_POINT_ID, VALIDO_A, VALIDO_DA, VALORE_STOCK_PROTETTO, WHOLESALE }
                ) => (
                    { ARTICLE_DESCR, ARTICLE_ID, ARTICLE_IMG, BRAND, BRAND_ID, FAMILY, FAMILY_ID, GENDER, ID_REGOLA, PRODUCT_GROUP, QUANTITA_PROTETTA, QUANTITA_STOCK, RETAIL_PRICE, SALES_CHANNEL, SALES_CHANNEL_ID, SEASON, SEASON_YEAR, STORE_POINT, STORE_POINT_ID, VALIDO_A, VALIDO_DA, VALORE_STOCK_PROTETTO, WHOLESALE }
                ));

                var that = this
                const datasetsByBrand = aRowItems.reduce((result, item) => {
                    const BRAND = item.BRAND;
                    if (!result[BRAND]) {
                        result[BRAND] = [];
                    }
                    result[BRAND].push(item);
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
                    var name = item.lineItems[0].BRAND;
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
                        link.download = "Raggruppamento_brand" + ".zip";
                        link.href = window.URL.createObjectURL(content);
                        link.click();
                      });
                    that.oBusyDialog.close();
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
                           that.oBusyDialog.close();
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

            }

        });
    });
