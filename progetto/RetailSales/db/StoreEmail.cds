using {managed} from '@sap/cds/common';

entity T_STORE_EMAIL : managed {
    key STORE_ID         : String(5);
        STORE            : String(35);
        STORE_EMAIL      : String(100);
        IS_JOB_SCHEDULED : String(1);
        DATE_FROM        : Date;
        DATE_TO          : Date
}
