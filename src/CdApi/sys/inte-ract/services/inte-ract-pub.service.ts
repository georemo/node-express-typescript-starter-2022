import { BaseService } from '../../../sys/base/base.service';
import { SessionService } from '../../../sys/user/services/session.service';
import { CdService } from '../../../sys/base/cd.service';
import { CreateIParams, IQbInput, IRespInfo, IServiceInput, IUser } from '../../../sys/base/IBase';
import { InteRactPubModel } from '../models/inte-ract-pub.model';
import { from, Observable } from 'rxjs';
import { getConnection } from 'typeorm';
import { InteRactPubViewModel } from '../models/inte-ract-pub-view.model';
import { InteRactMediaService } from './inte-ract-media.service';
import { InteRactMediaModel } from '../models/inte-ract-media.model';

export class InteRactPubService extends CdService {
    err: string[] = []; // error messages
    b: any; // instance of InteRactPubService
    cdToken: string;
    plData: InteRactPubModel;
    serviceModel: InteRactPubModel;
    sessModel;
    isInitial; // the first time a bill is created other than being amended

    /*
     * create rules
     */
    cRules: any = {
        required: [
        ],
        noDuplicate: []
    };
    uRules: any[];
    dRules: any[];

    constructor() {
        super()
        this.b = new BaseService();
        this.serviceModel = new InteRactPubModel();
    }

    /**
     * {
            "ctx": "Sys",
            "m": "InteRact",
            "c": "InteRactPubController",
            "a": "actionCreate",
            "dat": {
                "f_vals": [
                    {
                        "InteRactMedia": {
                            "inteRactMediaName": "",
                            "inteRactMediaDescription": "",
                            "inteRactMediaTypeId": "",
                            "location": "http://localhost/xxx"
                        },
                        "data": {
                            "InteRactPubName": "pms/schedule?project_id=3&schedule_id=12",
                            "InteRactPubDescription": "jgfl",
                            "InteRactPubTypeId": "",
                            "public": false,
                            "m": "pms",
                            "c": "schedule",
                            "j_val": "{\"m\":\"pms\",\"c\":\"schedules\",\"projectID\":\"3\",\"scheduleID\":\"12\"}"
                        }
                    }
                ],
                "token": "mT6blaIfqWhzNXQLG8ksVbc1VodSxRZ8lu5cMgda"
            },
            "args": null
        }
     * 
     * @param req 
     * @param res 
     */
    async create(req, res) {
        console.log('InteRactPubService::create()/01')
        const svSess = new SessionService();
        if (await this.validateCreate(req, res)) {
            await this.beforeCreate(req, res);
            const serviceInput = {
                serviceInstance: this,
                serviceModel: InteRactPubModel,
                serviceModelInstance: this.serviceModel,
                docName: 'Create InteRactPub',
                dSource: 1,
            }
            const newInteRactPub = await this.b.create(req, res, serviceInput)
            console.log('InteRactPubService::create()/newInteRactPub:', newInteRactPub)
            const afterResult = await this.afterCreate(req, res, newInteRactPub)
            console.log('InteRactPubService::create()/afterResult:', afterResult)
            this.b.i.app_msg = '';
            this.b.setAppState(true, this.b.i, svSess.sessResp);
            this.b.cdResp.data = afterResult;
            const r = await this.b.respond(req, res);
        } else {
            const r = await this.b.respond(req, res);
        }
    }

    async beforeCreate(req, res): Promise<any> {
    }

    /**
     * sync bill with cd-invoice
     * @param req 
     * @param res 
     * @param createResult 
     * @returns 
     */
    async afterCreate(req, res, newInteRactPub: InteRactPubModel): Promise<any> {
        console.log('InteRactPubService::afterCreate()/newInteRactPub:', newInteRactPub)
        // create new InteRactMedia after getting id from the newInteRactPub 
        const svInteRactMedia = new InteRactMediaService()
        const mediaData: InteRactMediaModel = this.b.getPlData(req, 'InteRactMedia')
        mediaData.inteRactPubId = newInteRactPub.inteRactPubId
        const si = {
            serviceInstance: svInteRactMedia,
            serviceModel: InteRactMediaModel,
            serviceModelInstance: svInteRactMedia.serviceModel,
            docName: 'beforeCreate/beforeCreate',
            dSource: 1,
        }
        const createIParams: CreateIParams = {
            serviceInput: si,
            controllerData: mediaData
        }
        // return await svBill.createI(req, res, createIParams)
        const newMedia = await svInteRactMedia.createI(req,res,createIParams)
        console.log('InteRactPubService::afterCreate()/newMedia:', newMedia)
    }

    async createI(req, res, createIParams: CreateIParams) {
        return await this.b.createI(req, res, createIParams)
    }

    async validateCreateI(req, res, createIParams) {
        console.log('InteRactPubService::validateCreateI()/01')
        let countInvalid = 0;
        // const validRequired = await this.b.validateRequired(req, res, this.cRules)
        // console.log('InteRactPubService::validateCreateI()/validRequired:', validRequired)

        // confirm that controllerData conforms to this.cRules
        this.cRules.required.forEach((fieldName) => {
            if (!(fieldName in createIParams.controllerData)) { // required field is missing
                countInvalid++;
            }
        })
        if (countInvalid > 0) {
            return true;
        } else {
            return false;
        }
    }

    async beforeCreateI(req, res, createIParams: CreateIParams): Promise<any> {
        // create 
    }

    async read(req, res, serviceInput: IServiceInput): Promise<any> {
        const q = this.b.getQuery(req);
        console.log('InteRactPubService::getInteRactPub/q:', q);
        try {
            this.b.read$(req, res, serviceInput)
                .subscribe((r) => {
                    // console.log('InteRactPubService::read$()/r:', r)
                    this.b.i.code = 'InteRactPubService::Get';
                    const svSess = new SessionService();
                    svSess.sessResp.cd_token = req.post.dat.token;
                    svSess.sessResp.ttl = svSess.getTtl();
                    this.b.setAppState(true, this.b.i, svSess.sessResp);
                    this.b.cdResp.data = r;
                    this.b.sqliteConn.close();
                    this.b.respond(req, res)
                })
        } catch (e) {
            console.log('InteRactPubService::read$()/e:', e)
            this.b.err.push(e.toString());
            const i = {
                messages: this.b.err,
                code: 'InteRactPubService:update',
                app_msg: ''
            };
            await this.b.serviceErr(req, res, e, i.code)
            await this.b.respond(req, res)
        }
    }

    // /**
    //  *
    //  * {
    //         "ctx": "App",
    //         "m": "InteRact",
    //         "c": "InteRactPub",
    //         "a": "Update",
    //         "dat": {
    //             "f_vals": [
    //                 {
    //                     "query": {
    //                         "update": {
    //                             "billGuid": "azimio3"
    //                         },
    //                         "where": {
    //                             "inteRactPubId": 8
    //                         }
    //                     }
    //                 }
    //             ],
    //             "token": "fc735ce6-b52f-4293-9332-0181a49231c4"
    //         },
    //         "args": {}
    //     }
    //  * @param req
    //  * @param res
    //  */
    update(req, res) {
        console.log('InteRactPubService::update()/01');
        let q = this.b.getQuery(req);
        q = this.beforeUpdate(q);
        const serviceInput = {
            serviceModel: InteRactPubModel,
            docName: 'InteRactPubService::update',
            cmd: {
                action: 'update',
                query: q
            },
            dSource: 1
        }
        console.log('InteRactPubService::update()/02')
        this.b.update$(req, res, serviceInput)
            .subscribe((ret) => {
                this.b.cdResp.data = ret;
                this.b.sqliteConn.close();
                this.b.respond(req, res)
            })
    }

    async updateI(req, res, q): Promise<any> {
        console.log('InteRactPubService::updateI()/01');
        // let q = this.b.getQuery(req);
        q = this.beforeUpdate(q);
        const serviceInput = {
            serviceModel: InteRactPubModel,
            docName: 'InteRactPubService::updateI',
            cmd: {
                action: 'update',
                query: q
            },
            dSource: 1
        }
        console.log('InteRactPubService::update()/02')
        return this.b.update(req, res, serviceInput)
    }

    /**
     * harmonise any data that can
     * result in type error;
     * @param q
     * @returns
     */
    beforeUpdate(q: any) {
        if (q.update.billEnabled === '') {
            q.update.billEnabled = null;
        }
        return q;
    }

    async remove(req, res) {
        //
    }

    /**
     * methods for transaction rollback
     */
    rbCreate(): number {
        return 1;
    }

    rbUpdate(): number {
        return 1;
    }

    rbDelete(): number {
        return 1;
    }

    async validateCreate(req, res) {
        console.log('InteRactPubService::validateCreate()/01')
        const validRequired = await this.b.validateRequired(req, res, this.cRules)
        console.log('InteRactPubService::validateCreate()/validRequired:', validRequired)
        return validRequired;
    }

    // /**
    //  *
    //  * {
    //         "ctx": "App",
    //         "m": "InteRact",
    //         "c": "InteRactPub",
    //         "a": "Get",
    //         "dat": {
    //             "f_vals": [
    //                 {
    //                     "query": {
    //                         "where": {
    //                             "inteRactPubId": 8
    //                         }
    //                     }
    //                 }
    //             ],
    //             "token": "fc735ce6-b52f-4293-9332-0181a49231c4"
    //         },
    //         "args": {}
    //     }
    //  * @param req
    //  * @param res
    //  */
    async getInteRactPub(req, res) {
        const q = this.b.getQuery(req);
        console.log('InteRactPubService::getInteRactPub/q:', q);
        const serviceInput = {
            serviceModel: InteRactPubModel,
            docName: 'InteRactPubService::getInteRactPub',
            cmd: {
                action: 'find',
                query: q
            },
            dSource: 1
        }
        try {
            this.b.read$(req, res, serviceInput)
                .subscribe((r) => {
                    console.log('InteRactPubService::read$()/r:', r)
                    this.b.i.code = 'InteRactPubService::Get';
                    const svSess = new SessionService();
                    svSess.sessResp.cd_token = req.post.dat.token;
                    svSess.sessResp.ttl = svSess.getTtl();
                    this.b.setAppState(true, this.b.i, svSess.sessResp);
                    this.b.cdResp.data = r;
                    this.b.respond(req, res)
                })
        } catch (e) {
            console.log('InteRactPubService::read$()/e:', e)
            this.b.err.push(e.toString());
            const i = {
                messages: this.b.err,
                code: 'InteRactPubService:update',
                app_msg: ''
            };
            await this.b.serviceErr(req, res, e, i.code)
            await this.b.respond(req, res)
        }
    }

    // /**
    //  * {
    //         "ctx": "App",
    //         "m": "InteRact",
    //         "c": "InteRactPub",
    //         "a": "GetCount",
    //         "dat": {
    //             "f_vals": [
    //                 {
    //                     "query": {
    //                         "select": [
    //                             "billName",
    //                             "billGuid"
    //                         ],
    //                         "where": {},
    //                         "take": 5,
    //                         "skip": 0
    //                     }
    //                 }
    //             ],
    //             "token": "08f45393-c10e-4edd-af2c-bae1746247a1"
    //         },
    //         "args": null
    //     }
    //  * @param req
    //  * @param res
    //  */
    getPaged(req, res) {
        const q = this.b.getQuery(req);
        console.log('InteRactPubService::getInteRactPubCount()/q:', q);
        const serviceInput = {
            serviceModel: InteRactPubModel,
            docName: 'InteRactPubService::getInteRactPubCount',
            cmd: {
                action: 'find',
                query: q
            },
            dSource: 1
        }
        this.b.readCount$(req, res, serviceInput)
            .subscribe((r) => {
                this.b.i.code = 'InteRactPubService::Get';
                const svSess = new SessionService();
                svSess.sessResp.cd_token = req.post.dat.token;
                svSess.sessResp.ttl = svSess.getTtl();
                this.b.setAppState(true, this.b.i, svSess.sessResp);
                this.b.cdResp.data = r;
                this.b.sqliteConn.close();
                this.b.respond(req, res)
            })
    }

    getViewPaged(req, res) {
        const q = this.b.getQuery(req);
        console.log('InteRactPubService::getInteRactPubCount()/q:', q);
        const serviceInput = {
            serviceModel: InteRactPubViewModel,
            docName: 'InteRactPubService::getInteRactPubCount',
            cmd: {
                action: 'find',
                query: q
            },
            dSource: 1
        }
        this.b.readCount$(req, res, serviceInput)
            .subscribe((r) => {
                this.b.i.code = 'InteRactPubService::Get';
                const svSess = new SessionService();
                svSess.sessResp.cd_token = req.post.dat.token;
                svSess.sessResp.ttl = svSess.getTtl();
                this.b.setAppState(true, this.b.i, svSess.sessResp);
                this.b.cdResp.data = r;
                this.b.sqliteConn.close();
                this.b.respond(req, res)
            })
    }

    delete(req, res) {
        const q = this.b.getQuery(req);
        console.log('InteRactPubService::delete()/q:', q)
        const serviceInput = {
            serviceModel: InteRactPubModel,
            docName: 'InteRactPubService::delete',
            cmd: {
                action: 'delete',
                query: q
            },
            dSource: 1
        }

        this.b.delete$(req, res, serviceInput)
            .subscribe((ret) => {
                this.b.cdResp.data = ret;
                this.b.respond(req, res)
            })
    }

    /**
     * {
            "ctx": "Sys",
            "m": "InteRact",
            "c": "InteRactPub",
            "a": "TestJsonQuery",
            "dat": {
                "f_vals": [
                    {
                        "query": {
                            "select": [
                                "InteRactPub_id",
                                "InteRactPub_name",
                                "InteRactPub_description",
                                "InteRactPub_guid",
                                "doc_id",
                                "InteRactPub_type_id",
                                "public",
                                "m",
                                "c",
                                "j_val"
                            ],
                            "where": [
                                {
                                    "conjType": "",// options null, or omit the property
                                    "dataType":"json",
                                    "field": "j_val",
                                    "jPath": "'$.domain.group.doc_id'",
                                    "operator": "=",
                                    "val": 11091
                                },
                                {
                                    "field": "doc_id",
                                    "fieldType": "json",
                                    "operator": "=",
                                    "val": 11121,
                                    "conjType": "and" 
                                }
                            ]
                        }
                    }
                ],
                "token": "fc735ce6-b52f-4293-9332-0181a49231c4"
            },
            "args": {}
        }
     * @param req
     * @param res
     */
    async testJsonQuery(req, res): Promise<any> {
        console.log('InteRactPubService::testJsonQuery()/01');
        let q: IQbInput = this.b.getQuery(req);
        console.log('InteRactPubService::testJsonQuery()/q:', q);
        const serviceInput = {
            serviceModel: InteRactPubModel,
            docName: 'InteRactPubService::testJsonQuery',
            cmd: {
                action: 'find',
                query: q
            },
            dSource: 1
        }
        try {
            // this.b.readJSON$(req, res, serviceInput)
            //     .subscribe((r) => {
            //         // console.log('InteRactPubService::testJsonQuery()/r:', r)
            //         this.b.i.code = 'InteRactPubService::Get';
            //         const svSess = new SessionService();
            //         svSess.sessResp.cd_token = req.post.dat.token;
            //         svSess.sessResp.ttl = svSess.getTtl();
            //         this.b.setAppState(true, this.b.i, svSess.sessResp);
            //         this.b.cdResp.data = r;
            //         this.b.respond(req, res)
            //     })
            const r = await this.b.readJSON(req, res, serviceInput)
            console.log('InteRactPubService::testJsonQuery()/02');
            console.log('InteRactPubService::testJsonQuery()/r:', r);
            this.b.i.code = 'InteRactPubService::Get';
            const svSess = new SessionService();
            console.log('InteRactPubService::testJsonQuery()/03');
            svSess.sessResp.cd_token = req.post.dat.token;
            svSess.sessResp.ttl = svSess.getTtl();
            this.b.setAppState(true, this.b.i, svSess.sessResp);
            console.log('InteRactPubService::testJsonQuery()/04');
            this.b.cdResp.data = r;
            console.log('InteRactPubService::testJsonQuery()/05');
            this.b.respond(req, res)
        } catch (e) {
            console.log('InteRactPubService::testJsonQuery()/03');
            console.log('InteRactPubService::testJsonQuery()/e:', e)
            this.b.err.push(e.toString());
            const i = {
                messages: this.b.err,
                code: 'InteRactPubService:update',
                app_msg: ''
            };
            await this.b.serviceErr(req, res, e, i.code)
            await this.b.respond(req, res)
        }
    }
}