@cds.persistence.exists 
@cds.persistence.calcview 
entity CV_REPORT_VENDUTO_PER_CANALE {
key     SISTEMA_SORGENTE: String(5)                     @title: 'SISTEMA SORGENTE' ; 
        POSTING_DATE: Date                              @title: 'POSTING DATE' ; 
key     COMPANYID: String(5000)                         @title: 'COMPANYID' ; 
key     COMPANY: String(25)                             @title: 'COMPANY' ; 
key     PROFIT_CENTER_CODE: String(5000)                @title: 'PROFIT CENTER CODE' ; 
key     PROFIT_CENTER: String(40)                       @title: 'PROFIT CENTER' ; 
key     SAP_ORDER_NUMBER: String(10)                    @title: 'SAP ORDER NUMBER' ; 
key     SAP_ORDER_ITEM: String(6)                       @title: 'SAP ORDER ITEM' ; 
key     SALE_ORDER_TYPE_CODE: String(4)                 @title: 'SALE ORDER TYPE CODE' ; 
key     SALE_ORDER_TYPE: String(5000)                   @title: 'SALE ORDER TYPE' ; 
key     OUTBOUND_DELIVERY_NUMBER: String(10)            @title: 'OUTBOUND DELIVERY NUMBER' ; 
key     OUTBOUND_DELIVERY_ITEM: String(6)               @title: 'OUTBOUND DELIVERY ITEM' ; 
key     ORIGINAL_ORDER_NUMBER: String(10)               @title: 'ORIGINAL ORDER NUMBER' ; 
key     ORIGINAL_ORDER_ITEM: String(6)                  @title: 'ORIGINAL ORDER ITEM' ; 
key     ORIGINAL_ORDER_TYPE: String(20)                 @title: 'ORIGINAL ORDER TYPE' ; 
key     PLANT_CODE: String(5000)                        @title: 'PLANT CODE' ; 
key     STORE: String(35)                               @title: 'STORE' ; 
key     COMMITTENTE_CODE: String(5000)                  @title: 'COMMITTENTE CODE' ; 
key     COMMITTENTE: String(5000)                       @title: 'COMMITTENTE' ; 
key     AGENTE_CODE: String(10)                         @title: 'AGENTE CODE' ; 
key     AGENTE: String(35)                              @title: 'AGENTE' ; 
key     DESTINATARIO_CODE: String(5000)                 @title: 'DESTINATARIO CODE' ; 
key     DESTINATARIO: String(5000)                      @title: 'DESTINATARIO' ; 
key     PAESE_DESTINAZIONE_CODE: String(3)              @title: 'PAESE DESTINAZIONE CODE' ; 
key     PAESE_DESTINAZIONE: String(50)                  @title: 'PAESE DESTINAZIONE' ; 
key     REFERENCE_MATERIAL: String(40)                  @title: 'REFERENCE MATERIAL' ; 
key     MATERIAL: String(5000)                          @title: 'MATERIAL' ; 
key     MATERIAL_DESCRIPTION: String(40)                @title: 'MATERIAL DESCRIPTION' ; 
key     SEASON: String(5000)                            @title: 'SEASON' ; 
key     BRAND: String(30)                               @title: 'BRAND' ; 
key     FAMILY: String(18)                              @title: 'FAMILY' ; 
key     GENDER: String(18)                              @title: 'GENDER' ; 
key     SUBGENDER: String(18)                           @title: 'SUBGENDER' ; 
key     PRODUCT_GROUP: String(20)                       @title: 'PRODUCT GROUP' ; 
key     DESCRIZIONE_COLOR: String(32)                   @title: 'DESCRIZIONE COLOR' ; 
key     SIZE: String(18)                                @title: 'SIZE' ; 
key     COLLECTION: String(10)                          @title: 'COLLECTION' ; 
        PIECES_SOLD: Integer                            @title: 'PIECES SOLD' ; 
        WHOLESALE_PRICE_DA_ORDINE: Decimal(13,2)        @title: 'WHOLESALE PRICE DA ORDINE' ; 
        WHOLESALE_PRICE_LISTINO: Decimal(11,2)          @title: 'WHOLESALE PRICE LISTINO' ; 
        RETAIL_NET_PRICE_UN: Decimal(13,2)              @title: 'RETAIL NET PRICE UN' ; 
        RETAIL_FULL_PRICE_UN: Decimal(11,2)             @title: 'RETAIL FULL PRICE UN' ; 
key     VALUTA: String(5000)                            @title: 'VALUTA' ; 
        MARK_APPLIED: Decimal(15,2)                     @title: 'MARK-DOWN/MARK-UP APPLIED' ; 
        MARK_PERCENTAGE_APPLIED: Decimal(13,2)          @title: 'MARK-UP/MARK-DOWN PERCENTAGE APPLIED' ; 
        SELL_OUT_PRICE_UN: Decimal(13,2)                @title: 'SELL OUT PRICE UN' ; 
        TASSO_DI_CAMBIO: Decimal(16,2)                  @title: 'TASSO DI CAMBIO' ; 
        TOTAL_SELL_OUT_PRICE_EUR: Decimal(13,2)         @title: 'TOTAL SELL OUT PRICE EUR' ; 
        TOT_COGS: Decimal(13,2)                         @title: 'TOT COGS EUR' ; 
        TOT_GROSS_MARGIN_PERCENT: Decimal(13,2)         @title: 'TOT GROSS MARGIN PERCENT' ; 
        TOT_GROSS_MARGIN_EUR: Decimal(13,2)             @title: 'TOT GROSS MARGIN EUR' ; 
key     CASHDESKID: String(5000)                        @title: 'CASHDESKID' ; 
key     DOCUMENTENTRY: String(5000)                     @title: 'DOCUMENTENTRY' ; 
key     DOCUMENTPOSNR: String(5000)                     @title: 'DOCUMENTPOSNR' ; 
}