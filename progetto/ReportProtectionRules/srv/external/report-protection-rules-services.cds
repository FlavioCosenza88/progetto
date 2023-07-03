/* checksum : 646e4f2a3b5f51a33d07ac58f9cd9ec0 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
service report_protection_rules_services {};

@cds.external : true
@cds.persistence.skip : true
entity report_protection_rules_services.PROTECTIONRULES_LOWLEVEL {
  key FAMILY_ID : String(3) not null;
  key ARTICLE_ID : String(40) not null;
  key FAMILY : String(30) not null;
  key ARTICLE_IMG : String(120) not null;
  key SEASON_YEAR : String(4) not null;
  key PRODUCT_GROUP : String(9) not null;
  key STORE_POINT : String(30) not null;
  key ARTICLE_DESCR : String(40) not null;
  key SEASON : String(10) not null;
  key GENDER : String(18) not null;
  key STORE_POINT_ID : String(4) not null;
  key SALES_CHANNEL : String(40) not null;
  key ID_REGOLA : String(36) not null;
  key BRAND : String(30) not null;
  key SALES_CHANNEL_ID : String(5) not null;
  key BRAND_ID : String(4) not null;
  VALORE_STOCK_PROTETTO : Decimal(13, 0);
  RETAIL_PRICE : Decimal(11, 0);
  QUANTITA_STOCK : Decimal(13, 0);
  @sap.display.format : 'Date'
  VALIDO_DA : Date;
  WHOLESALE : Decimal(11, 0);
  @sap.display.format : 'Date'
  VALIDO_A : Date;
  QUANTITA_PROTETTA : Decimal(13, 0);
};

@cds.external : true
@cds.persistence.skip : true
entity report_protection_rules_services.PROTECTIONRULES_HIGHLEVEL {
  key ARTICLE_ID : String(40) not null;
  key SALES_CHANNEL : String(40) not null;
  key SEASON_YEAR : String(4) not null;
  key STORE_POINT : String(30) not null;
  key ID_REGOLA : String(36) not null;
  key FAMILY_ID : String(3) not null;
  key SEASON : String(10) not null;
  key STORE_POINT_ID : String(4) not null;
  key FAMILY : String(30) not null;
  key BRAND : String(30) not null;
  key BRAND_ID : String(4) not null;
  key SALES_CHANNEL_ID : String(5) not null;
  WHOLESALE : Decimal(11, 0);
  @sap.display.format : 'Date'
  VALIDO_DA : Date;
  QUANTITA_PROTETTA : Decimal(13, 0);
  @sap.display.format : 'Date'
  VALIDO_A : Date;
};

