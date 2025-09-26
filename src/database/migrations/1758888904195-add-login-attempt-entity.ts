import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLoginAttemptEntity1758888904195 implements MigrationInterface {
    name = 'AddLoginAttemptEntity1758888904195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`LOGIN_ATTEMPTS\` (\`ID\` int NOT NULL AUTO_INCREMENT, \`USERNAME\` varchar(255) NOT NULL, \`IS_SUCCESS\` tinyint NOT NULL, \`CREATED_AT\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`ID\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_ADMIN\` CHANGE \`OTHER_NAMES\` \`OTHER_NAMES\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_ADMIN\` CHANGE \`PHONE_NUMBER\` \`PHONE_NUMBER\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`OTHER_NAMES\` \`OTHER_NAMES\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`PHONE_NUMBER\` \`PHONE_NUMBER\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`COUNTRY_ID\` \`COUNTRY_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`EMAIL\` \`EMAIL\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`ALT_PHONE_NUMBER\` \`ALT_PHONE_NUMBER\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`ADDRESS\` \`ADDRESS\` varchar(1000) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`STATE_ID\` \`STATE_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`CITY_RESIDENCE\` \`CITY_RESIDENCE\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`REFERRAL_CODE\` \`REFERRAL_CODE\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`KYC_STATUS\` \`KYC_STATUS\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`PHOTO\` \`PHOTO\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNTS\` CHANGE \`BIO\` \`BIO\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNTS\` CHANGE \`OLD_ID\` \`OLD_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`PERMISSION_GROUPS\` CHANGE \`TYPE\` \`TYPE\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`PERMISSION_GROUPS\` CHANGE \`SLUG\` \`SLUG\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`PERMISSION_GROUPS\` CHANGE \`PARENT_ID\` \`PARENT_ID\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`PERMISSIONS\` CHANGE \`INVERTED\` \`INVERTED\` tinyint(1) NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`PERMISSIONS\` CHANGE \`CONDITIONS\` \`CONDITIONS\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`PERMISSIONS\` CHANGE \`REASON\` \`REASON\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`PERMISSIONS\` CHANGE \`DELETED_AT\` \`DELETED_AT\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`ROLES\` CHANGE \`SLUG\` \`SLUG\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ROLES\` CHANGE \`ACCOUNT_ID\` \`ACCOUNT_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`PASSWORD\` \`PASSWORD\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`IS_FIRST_LOGIN\` \`IS_FIRST_LOGIN\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`LAST_LOGIN\` \`LAST_LOGIN\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`DELETED_AT\` \`DELETED_AT\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`HASHED_RT\` \`HASHED_RT\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`WF_USER_ID\` \`WF_USER_ID\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`WF_USER_PASSWORD\` \`WF_USER_PASSWORD\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENTS\` CHANGE \`ALLOWED_FORMATS\` \`ALLOWED_FORMATS\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENTS\` CHANGE \`DESCRIPTION\` \`DESCRIPTION\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` DROP FOREIGN KEY \`FK_57cd31c9eb11f4b582651d5df82\``);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` CHANGE \`MIME_TYPE\` \`MIME_TYPE\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` CHANGE \`SIZE\` \`SIZE\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` CHANGE \`DOCUMENT_ID\` \`DOCUMENT_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` DROP FOREIGN KEY \`FK_8e3f938a1f36a577b03dd6b7bb6\``);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` CHANGE \`META_DATA\` \`META_DATA\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` CHANGE \`PARENT_ID\` \`PARENT_ID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` CHANGE \`SLUG\` \`SLUG\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` CHANGE \`PARENTID\` \`PARENTID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` ADD CONSTRAINT \`FK_57cd31c9eb11f4b582651d5df82\` FOREIGN KEY (\`DOCUMENT_ID\`) REFERENCES \`DOCUMENTS\`(\`ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` ADD CONSTRAINT \`FK_8e3f938a1f36a577b03dd6b7bb6\` FOREIGN KEY (\`PARENTID\`) REFERENCES \`BASE_RECORDS\`(\`ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` DROP FOREIGN KEY \`FK_8e3f938a1f36a577b03dd6b7bb6\``);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` DROP FOREIGN KEY \`FK_57cd31c9eb11f4b582651d5df82\``);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` CHANGE \`PARENTID\` \`PARENTID\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` CHANGE \`SLUG\` \`SLUG\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` CHANGE \`PARENT_ID\` \`PARENT_ID\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` CHANGE \`META_DATA\` \`META_DATA\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`BASE_RECORDS\` ADD CONSTRAINT \`FK_8e3f938a1f36a577b03dd6b7bb6\` FOREIGN KEY (\`PARENTID\`) REFERENCES \`BASE_RECORDS\`(\`ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` CHANGE \`DOCUMENT_ID\` \`DOCUMENT_ID\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` CHANGE \`SIZE\` \`SIZE\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` CHANGE \`MIME_TYPE\` \`MIME_TYPE\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENT_FILES\` ADD CONSTRAINT \`FK_57cd31c9eb11f4b582651d5df82\` FOREIGN KEY (\`DOCUMENT_ID\`) REFERENCES \`DOCUMENTS\`(\`ID\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENTS\` CHANGE \`DESCRIPTION\` \`DESCRIPTION\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`DOCUMENTS\` CHANGE \`ALLOWED_FORMATS\` \`ALLOWED_FORMATS\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`WF_USER_PASSWORD\` \`WF_USER_PASSWORD\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`WF_USER_ID\` \`WF_USER_ID\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`HASHED_RT\` \`HASHED_RT\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`DELETED_AT\` \`DELETED_AT\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`LAST_LOGIN\` \`LAST_LOGIN\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`IS_FIRST_LOGIN\` \`IS_FIRST_LOGIN\` tinyint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`USERS\` CHANGE \`PASSWORD\` \`PASSWORD\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ROLES\` CHANGE \`ACCOUNT_ID\` \`ACCOUNT_ID\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ROLES\` CHANGE \`SLUG\` \`SLUG\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`PERMISSIONS\` CHANGE \`DELETED_AT\` \`DELETED_AT\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`PERMISSIONS\` CHANGE \`REASON\` \`REASON\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`PERMISSIONS\` CHANGE \`CONDITIONS\` \`CONDITIONS\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`PERMISSIONS\` CHANGE \`INVERTED\` \`INVERTED\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`PERMISSION_GROUPS\` CHANGE \`PARENT_ID\` \`PARENT_ID\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`PERMISSION_GROUPS\` CHANGE \`SLUG\` \`SLUG\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`PERMISSION_GROUPS\` CHANGE \`TYPE\` \`TYPE\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNTS\` CHANGE \`OLD_ID\` \`OLD_ID\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNTS\` CHANGE \`BIO\` \`BIO\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`PHOTO\` \`PHOTO\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`KYC_STATUS\` \`KYC_STATUS\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`REFERRAL_CODE\` \`REFERRAL_CODE\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`CITY_RESIDENCE\` \`CITY_RESIDENCE\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`STATE_ID\` \`STATE_ID\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`ADDRESS\` \`ADDRESS\` varchar(1000) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`ALT_PHONE_NUMBER\` \`ALT_PHONE_NUMBER\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`EMAIL\` \`EMAIL\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`COUNTRY_ID\` \`COUNTRY_ID\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`PHONE_NUMBER\` \`PHONE_NUMBER\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_CUSTOMER\` CHANGE \`OTHER_NAMES\` \`OTHER_NAMES\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_ADMIN\` CHANGE \`PHONE_NUMBER\` \`PHONE_NUMBER\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`ACCOUNT_ADMIN\` CHANGE \`OTHER_NAMES\` \`OTHER_NAMES\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`LOGIN_ATTEMPTS\``);
    }

}
