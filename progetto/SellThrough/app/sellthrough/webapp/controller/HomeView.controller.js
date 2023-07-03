sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("SellThrough.sellthrough.controller.HomeView", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteHomeView").attachPatternMatched(this._onObjectMatched, this);

            },
            _onObjectMatched: function (oEvent) {
                let oModel = this.getView().getModel();

                oModel.setSizeLimit(100000)
                var oDialog = this.getView().byId("helloDialog");
                oDialog.open();
            },
            closeDialogListRegistrazione: function () {
                if (!this.byId("multiUniqueSeason").getSelectedItem()) {
                    MessageBox.information("Valorizzare almeno il filtro su stagione OdA e OdV ");
                    return
                }
                this.IP_COMPANY = "";
                this.IP_BRAND_ID = "";
                this.IP_GENDER = "";
                this.IP_SUBGENDER = "";
                this.IP_FAMILY = "";
                this.IP_GRP_MERCI = "";
                this.IP_SEASON_ACQUISTO = "'" + this.byId("multiUniqueSeason").getSelectedItem().getProperty("key") + "'";
                this.IP_SEASON_VENDITA = "";
                this.IP_COLLECTION_VENDITA = "";
                this.IP_COLLECTION_ACQUISTO = "";
                this.IP_DATA_ACQUISTO_DA = "";
                this.IP_DATA_ACQUISTO_A = "";
                this.IP_DATA_VENDITA_DA = "";
                this.IP_DATA_VENDITA_A = "";

                if (this.IP_SEASON_ACQUISTO == "'CARR'" || this.IP_SEASON_ACQUISTO == "'VINT'") {
                    if (!this.byId("dateRangeOda").getDateValue() ||
                        !this.byId("dateRangeOda").getSecondDateValue() ||
                        !this.byId("dateRangeCassa").getDateValue() ||
                        !this.byId("dateRangeCassa").getSecondDateValue()) {
                        MessageBox.information("Valorizzare le date ");
                        return
                    }

                }

                let oTempModel = this.getView().getModel("temp");
                if (!this.byId("multiCompany").getSelectedKeys().length > 0) {
                    this.IP_COMPANY = "'ALL'"
                } else {
                    let key = this.byId("multiCompany").getSelectedKeys()
                    this.IP_COMPANY = "'" + key.toString() + "'"

                }
                if (!this.byId("multiBrand").getSelectedKeys().length > 0) {
                    this.IP_BRAND_ID = "'ALL'"
                } else {
                    let key = this.byId("multiBrand").getSelectedKeys()
                    this.IP_BRAND_ID = "'" + key.toString() + "'"
                }
                if (!this.byId("multiGender").getSelectedKeys().length > 0) {
                    this.IP_GENDER = "'ALL'"
                } else {
                    let key = this.byId("multiGender").getSelectedKeys()
                    this.IP_GENDER = "'" + key.toString() + "'"
                }
                if (!this.byId("multiSubGender").getSelectedKeys().length > 0) {
                    this.IP_SUBGENDER = "'ALL'"
                } else {
                    let key = this.byId("multiSubGender").getSelectedKeys()
                    this.IP_SUBGENDER = "'" + key.toString() + "'"
                }
                if (!this.byId("multiFamily").getSelectedKeys().length > 0) {
                    this.IP_FAMILY = "'ALL'"
                } else {
                    let key = this.byId("multiFamily").getSelectedKeys()
                    this.IP_FAMILY = "'" + key.toString() + "'"
                }
                if (!this.byId("multiGroup").getSelectedKeys().length > 0) {
                    this.IP_GRP_MERCI = "'ALL'"
                } else {
                    let key = this.byId("multiGroup").getSelectedKeys()
                    this.IP_GRP_MERCI = "'" + key.toString() + "'"
                }
                if (!this.byId("multiStagioneUscitaMerci").getSelectedKeys().length > 0) {
                    this.IP_SEASON_VENDITA = "'ALL'"
                } else {
                    let key = this.byId("multiStagioneUscitaMerci").getSelectedKeys()
                    this.IP_SEASON_VENDITA = "'" + key.toString() + "'"
                }
                if (!this.byId("multiCollezioneOdAeOdV").getSelectedKeys().length > 0) {
                    this.IP_COLLECTION_VENDITA = "'ALL'";
                    this.IP_COLLECTION_ACQUISTO = "'ALL'";
                } else {
                    let key = this.byId("multiCollezioneOdAeOdV").getSelectedKeys()
                    this.IP_COLLECTION_VENDITA = "'" + key.toString() + "'"
                    this.IP_COLLECTION_ACQUISTO = "'" + key.toString() + "'"
                }
                if (!this.byId("dateRangeOda").getDateValue()) {
                    this.IP_DATA_ACQUISTO_DA = "'ALL'";
                    this.IP_DATA_ACQUISTO_A = "'ALL'";
                } else {
                    var dateDa = this.byId("dateRangeOda").getDateValue()
                    var dateA = this.byId("dateRangeOda").getSecondDateValue()
                    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                    this.IP_DATA_ACQUISTO_DA = "'" + dateFormat.format(dateDa) + "'";
                    this.IP_DATA_ACQUISTO_A = "'" + dateFormat.format(dateA) + "'";

                }
                if (!this.byId("dateRangeCassa").getDateValue()) {
                    this.IP_DATA_VENDITA_DA = "'ALL'";
                    this.IP_DATA_VENDITA_A = "'ALL'";
                } else {
                    var dateDa = this.byId("dateRangeCassa").getDateValue()
                    var dateA = this.byId("dateRangeCassa").getSecondDateValue()
                    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                    this.IP_DATA_VENDITA_DA = "'" + dateFormat.format(dateDa) + "'";
                    this.IP_DATA_VENDITA_A = "'" + dateFormat.format(dateA) + "'";

                }




                var that = this
                let serviceUrl = that.getView().getModel("V4").sServiceUrl;
                sap.ui.core.BusyIndicator.show(0)
                this.allRecords = [];
                var that = this;




                var url1 = serviceUrl + `/REPORT_SELL_THROUGH(IP_COMPANY=${this.IP_COMPANY},IP_BRAND_ID=${this.IP_BRAND_ID},IP_GENDER=${this.IP_GENDER},IP_SUBGENDER=${this.IP_SUBGENDER},IP_FAMILY=${this.IP_FAMILY},IP_GRP_MERCI=${this.IP_GRP_MERCI},IP_SEASON_ACQUISTO=${this.IP_SEASON_ACQUISTO},IP_COLLECTION_ACQUISTO=${this.IP_COLLECTION_ACQUISTO},IP_SEASON_VENDITA=${this.IP_SEASON_VENDITA},IP_COLLECTION_VENDITA=${this.IP_COLLECTION_VENDITA},IP_DATA_ACQUISTO_DA=${this.IP_DATA_ACQUISTO_DA},IP_DATA_ACQUISTO_A=${this.IP_DATA_ACQUISTO_A},IP_DATA_VENDITA_DA=${this.IP_DATA_VENDITA_DA},IP_DATA_VENDITA_A=${this.IP_DATA_VENDITA_A})/Set`;
                this.loadData(url1, null, "/REPORT_SELL_THROUGH", null, oTempModel);
                var url2 = serviceUrl + `/REPORT_SELL_THROUGH_AGGR(IP_COMPANY=${this.IP_COMPANY},IP_BRAND_ID=${this.IP_BRAND_ID},IP_GENDER=${this.IP_GENDER},IP_SUBGENDER=${this.IP_SUBGENDER},IP_FAMILY=${this.IP_FAMILY},IP_GRP_MERCI=${this.IP_GRP_MERCI},IP_SEASON_ACQUISTO=${this.IP_SEASON_ACQUISTO},IP_COLLECTION_ACQUISTO=${this.IP_COLLECTION_ACQUISTO},IP_SEASON_VENDITA=${this.IP_SEASON_VENDITA},IP_COLLECTION_VENDITA=${this.IP_COLLECTION_VENDITA},IP_DATA_ACQUISTO_DA=${this.IP_DATA_ACQUISTO_DA},IP_DATA_ACQUISTO_A=${this.IP_DATA_ACQUISTO_A},IP_DATA_VENDITA_DA=${this.IP_DATA_VENDITA_DA},IP_DATA_VENDITA_A=${this.IP_DATA_VENDITA_A})/Set`;
                this.loadData(null, url2, null, "/REPORT_SELL_THROUGH_AGGR", oTempModel);

            },

            loadData: function (url1, url2, sProperty1, sProperty2, oTempModel, skip) {
                var url = url1 ? url1 : url2;
                var sProperty = sProperty1 ? sProperty1 : sProperty2;
                skip = skip ? skip : 0;
                //lato cds scarica 50000 records
                var top = 50000;
                var sUrl = url + "?skip=" + skip + "&top=" + top;
                jQuery.ajax({
                    url: sUrl,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    responseType: "text",
                    success: function (response) {
                        // Elabora la risposta ottenuta 
                        // Aggiorna il modello con i dati della risposta
                       var aData=[]
                       var aData=response.value
                        oTempModel.setProperty(sProperty, response.value);
                        if (sProperty === "/REPORT_SELL_THROUGH_AGGR") {
                            this.creatFilterREPORT_SELL_THROUGH_AGGR(aData)
                            this.getView().byId("SommaAggregazioneBrand").setText("RowItems = " + aData.length)
                        } else {
                            this.creatFilter(aData)
                            this.getView().byId("SommaRETAIL_FULL_PRICE").setText("RowItems = " )
                            this.getView().byId("SommaRETAIL_FULL_PRICE").setText("RowItems = " + aData.length)
                        }
                        // Controlla se ci sono altri risultati da ottenere 
                        if (response.value.length === top) {
                            skip += top;
                            this.loadData(url1, url2, sProperty1, sProperty2, oTempModel, skip);
                            // Esegui la chiamata Ajax successiva 
                        } else if (sProperty === "/REPORT_SELL_THROUGH") {
                                this.byId("helloDialog").close();
                                sap.ui.core.BusyIndicator.hide()
                            }
                    }.bind(this),
                    error: function (xhr, status, error) {
                        // Gestisci eventuali errori 

                        MessageBox.error(error)
                        this.byId("helloDialog").close();
                        sap.ui.core.BusyIndicator.hide()
                    }
                });
            },
            creatFilter: function (data) {
                let oTempModel = this.getView().getModel("temp");
                oTempModel.setSizeLimit(1000)
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
                    var brandForOrder = []
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
                var subGender = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].SUBGENDER != "" && data[i].SUBGENDER != null)
                            subGender.push(data[i].SUBGENDER)
                    }
                }
                if (subGender.length > 0) {
                    var subGenderUniq = [...new Set(subGender)];
                    var locations = [];
                    for (var i = 0; i < subGenderUniq.length; i++) {
                        locations.push({
                            SubGender: subGenderUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterSubGenderUniq", locations);
                }
                var family = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].FAMILY_GROUP != "" && data[i].FAMILY_GROUP != null)
                            family.push(data[i].FAMILY_GROUP)
                    }
                }
                if (family.length > 0) {
                    var familyUniq = [...new Set(family)];
                    var locations = [];
                    for (var i = 0; i < familyUniq.length; i++) {
                        locations.push({
                            FAMILY_GROUP: familyUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterFamilyUniq", locations);
                }
                var productGroup = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].PRODUCT_GROUP != "" && data[i].PRODUCT_GROUP != null)
                            productGroup.push(data[i].PRODUCT_GROUP)
                    }
                }
                if (productGroup.length > 0) {
                    var productGroupUniq = [...new Set(productGroup)];
                    var locations = [];
                    for (var i = 0; i < productGroupUniq.length; i++) {
                        locations.push({
                            PRODUCT_GROUP: productGroupUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterProductGroupUniq", locations);
                }
                var skus = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].SKUS != "" && data[i].SKUS != null)
                            skus.push(data[i].SKUS)
                    }
                }
                if (skus.length > 0) {
                    var skusUniq = [...new Set(skus)];
                    var locations = [];
                    for (var i = 0; i < skusUniq.length; i++) {
                        locations.push({
                            SKUS: skusUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterSkusUniq", locations);
                }
                skuDescription
                var skuDescription = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].SKU_DESCRIPTION != "" && data[i].SKU_DESCRIPTION != null)
                            skuDescription.push(data[i].SKU_DESCRIPTION)
                    }
                }
                if (skuDescription.length > 0) {
                    var skuDescriptionUniq = [...new Set(skuDescription)];
                    var locations = [];
                    for (var i = 0; i < skuDescriptionUniq.length; i++) {
                        locations.push({
                            SKU_DESCRIPTION: skuDescriptionUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterSkuDescriptionUniq", locations);
                }

            },


            creatFilterREPORT_SELL_THROUGH_AGGR: function (data) {
                let oTempModel = this.getView().getModel("temp");
                oTempModel.setSizeLimit(1000)
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
                    var brandForOrder = []
                    for (var i = 0; i < brandUniq.length; i++) {
                        brandForOrder.push(brandUniq[i])

                    }
                    brandForOrder.sort()
                    for (var i = 0; i < brandForOrder.length; i++) {

                        locations.push({
                            BRAND: brandForOrder[i],
                        })
                    }
                    oTempModel.setProperty("/FilterBrandUniqREPORT_SELL_THROUGH_AGGR", locations);
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
                    oTempModel.setProperty("/FilterGenderUniqREPORT_SELL_THROUGH_AGGR", locations);
                }
                var family = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].FAMILY_GROUP != "" && data[i].FAMILY_GROUP != null)
                            family.push(data[i].FAMILY_GROUP)
                    }
                }
                if (family.length > 0) {
                    var familyUniq = [...new Set(family)];
                    var locations = [];
                    for (var i = 0; i < familyUniq.length; i++) {
                        locations.push({
                            FAMILY_GROUP: familyUniq[i],
                        });
                    }
                    oTempModel.setProperty("/FilterFamilyUniqREPORT_SELL_THROUGH_AGGR", locations);
                }
            },

            selectionChangeUniqueSeason: function () {
                var valoreStagione = this.getView().byId("multiUniqueSeason").getSelectedItem().getProperty("key")
                var comboMerci = this.getView().byId("multiStagioneUscitaMerci")
                comboMerci.setEnabled(true)
                comboMerci.setSelectedKeys(valoreStagione)
                this.visualizzaFiltri(valoreStagione);

            },
            visualizzaFiltri: function (valoreStagione) {
                if (valoreStagione == "CARR" || valoreStagione == "VINT") {
                    this.byId("labelCompany").setVisible(true)
                    this.byId("multiCompany").setVisible(true)
                    this.byId("labelBrand").setVisible(true)
                    this.byId("multiBrand").setVisible(true)
                    this.byId("labelGender").setVisible(true)
                    this.byId("multiGender").setVisible(true)
                    this.byId("labelSubGender").setVisible(true)
                    this.byId("multiSubGender").setVisible(true)
                    this.byId("labelFamilyGroup").setVisible(true)
                    this.byId("multiFamily").setVisible(true)
                    this.byId("labelProductGroup").setVisible(true)
                    this.byId("multiGroup").setVisible(true)
                    this.byId("labelCollezione").setVisible(true)
                    this.byId("multiCollezioneOdAeOdV").setVisible(true)
                    this.byId("multiCollezioneOdAeOdV").setEnabled(false)
                    this.byId("labelRangeOda").setVisible(true)
                    this.byId("dateRangeOda").setVisible(true)
                    this.byId("labelRangeCassa").setVisible(true)
                    this.byId("dateRangeCassa").setVisible(true)
                } else {
                    this.byId("labelCompany").setVisible(true)
                    this.byId("multiCompany").setVisible(true)
                    this.byId("labelBrand").setVisible(true)
                    this.byId("multiBrand").setVisible(true)
                    this.byId("labelGender").setVisible(true)
                    this.byId("multiGender").setVisible(true)
                    this.byId("labelSubGender").setVisible(true)
                    this.byId("multiSubGender").setVisible(true)
                    this.byId("labelFamilyGroup").setVisible(true)
                    this.byId("multiFamily").setVisible(true)
                    this.byId("labelProductGroup").setVisible(true)
                    this.byId("multiGroup").setVisible(true)
                    this.byId("labelCollezione").setVisible(true)
                    this.byId("multiCollezioneOdAeOdV").setEnabled(true)
                    this.byId("multiCollezioneOdAeOdV").setVisible(true)
                    this.byId("labelRangeOda").setVisible(true)
                    this.byId("dateRangeOda").setVisible(true)
                    this.byId("labelRangeCassa").setVisible(true)
                    this.byId("dateRangeCassa").setVisible(true)
                }

            },

            onSelectionChangeUscitaMerci: function (oEvent) {
                var oMultiComboBox = this.byId("multiStagioneUscitaMerci");
                var aSelectedKeys = oMultiComboBox.getSelectedKeys();

                var sizeSelectedKeys = aSelectedKeys.length
                if (sizeSelectedKeys > 2) {
                    var oSelectedItem = oMultiComboBox.getSelectedItems()[2]
                    aSelectedKeys.pop(oSelectedItem)
                    oMultiComboBox.setSelectedKeys(aSelectedKeys)
                }

            },
            openDialogRange: function () {
                var oDialog = this.getView().byId("helloDialog");
                oDialog.open()
            },
            onSearch: function (oEvent) {

                var filtriBrand = this.byId("multiBrand2").getSelectedKeys();
                var filtriGender = this.byId("multiGender2").getSelectedKeys();
                var filtriSubGender = this.byId("multiSubGender2").getSelectedKeys();
                var filtriFamily2 = this.byId("multiFamily2").getSelectedKeys();
                var filtriPRODUCTGROUP2 = this.byId("multiPRODUCTGROUP2").getSelectedKeys();
                var filtriSKUS = this.byId("multiSKUS").getSelectedKeys();
                var filtriSKUDESCRIPTION = this.byId("multiSKUDESCRIPTION").getSelectedKeys();

                this.aFiltersExcel = [];
                if (filtriBrand.length > 0) {
                    for (var i = 0; i < filtriBrand.length; i++) {
                        this.aFiltersExcel.push(new Filter("BRAND", FilterOperator.EQ, filtriBrand[i]));
                    }
                }
                if (filtriGender.length > 0) {
                    for (var i = 0; i < filtriGender.length; i++) {
                        this.aFiltersExcel.push(new Filter("GENDER", FilterOperator.EQ, filtriGender[i]));
                    }
                }
                if (filtriSubGender.length > 0) {
                    for (var i = 0; i < filtriSubGender.length; i++) {
                        this.aFiltersExcel.push(new Filter("SubGender", FilterOperator.EQ, filtriSubGender[i]));
                    }
                }
                if (filtriFamily2.length > 0) {
                    for (var i = 0; i < filtriFamily2.length; i++) {
                        this.aFiltersExcel.push(new Filter("FAMILY_GROUP", FilterOperator.EQ, filtriFamily2[i]));
                    }
                }
                if (filtriPRODUCTGROUP2.length > 0) {
                    for (var i = 0; i < filtriPRODUCTGROUP2.length; i++) {
                        this.aFiltersExcel.push(new Filter("PRODUCT_GROUP", FilterOperator.EQ, filtriPRODUCTGROUP2[i]));
                    }
                }
                if (filtriSKUS.length > 0) {
                    for (var i = 0; i < filtriSKUS.length; i++) {
                        this.aFiltersExcel.push(new Filter("SKUS", FilterOperator.EQ, filtriSKUS[i]));
                    }
                }
                if (filtriSKUDESCRIPTION.length > 0) {
                    for (var i = 0; i < filtriSKUDESCRIPTION.length; i++) {
                        this.aFiltersExcel.push(new Filter("SKU_DESCRIPTION", FilterOperator.EQ, filtriSKUDESCRIPTION[i]));
                    }
                }

               

                this.getView().byId("TableRetails").getBinding().filter(this.aFiltersExcel)
                let oTableBinding=this.getView().byId("TableRetails").getBinding()
                let listPiena=oTableBinding.oList
                let indici=oTableBinding.aIndices
                var arrayExcel=[]
                indici.forEach(x=>arrayExcel.push((listPiena[x])))
                this.getView().byId("SommaRETAIL_FULL_PRICE").setText("RowItems = " + arrayExcel.length)

            },
            onSearchAggregazioneBrand: function (oEvent) {

                var filtriBrand = this.byId("multiBrand3").getSelectedKeys();
                var filtriGender = this.byId("multiGender3").getSelectedKeys();
                var filtriFamily2 = this.byId("multiFamily3").getSelectedKeys();
                this.aFiltersAggregati = [];
                if (filtriBrand.length > 0) {
                    for (var i = 0; i < filtriBrand.length; i++) {
                        this.aFiltersAggregati.push(new Filter("BRAND", FilterOperator.EQ, filtriBrand[i]));
                    }
                }
                if (filtriGender.length > 0) {
                    for (var i = 0; i < filtriGender.length; i++) {
                        this.aFiltersAggregati.push(new Filter("GENDER", FilterOperator.EQ, filtriGender[i]));
                    }
                }

                if (filtriFamily2.length > 0) {
                    for (var i = 0; i < filtriFamily2.length; i++) {
                        this.aFiltersAggregati.push(new Filter("FAMILY_GROUP", FilterOperator.EQ, filtriFamily2[i]));
                    }
                }


                this.getView().byId("TableAggregazioneBrand").getBinding().filter(this.aFiltersAggregati)
                let oTableBinding=this.getView().byId("TableAggregazioneBrand").getBinding()
                let listPiena=oTableBinding.oList
                let indici=oTableBinding.aIndices
                var arrayExcel=[]
                indici.forEach(x=>arrayExcel.push((listPiena[x])))
                this.getView().byId("SommaAggregazioneBrand").setText("RowItems = " + arrayExcel.length)
            },
            
            
            
            onExportCurrent: async function () {
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
                let oTableBinding=this.getView().byId("TableRetails").getBinding()
                let listPiena=oTableBinding.oList
                let indici=oTableBinding.aIndices
                var arrayExcel=[]
                indici.forEach(x=>arrayExcel.push((listPiena[x])))
                var aRowItems = arrayExcel.map((
                    { SEASON_ACQUISTO, SEASON_VENDITA_S1, SEASON_VENDITA_S2, BRAND, GENDER, SUBGENDER, FAMILY_GROUP, PRODUCT_GROUP, SKUS, SKU_DESCRIPTION, IMAGE_URL, VALUE_ORDERED_WHOLESALE_UN, VALUTA_VALUE_ORDERED_WHOLESALE_UN, TOT_QTY_ORDERED, QTY_ORDERED_WHOLESALE, CC_TOT_VALUE_ORDERED, CC_QTY_ORDERED_NO_WHOLESALE, CC_VALUE_ORDERED_WHOLESALE, CC_VALUE_ORDERED_NO_WHOLESALE, TOT_QTY_RECEIVED, CC_TOT_VALUE_RECEIVED, QTY_RECEIVED_WHOLESALE, CC_VALUE_RECEIVED_WHOLESALE, CC_QTY_RECEIVED_NO_WHOLESALE, CC_VALUE_RECEIVED_NO_WHOLESALE, QTY_UM_WHOLESALE, CC_VALUE_UM_WHOLESALE, QTY_UM_FARFETCH_S1, CC_VALUE_UM_FARFETCH_S1, QTY_UM_MODES_COM_S1, CC_VALUE_UM_MODES_COM_S1, QTY_UM_CONCIERGE_S1, CC_VALUE_UM_CONCIERGE_S1, QTY_UM_MARKETPLACE_S1, CC_VALUE_UM_MARKETPLACE_S1, QTY_UM_LISTE_S1, CC_VALUE_UM_LISTE_S1, QTY_UM_RETAIL_S1, CC_VALUE_UM_RETAIL_S1, QTY_UM_FARFETCH_S2, CC_VALUE_UM_FARFETCH_S2, QTY_UM_MODES_COM_S2, CC_VALUE_UM_MODES_COM_S2, QTY_UM_CONCIERGE_S2, CC_VALUE_UM_CONCIERGE_S2, QTY_UM_MARKETPLACE_S2, CC_VALUE_UM_MARKETPLACE_S2, QTY_UM_LISTE_S2, CC_VALUE_UM_LISTE_S2, QTY_UM_RETAIL_S2, CC_VALUE_UM_RETAIL_S2, CC_TOT_QTY_UM_S1, CC_TOT_QTY_UM_S2, CC_TOT_QTY_UM, CC_TOT_VALUE_UM_S1, CC_TOT_VALUE_UM_S2, CC_TOT_VALUE_UM, CC_SELLTHROUGH_QTY_ORDERED_WH, CC_SELLTHROUGH_QTY_RECEIVED_WH, CC_SELLTHROUGH_VALUE_ORDERED_WH, CC_SELLTHROUGH_VALUE_RECEIVED_WH, CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S1, CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S1, CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S1, CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S1, CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S2, CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S2, CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S2, CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S2 }
                ) => (
                    { SEASON_ACQUISTO, SEASON_VENDITA_S1, SEASON_VENDITA_S2, BRAND, GENDER, SUBGENDER, FAMILY_GROUP, PRODUCT_GROUP, SKUS, SKU_DESCRIPTION, IMAGE_URL, VALUE_ORDERED_WHOLESALE_UN, VALUTA_VALUE_ORDERED_WHOLESALE_UN, TOT_QTY_ORDERED, QTY_ORDERED_WHOLESALE, CC_TOT_VALUE_ORDERED, CC_QTY_ORDERED_NO_WHOLESALE, CC_VALUE_ORDERED_WHOLESALE, CC_VALUE_ORDERED_NO_WHOLESALE, TOT_QTY_RECEIVED, CC_TOT_VALUE_RECEIVED, QTY_RECEIVED_WHOLESALE, CC_VALUE_RECEIVED_WHOLESALE, CC_QTY_RECEIVED_NO_WHOLESALE, CC_VALUE_RECEIVED_NO_WHOLESALE, QTY_UM_WHOLESALE, CC_VALUE_UM_WHOLESALE, QTY_UM_FARFETCH_S1, CC_VALUE_UM_FARFETCH_S1, QTY_UM_MODES_COM_S1, CC_VALUE_UM_MODES_COM_S1, QTY_UM_CONCIERGE_S1, CC_VALUE_UM_CONCIERGE_S1, QTY_UM_MARKETPLACE_S1, CC_VALUE_UM_MARKETPLACE_S1, QTY_UM_LISTE_S1, CC_VALUE_UM_LISTE_S1, QTY_UM_RETAIL_S1, CC_VALUE_UM_RETAIL_S1, QTY_UM_FARFETCH_S2, CC_VALUE_UM_FARFETCH_S2, QTY_UM_MODES_COM_S2, CC_VALUE_UM_MODES_COM_S2, QTY_UM_CONCIERGE_S2, CC_VALUE_UM_CONCIERGE_S2, QTY_UM_MARKETPLACE_S2, CC_VALUE_UM_MARKETPLACE_S2, QTY_UM_LISTE_S2, CC_VALUE_UM_LISTE_S2, QTY_UM_RETAIL_S2, CC_VALUE_UM_RETAIL_S2, CC_TOT_QTY_UM_S1, CC_TOT_QTY_UM_S2, CC_TOT_QTY_UM, CC_TOT_VALUE_UM_S1, CC_TOT_VALUE_UM_S2, CC_TOT_VALUE_UM, CC_SELLTHROUGH_QTY_ORDERED_WH, CC_SELLTHROUGH_QTY_RECEIVED_WH, CC_SELLTHROUGH_VALUE_ORDERED_WH, CC_SELLTHROUGH_VALUE_RECEIVED_WH, CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S1, CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S1, CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S1, CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S1, CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S2, CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S2, CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S2, CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S2 }
                ));

            



                var that = this

                const datasetsBySEASON_ACQUISTO = aRowItems.reduce((result, item) => {
                    /* const data=item.DOCUMENTDATESTRING
                     const datasplit=data.split("-")
                     const MESE=datasplit[1]
                     if (!result[MESE]) {
                         result[MESE] = [];
                     }
                     result[MESE].push(item);
                     return result;*/

                    const BRAND = item.BRAND;
                    if (!result[BRAND]) {
                        result[BRAND] = [];
                    }
                    result[BRAND].push(item);
                    return result;
                }, {});

                const arrayOfArrays = Object.values(datasetsBySEASON_ACQUISTO);

                var that = this
                let requestsDone = 0;
                const totalRequests = arrayOfArrays.length;
                console.log(totalRequests);
                var FilesList = [];

                for (const dataset of arrayOfArrays) {
                    const resultFile = await that._onFormatExcel2(dataset, that, requestsDone, totalRequests);
                    if (resultFile.base64 !== '') {
                        FilesList.push(resultFile);
                        requestsDone++;
                    }

                }

                if (requestsDone === totalRequests) {
                    const zip = new JSZip();
                    FilesList.forEach(item => {
                        var base64 = item.base64;
                        var data = item.lineItems[0].BRAND
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
                    zip.generateAsync({ type: "blob" })
                        .then(function (content) {
                            // Crea un link di download
                            const link = document.createElement('a');
                            link.download = "SELL-TRHOUHG-DETTAGLIO-SKU" + ".zip";
                            link.href = window.URL.createObjectURL(content);
                            link.click();
                        });
                    oBusyDialog.close();
                }

            },


            onExportAggregazioneBrand: async function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Export in corso",
                    text: "L'operazione potrebbe richiedere qualche secondo..."
                });
                // Open the busy dialog
                oBusyDialog.open();
                //console.log(aFilteredDatasetExport);
                //let aDataset = []
                if (!this._oTable) {
                    this._oTable = this.byId('TableAggregazioneBrand');
                }
                let oTable = this._oTable;
                let oTableBinding=this.getView().byId("TableAggregazioneBrand").getBinding()
                let listPiena=oTableBinding.oList
                let indici=oTableBinding.aIndices
                var arrayExcel=[]
                indici.forEach(x=>arrayExcel.push((listPiena[x])))
                var aRowItems = arrayExcel.map((
                    { SEASON_ACQUISTO, SEASON_VENDITA_S1, SEASON_VENDITA_S2, BRAND, GENDER, SUBGENDER, FAMILY_GROUP, PRODUCT_GROUP, SKUS, SKU_DESCRIPTION, IMAGE_URL, VALUE_ORDERED_WHOLESALE_UN, VALUTA_VALUE_ORDERED_WHOLESALE_UN, TOT_QTY_ORDERED, QTY_ORDERED_WHOLESALE, CC_TOT_VALUE_ORDERED, CC_QTY_ORDERED_NO_WHOLESALE, CC_VALUE_ORDERED_WHOLESALE, CC_VALUE_ORDERED_NO_WHOLESALE, TOT_QTY_RECEIVED, CC_TOT_VALUE_RECEIVED, QTY_RECEIVED_WHOLESALE, CC_VALUE_RECEIVED_WHOLESALE, CC_QTY_RECEIVED_NO_WHOLESALE, CC_VALUE_RECEIVED_NO_WHOLESALE, QTY_UM_WHOLESALE, CC_VALUE_UM_WHOLESALE, QTY_UM_FARFETCH_S1, CC_VALUE_UM_FARFETCH_S1, QTY_UM_MODES_COM_S1, CC_VALUE_UM_MODES_COM_S1, QTY_UM_CONCIERGE_S1, CC_VALUE_UM_CONCIERGE_S1, QTY_UM_MARKETPLACE_S1, CC_VALUE_UM_MARKETPLACE_S1, QTY_UM_LISTE_S1, CC_VALUE_UM_LISTE_S1, QTY_UM_RETAIL_S1, CC_VALUE_UM_RETAIL_S1, QTY_UM_FARFETCH_S2, CC_VALUE_UM_FARFETCH_S2, QTY_UM_MODES_COM_S2, CC_VALUE_UM_MODES_COM_S2, QTY_UM_CONCIERGE_S2, CC_VALUE_UM_CONCIERGE_S2, QTY_UM_MARKETPLACE_S2, CC_VALUE_UM_MARKETPLACE_S2, QTY_UM_LISTE_S2, CC_VALUE_UM_LISTE_S2, QTY_UM_RETAIL_S2, CC_VALUE_UM_RETAIL_S2, CC_TOT_QTY_UM_S1, CC_TOT_QTY_UM_S2, CC_TOT_QTY_UM, CC_TOT_VALUE_UM_S1, CC_TOT_VALUE_UM_S2, CC_TOT_VALUE_UM, CC_SELLTHROUGH_QTY_ORDERED_WH, CC_SELLTHROUGH_QTY_RECEIVED_WH, CC_SELLTHROUGH_VALUE_ORDERED_WH, CC_SELLTHROUGH_VALUE_RECEIVED_WH, CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S1, CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S1, CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S1, CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S1, CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S2, CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S2, CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S2, CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S2 }
                ) => (
                    { SEASON_ACQUISTO, SEASON_VENDITA_S1, SEASON_VENDITA_S2, BRAND, GENDER, SUBGENDER, FAMILY_GROUP, PRODUCT_GROUP, SKUS, SKU_DESCRIPTION, IMAGE_URL, VALUE_ORDERED_WHOLESALE_UN, VALUTA_VALUE_ORDERED_WHOLESALE_UN, TOT_QTY_ORDERED, QTY_ORDERED_WHOLESALE, CC_TOT_VALUE_ORDERED, CC_QTY_ORDERED_NO_WHOLESALE, CC_VALUE_ORDERED_WHOLESALE, CC_VALUE_ORDERED_NO_WHOLESALE, TOT_QTY_RECEIVED, CC_TOT_VALUE_RECEIVED, QTY_RECEIVED_WHOLESALE, CC_VALUE_RECEIVED_WHOLESALE, CC_QTY_RECEIVED_NO_WHOLESALE, CC_VALUE_RECEIVED_NO_WHOLESALE, QTY_UM_WHOLESALE, CC_VALUE_UM_WHOLESALE, QTY_UM_FARFETCH_S1, CC_VALUE_UM_FARFETCH_S1, QTY_UM_MODES_COM_S1, CC_VALUE_UM_MODES_COM_S1, QTY_UM_CONCIERGE_S1, CC_VALUE_UM_CONCIERGE_S1, QTY_UM_MARKETPLACE_S1, CC_VALUE_UM_MARKETPLACE_S1, QTY_UM_LISTE_S1, CC_VALUE_UM_LISTE_S1, QTY_UM_RETAIL_S1, CC_VALUE_UM_RETAIL_S1, QTY_UM_FARFETCH_S2, CC_VALUE_UM_FARFETCH_S2, QTY_UM_MODES_COM_S2, CC_VALUE_UM_MODES_COM_S2, QTY_UM_CONCIERGE_S2, CC_VALUE_UM_CONCIERGE_S2, QTY_UM_MARKETPLACE_S2, CC_VALUE_UM_MARKETPLACE_S2, QTY_UM_LISTE_S2, CC_VALUE_UM_LISTE_S2, QTY_UM_RETAIL_S2, CC_VALUE_UM_RETAIL_S2, CC_TOT_QTY_UM_S1, CC_TOT_QTY_UM_S2, CC_TOT_QTY_UM, CC_TOT_VALUE_UM_S1, CC_TOT_VALUE_UM_S2, CC_TOT_VALUE_UM, CC_SELLTHROUGH_QTY_ORDERED_WH, CC_SELLTHROUGH_QTY_RECEIVED_WH, CC_SELLTHROUGH_VALUE_ORDERED_WH, CC_SELLTHROUGH_VALUE_RECEIVED_WH, CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S1, CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S1, CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S1, CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S1, CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S2, CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S2, CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S2, CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S2 }
                ));
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

                    const SEASON_ACQUISTO = item.SEASON_ACQUISTO;
                    if (!result[SEASON_ACQUISTO]) {
                        result[SEASON_ACQUISTO] = [];
                    }
                    result[SEASON_ACQUISTO].push(item);
                    return result;
                }, {});

                const arrayOfArrays = Object.values(datasetsByBrand);

                var that = this
                let requestsDone = 0;
                const totalRequests = arrayOfArrays.length;
                console.log(totalRequests);
                var FilesList = [];

                for (const dataset of arrayOfArrays) {
                    const resultFile = await that._onFormatExcel(dataset, that, requestsDone, totalRequests);
                    if (resultFile.base64 !== '') {
                        FilesList.push(resultFile);
                        requestsDone++;
                    }

                }

                if (requestsDone === totalRequests) {
                    const zip = new JSZip();
                    FilesList.forEach(item => {
                        var base64 = item.base64;
                        var data = item.lineItems[0].SEASON_ACQUISTO
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
                    zip.generateAsync({ type: "blob" })
                        .then(function (content) {
                            // Crea un link di download
                            const link = document.createElement('a');
                            link.download = "SELL_THROUHG-AGGRAGAZIONE-BRAND " + ".zip";
                            link.href = window.URL.createObjectURL(content);
                            link.click();
                        });
                    oBusyDialog.close();
                }

            },


            _onFormatExcel2: function (dataset, that, requestsDone, totalRequests) {
                return new Promise((resolve, reject) => {

                    $.ajax({
                        url: that.getView().getModel("exportService").sServiceUrl + "/format_excel",
                        type: "POST",
                        data: JSON.stringify({ lineItems: dataset }),
                        contentType: "application/json; charset=utf-8",
                        responseType: "text",
                        success: function (data) {
                            var result = { result: "ok", base64: data.d.format_excel, lineItems: dataset };

                            resolve(result);
                        },
                        error: function (xhr, status, error) {
                            var result = { result: "ko", lineItems: dataset };
                            MessageBox.error("Errore nello scaricamento dell'excel contattare l'amministratore")
                            oBusyDialog.close();
                            requestsDone++;

                            if (requestsDone === totalRequests) {
                                oBusyDialog.close();
                            }
                            reject(result);
                        }
                    });

                });

            },
            _onFormatExcel: function (dataset, that, requestsDone, totalRequests) {
                return new Promise((resolve, reject) => {

                    $.ajax({
                        url: that.getView().getModel("exportServiceAggregato").sServiceUrl + "/format_excelAggregato",
                        type: "POST",
                        data: JSON.stringify({ lineItems: dataset }),
                        contentType: "application/json; charset=utf-8",
                        responseType: "text",
                        success: function (data) {
                            var result = { result: "ok", base64: data.d.format_excelAggregato, lineItems: dataset };

                            resolve(result);
                        },
                        error: function (xhr, status, error) {
                            var result = { result: "ko", lineItems: dataset };
                            MessageBox.error("Errore nello scaricamento dell'excel contattare l'amministratore")
                            oBusyDialog.close();
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
            handleIconTabBarSelect: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var tab = oEvent.getParameter("selectedItem").getProperty("key")
                if (tab == "AggregazioneBrand") {
                    this.getView().byId("Esporta").setVisible(false)
                    this.getView().byId("EsportaAggregazioneBrand").setVisible(true)
                } else {
                    this.getView().byId("Esporta").setVisible(true)
                    this.getView().byId("EsportaAggregazioneBrand").setVisible(false)
                }
            }

        });
    });
