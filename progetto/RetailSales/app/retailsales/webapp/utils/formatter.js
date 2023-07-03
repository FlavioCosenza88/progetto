sap.ui.define([

], function() {
    'use strict';
    return {
       
        formatNumberToString: function (iNumber) {
            if (iNumber) {
               
                var StringToFrontEnd=iNumber.toString()
                return StringToFrontEnd;
            }else{
                return iNumber;
            }
            
        },
        formatDateToString: function(date){
            if(date){
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd-MM-YYYY" }); 
                var dataDaFormatted = dateFormat.format(date);
                return dataDaFormatted
            }
        },
        formatpointToComma: function(date){
            if(date){
                var StringToFrontEnd=date.replace(".", ",")
                return StringToFrontEnd
            }
        }

    }
}); 