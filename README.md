# vietpay

SOLUTION https://github.com/g4lb/spider

TOOLS https://www.npmjs.com/package/crawler

https://blog.logrocket.com/node-js-web-scraping-tutorial/#what-worker-node-js

https://www.npmjs.com/package/crawler

https://hoanguyenit.com/crawl-data-website-using-nodejs.html

https://www.zenrows.com/blog/javascript-web-crawler-nodejs#optimize-web-crawler

https://www.scrapingdog.com/blog/javascript-web-crawler-nodejs/

Issues: NestJS

Typescript:

Note:

appConfig

Using config on module import: nestjs typeorm datasource config service
https://stackoverflow.com/questions/52570212/nestjs-using-configservice-with-typeormmodule

nodejs dirname as root path nodejs project root dir src
https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application

Formatter (prettier)
https://stackoverflow.com/questions/52586965/why-does-prettier-not-format-code-in-vs-code

https://stackoverflow.com/questions/68600742/why-prettier-semi-not-adding-any-semicolons-on-my-javascript-files

================================================================ CHECK
USABILITY:

ValidationPipe

LoggingInterceptor

src/common/constant: error.message.constant.ts

src/common/interceptors

================================================================

PENDING:

Transaction: Mongoose + Typeorm

Mongoose Session

Structure source base easy for search impact

Inject request to base mongo repository for inserting createdBy

class ResponseAccountListDto extends BaseResponseDataList not able to
inherit @Type(() => Dto) on parent class BaseResponseDataList

================================================================

transactions.controller.ts import { Controller, Get, Post, Body, HttpCode,
HttpStatus, SerializeOptions } from "@nestjs/common"; import { MODULE_INFO
} from "./transactions.constant"; import { TransactionsService } from
"./transactions.service"; import { CreateTransactionDto,
ResponseTransactionDto } from "./transactions.dto"; import {
ICreateTransaction } from "./transactions.types";

@Controller(MODULE_INFO.NAME) export class TransactionsController {
constructor(private transactionsService: TransactionsService) {}

@Post() @HttpCode(HttpStatus.OK) async createOne( @Body()
createTransactionDto: CreateTransactionDto ):
Promise<ResponseTransactionDto> { const transaction = createTransactionDto
as ICreateTransaction; const data = await
this.transactionsService.insertOne(transaction); console.log(data);

    return new ResponseTransactionDto({
      code: "1",
      type: "a1",
      contact_infos: {
        address: "a",
        phone: "012"
      },
      sensitive_info: "az"
    });

}

@Get() @SerializeOptions({ type: ResponseTransactionDto })
@HttpCode(HttpStatus.OK) // async findOne():
Promise<ResponseTransactionDto> { async findOne() { const data = await
this.transactionsService.getOne(); console.log("================== namee ",
TransactionsController.name); return data;

    // return new ResponseTransactionDto({
    //   code: '1',
    //   type: 'a1',
    //   contact_infos: {
    //     address: 'a',
    //     phone: '012',
    //   },
    //   sensitive_info: 'az',
    // });

} }

============================================================

transactions.dto.ts

import { CODE } from "common/constants"; import { IsString, IsNumber,
IsNotEmpty } from "class-validator"; import { Expose, Exclude, Transform }
from "class-transformer"; import { ApiProperty } from "@nestjs/swagger";
import { SOURCE_ISSUER, PAYMENT_TYPES } from "./transactions.constant";

export class ContactInfosDto { address: string; phone: string; }

export class ResponseTransactionDto { @IsString() code: CODE;

@IsString() @Expose({ name: "trans", }) type: string;

@IsNumber() @ApiProperty({ description: "transaction amount", minimum: 0,
default: 0, example: 1000, }) amount: number;

@Exclude() sensitive_info: string;

@Transform(({ value }) => value.address) contact_infos: ContactInfosDto;

constructor(partial: Partial<ResponseTransactionDto>) { Object.assign(this,
partial); }

@Expose() get trans(): string { return this.type; } }

export class CreateTransactionDto { @IsString() @IsNotEmpty()
@ApiProperty({ type: String, // enum: [PAYMENT_TYPES.ATM,
PAYMENT_TYPES.QR_CODE], enum: PAYMENT_TYPES, }) type: string;

@ApiProperty({ type: Number, description: "transaction amount", minimum: 0,
default: 0, // example: 1000, examples: { "1k": { value: 1000, }, "2k": {
value: 2000, }, }, }) amount: number;

@ApiProperty({ type: [String], description: "Source issuer list", default:
SOURCE_ISSUER.DOMESTIC, example: SOURCE_ISSUER.DOMESTIC, enum:
[SOURCE_ISSUER.DOMESTIC, SOURCE_ISSUER.OVERSEAS], }) source_issuers:
Array<string>;

@IsString() @ApiProperty() sensitive_info: string;

@IsString() @ApiProperty() contact_infos: ContactInfosDto; }

============================================================

transactions.types.ts

import { CODE } from "common/constants";

export interface IContactInfos { address: string; phone: string; }

export interface ICreateTransaction { type: string;

amount: number;

source_issuers: Array<string>;

sensitive_info: string;

contact_infos: IContactInfos; }

export interface ITransaction { code: CODE;

type: string;

amount: number;

sensitive_info: string;

contact_infos: IContactInfos; }

============================================================

transactions.service.ts

import { Injectable } from "@nestjs/common"; import {
TransactionsRepository } from "./transactions.repository"; import {
ITransaction, ICreateTransaction } from "./transactions.types"; import {
TransactionEntity } from "./transactions.entity";

@Injectable() export class TransactionsService { constructor(private
transactionsRepository: TransactionsRepository) {}

private readonly cats: TransactionEntity[] = [ { code: "code_a", type:
"type_a", sensitive_info: "sen_a", contact_infos: { address: "address_a",
phone: "phone_a" } }, { code: "b", type: "b", sensitive_info: "b",
contact_infos: { address: "b", phone: "b" } } ];

async insertOne(body: ICreateTransaction): Promise<ITransaction> { const
cat: TransactionEntity = { code: "a", ...body }; this.cats.push(cat); const
data1 = cat as TransactionEntity; const data2 = data1 as ITransaction;
return data2; }

async getOne(): Promise<ITransaction> { const data = this.cats[0] as
ITransaction; // console.log('========================= getOne this.cats[0]
', this.cats[0]); console.log("========================= getOne data ",
data); return data; }

async getMany(): Promise<ITransaction[]> { const data = this.cats as
ITransaction[]; return data; } }

============================================================

RECHECK

QueryOneParams [key: string]: unknown;

============================================================

POSTGRES TABLES

/\*

    CREATE TABLE hr_roles (
        id SERIAL PRIMARY KEY,
        key VARCHAR(20) NOT NULL UNIQUE GENERATED ALWAYS AS ('ACC0' || id::text) STORED,
        status SMALLINT,
        "createdBy" VARCHAR(20),
        "updatedBy" VARCHAR(20),
        "createdAt" TIMESTAMP WITH TIME ZONE,
        "updatedAt" TIMESTAMP WITH TIME ZONE,

        title VARCHAR(50),
        actions VARCHAR[]
    )

    CREATE TABLE hr_accounts (
        id SERIAL PRIMARY KEY,
        key VARCHAR(20) NOT NULL UNIQUE GENERATED ALWAYS AS ('ACC0' || id::text) STORED,
        status SMALLINT,
        "createdBy" VARCHAR(20),
        "updatedBy" VARCHAR(20),
        "createdAt" TIMESTAMP WITH TIME ZONE,
        "updatedAt" TIMESTAMP WITH TIME ZONE,

        username VARCHAR(50) UNIQUE,
        phone VARCHAR(50),
        email VARCHAR(50) UNIQUE,
        password VARCHAR(50),

        "fullName" VARCHAR(255),
        avatar VARCHAR(255),
        gender VARCHAR(20),
        "roleId" VARCHAR(20) REFERENCES hr_roles(key),
        "lastLoginAt" TIMESTAMP WITH TIME ZONE
    )

    // Hotel facilities
    CREATE TABLE fac_hotels (
        id SERIAL PRIMARY KEY,
        key VARCHAR(20) NOT NULL UNIQUE GENERATED ALWAYS AS ('ACC0' || id::text) STORED,
        status SMALLINT,
        "createdBy" VARCHAR(20),
        "updatedBy" VARCHAR(20),
        "createdAt" TIMESTAMP WITH TIME ZONE,
        "updatedAt" TIMESTAMP WITH TIME ZONE,

        phone VARCHAR(50) UNIQUE,
        email VARCHAR(50) UNIQUE,
        address VARCHAR(255),
    )

    CREATE TABLE fac_rooms (
        id SERIAL PRIMARY KEY,
        key VARCHAR(20) NOT NULL UNIQUE GENERATED ALWAYS AS ('ACC0' || id::text) STORED,
        status SMALLINT,
        "createdBy" VARCHAR(20),
        "updatedBy" VARCHAR(20),
        "createdAt" TIMESTAMP WITH TIME ZONE,
        "updatedAt" TIMESTAMP WITH TIME ZONE,

        no VARCHAR(50) UNIQUE,
        phone VARCHAR(50) UNIQUE,
        price REAL,
    )

    CREATE TABLE sys_products (
    )

    CREATE TABLE sys_orders (
    )

    CREATE TABLE sys_payments (
    )

    CREATE TABLE sys_transactions (
    )

    CREATE TABLE sys_notifications (
    )

    CREATE TABLE sys_chats (
    )

    CREATE TABLE sys_images (
    )

    CREATE TABLE sys_discounts (
    )

    CREATE TABLE sys_customers (
    )

\*/

==================================================================

Feature Modules

- Authen: SSO, JWT
- Account
- Transaction
- Refund
- Reconcile
-

Sentry Firebase Elasticsearch Redis MongoDB Postgres SSO
