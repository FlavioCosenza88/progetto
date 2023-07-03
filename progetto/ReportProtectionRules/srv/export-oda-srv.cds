service ExportOdaService {
    action   format_excel(lineItems : many LineItem) returns String;
    function getCSRFToken()                          returns String;
    type LineItem { 
        ARTICLE_DESCR:      String;
        ARTICLE_ID:      String;
        ARTICLE_IMG:      String;
        BRAND:      String;
        BRAND_ID:      String;
        FAMILY:      String;
        FAMILY_ID:      String;
        GENDER:      String;
        ID_REGOLA:      String;
        PRODUCT_GROUP:      String;
        QUANTITA_PROTETTA:      String;
        QUANTITA_STOCK:      String;
        RETAIL_PRICE:      String;
        SALES_CHANNEL:      String;
        SALES_CHANNEL_ID:      String;
        SEASON:      String;
        SEASON_YEAR:      String;
        STORE_POINT:      String;
        STORE_POINT_ID:      String;
        VALIDO_A:      String;
        VALIDO_DA:      String;
        VALORE_STOCK_PROTETTO:      String;
        WHOLESALE :      String;
    }
}