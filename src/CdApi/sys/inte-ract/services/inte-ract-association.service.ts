import { BaseService } from '../../../sys/base/base.service';
import { SessionService } from '../../../sys/user/services/session.service';
import { CdService } from '../../../sys/base/cd.service';
import { CreateIParams, IRespInfo, IServiceInput, IUser } from '../../../sys/base/IBase';
import { InteRactAssociationModel } from '../models/inte-ract-association.model';
import { from, Observable } from 'rxjs';
import { getConnection } from 'typeorm';

export class InteRactAssociationService extends CdService {
    err: string[] = []; // error messages
    b: any; // instance of InteRactAssociationService
    cdToken: string;
    serviceModel: InteRactAssociationModel;
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
        this.serviceModel = new InteRactAssociationModel();
    }

    

    /**
     * {
             "ctx": "App",
             "m": "cd-accts",
             "c": "Bill",
             "a": "Create",
             "dat": {
                 "f_vals": [
                     {
                         "data": {
                             "billName": "myBill9",
                             "billDescription": "vzkle",
                             "billRate": 30, 
                             "billUnit": 14, 
                             "billType": 3,
                             "clientId": 85, 
                             "vendorId": 111162, 
                             "billDate": "2022-03-25 00:00:00",
                             "billTax": 0.18,
                             "billDiscount": 0.1, 
                             "billCost": 2020
                         }
                     }
                 ],
                 "token": "fc735ce6-b52f-4293-9332-0181a49231c4"
             },
             "args": {}
         }
     *  - check if vendor & client has acct/account while creating bill
        - set vendor/acct-account as parent while creating bill
        - set client/acct-account as child
        - create account while creating bill with client/acct-account as hiearchial parent
        - create accts/invoice while creating a bill
     * @param req 
     * @param res 
     */
    async create(req, res) {
        console.log('InteRactAssociationService::create()/01')
        const svSess = new SessionService();
        if (await this.validateCreate(req, res)) {
            const account = await this.beforeCreate(req, res);
            console.log('InteRactAssociationService::create()/account:', account)
            const serviceInput = {
                serviceInstance: this,
                serviceModel: InteRactAssociationModel,
                serviceModelInstance: this.serviceModel,
                docName: 'Create InteRactAssociation',
                dSource: 1,
            }
            const result = await this.b.create(req, res, serviceInput)
            console.log('InteRactAssociationService::create()/afterResult:', result)
            const afterResult = await this.afterCreate(req, res, result)
            console.log('InteRactAssociationService::create()/afterResult:', afterResult)
            this.b.i.app_msg = '';
            this.b.setAppState(true, this.b.i, svSess.sessResp);
            this.b.cdResp.data = afterResult;
            const r = await this.b.respond(req, res);
        } else {
            const r = await this.b.respond(req, res);
        }
    }

    async createI(req, res, createIParams: CreateIParams): Promise<InteRactAssociationModel | boolean> {
        console.log('InteRactAssociationService::createI()/createI()/01')
        if (await this.validateCreateI(req, res, createIParams)) {
            console.log('InteRactAssociationService::createI()/02')
            const account = await this.beforeCreateI(req, res, createIParams);
            console.log('InteRactAssociationService::createI()/account:', account)
            const result = this.b.createI(req, res, createIParams)
            const afterResult = await this.afterCreate(req, res, result)
            console.log('InteRactAssociationService::createI()/afterResult:', afterResult)
            return afterResult;
        } else {
            const r = await this.b.respond(req, res);
        }
    }

    async validateCreateI(req, res, createIParams) {
        console.log('InteRactAssociationService::validateCreateI()/01')
        let countInvalid = 0;
        // const validRequired = await this.b.validateRequired(req, res, this.cRules)
        // console.log('InteRactAssociationService::validateCreateI()/validRequired:', validRequired)

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
    async afterCreate(req, res, newBill: InteRactAssociationModel): Promise<any> {
        
    }

    async read(req, res, serviceInput: IServiceInput): Promise<any> {
        const q = this.b.getQuery(req);
        console.log('InteRactAssociationService::getBill/q:', q);
        try {
            this.b.read$(req, res, serviceInput)
                .subscribe((r) => {
                    // console.log('InteRactAssociationService::read$()/r:', r)
                    this.b.i.code = 'InteRactAssociationService::Get';
                    const svSess = new SessionService();
                    svSess.sessResp.cd_token = req.post.dat.token;
                    svSess.sessResp.ttl = svSess.getTtl();
                    this.b.setAppState(true, this.b.i, svSess.sessResp);
                    this.b.cdResp.data = r;
                    this.b.sqliteConn.close();
                    this.b.respond(req, res)
                })
        } catch (e) {
            console.log('InteRactAssociationService::read$()/e:', e)
            this.b.err.push(e.toString());
            const i = {
                messages: this.b.err,
                code: 'InteRactAssociationService:update',
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
    //         "m": "CdAccts",
    //         "c": "Bill",
    //         "a": "Update",
    //         "dat": {
    //             "f_vals": [
    //                 {
    //                     "query": {
    //                         "update": {
    //                             "billGuid": "azimio3"
    //                         },
    //                         "where": {
    //                             "billId": 8
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
        console.log('InteRactAssociationService::update()/01');
        let q = this.b.getQuery(req);
        q = this.beforeUpdate(q);
        const serviceInput = {
            serviceModel: InteRactAssociationModel,
            docName: 'InteRactAssociationService::update',
            cmd: {
                action: 'update',
                query: q
            },
            dSource: 1
        }
        console.log('InteRactAssociationService::update()/02')
        this.b.update$(req, res, serviceInput)
            .subscribe((ret) => {
                this.b.cdResp.data = ret;
                this.b.sqliteConn.close();
                this.b.respond(req, res)
            })
    }

    async updateI(req, res, q): Promise<any> {
        console.log('InteRactAssociationService::updateI()/01');
        // let q = this.b.getQuery(req);
        q = this.beforeUpdate(q);
        const serviceInput = {
            serviceModel: InteRactAssociationModel,
            docName: 'InteRactAssociationService::updateI',
            cmd: {
                action: 'update',
                query: q
            },
            dSource: 1
        }
        console.log('InteRactAssociationService::update()/02')
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
        console.log('InteRactAssociationService::validateCreate()/01')
        const validRequired = await this.b.validateRequired(req, res, this.cRules)
        console.log('InteRactAssociationService::validateCreate()/validRequired:', validRequired)
        return validRequired;
    }

    // /**
    //  *
    //  * {
    //         "ctx": "App",
    //         "m": "CdAccts",
    //         "c": "Bill",
    //         "a": "Get",
    //         "dat": {
    //             "f_vals": [
    //                 {
    //                     "query": {
    //                         "where": {
    //                             "billId": 8
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
    async getInteRactAssociation(req, res) {
        const q = this.b.getQuery(req);
        console.log('InteRactAssociationService::getBill/q:', q);
        const serviceInput = {
            serviceModel: InteRactAssociationModel,
            docName: 'InteRactAssociationService::getBill',
            cmd: {
                action: 'find',
                query: q
            },
            dSource: 1
        }
        try {
            this.b.read$(req, res, serviceInput)
                .subscribe((r) => {
                    console.log('InteRactAssociationService::read$()/r:', r)
                    this.b.i.code = 'InteRactAssociationService::Get';
                    const svSess = new SessionService();
                    svSess.sessResp.cd_token = req.post.dat.token;
                    svSess.sessResp.ttl = svSess.getTtl();
                    this.b.setAppState(true, this.b.i, svSess.sessResp);
                    this.b.cdResp.data = r;
                    this.b.respond(req, res)
                })
        } catch (e) {
            console.log('InteRactAssociationService::read$()/e:', e)
            this.b.err.push(e.toString());
            const i = {
                messages: this.b.err,
                code: 'InteRactAssociationService:update',
                app_msg: ''
            };
            await this.b.serviceErr(req, res, e, i.code)
            await this.b.respond(req, res)
        }
    }

    // /**
    //  * {
    //         "ctx": "App",
    //         "m": "CdAccts",
    //         "c": "Bill",
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
        console.log('InteRactAssociationService::getBillCount()/q:', q);
        const serviceInput = {
            serviceModel: InteRactAssociationModel,
            docName: 'InteRactAssociationService::getBillCount',
            cmd: {
                action: 'find',
                query: q
            },
            dSource: 1
        }
        this.b.readCount$(req, res, serviceInput)
            .subscribe((r) => {
                this.b.i.code = 'InteRactAssociationService::Get';
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
        console.log('InteRactAssociationService::delete()/q:', q)
        const serviceInput = {
            serviceModel: InteRactAssociationModel,
            docName: 'InteRactAssociationService::delete',
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

    ////////////////////////

    /**
     * User associates are available in 3 categories
     * 1. All consumer users: from inte_ract_association
     * 2. Pals from inte_ract_association
     * 3. All groups where the user belongs: from mGroupMember::getUserGroups($userID);
     *
     * This method allow clients to access these associations from one interface.
     * 
     * 
     * fAssociation()
    {
        return "
        inte_ract_association.inte_ract_association_id AS group_id,
        inte_ract_association.inte_ract_association_guid AS group_guid,
        inte_ract_association.inte_ract_association_name AS group_name,
        (SELECT null) AS member_name,
        (SELECT null) AS group_description,
        (SELECT null) AS group_owner_id,
        (SELECT null) AS 'doc_id',
        (SELECT null) AS 'group_type_id',
        (SELECT null) AS 'module_guid',
        (SELECT null) AS 'company_id',
        (SELECT null) AS 'is_public',
        (SELECT null) AS 'enabled'
        ";

        group_members_view
        ->join('group_member', 'group.group_guid', '=', 'group_member.member_guid')
            ->select(\DB::raw("
                " . self::fGroup() . ",
                " . self::fGroupMember() . "
                ")
    }
     */

     getAssociation(userID)
     {
        //  $groups = [];
        //  $obj = \DB::table('inte_ract_association')
        //      ->select(\DB::raw(self::fAssociation()))
        //      ->where('enabled', true);
        //  $ret1 = mB::qbGet(null, $filter, $obj, $order);
 
        //  $ret2 = mGroupMember::getUserGroups($userID);
        //  return array_merge($ret1, $ret2);
     }
}