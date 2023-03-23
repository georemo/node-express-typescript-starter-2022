
import { v4 as uuidv4 } from 'uuid';
import * as Lá from 'lodash';
import { CreateIParams, ICdRequest, ICdResponse, IControllerContext, IQuery, IRespInfo, IServiceInput, ISessResp, ObjectItem, CacheData, IQbInput } from './IBase';
import { EntityMetadata, getConnection, createConnection, ConnectionOptions, getConnectionManager, Connection, Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import moment from 'moment';
import { Database } from './connect';
import { ConnectSqlite } from './connectSqlite';
import { Response, Request, NextFunction } from 'express';
// import * as redis from 'redis';
import { createClient } from 'redis';
import { DocModel } from '../moduleman/models/doc.model';
import { SessionService } from '../user/services/session.service';
import { SessionModel } from '../user/models/session.model';
import { DocService } from '../moduleman/services/doc.service';
import config, { sqliteConfig } from '../../../config';
import { ConnectionTest } from './connection-test';
// import { createConnection } from 'typeorm';


const USER_ANON = 1000;
const INVALID_REQUEST = 'invalid request';

interface A {
    member: string;
}

export class BaseService {
    cdToken: string = "";
    cdResp: ICdResponse; // cd response
    cls = "";
    err: string[] = []; // error messages
    db;
    // sqliteDb;
    sqliteConn: Connection;
    cuid = USER_ANON;
    debug = false;
    pl;
    svSess: SessionService;
    sess: SessionModel[];
    i: IRespInfo = {
        messages: [],
        code: '',
        app_msg: ''
    };
    isInvalidFields = [];
    isRegRequest = false;
    redisClient;
    constructor() {
        // this.redisInit();
        this.cdResp = this.initCdResp();
    }
    models = [];
    sqliteModels = [];

    async init(req, res) {
        if (!this.db) {
            const db = await new Database();
            // client expected to input the required models
            this.models.forEach(async (model) => {
                await db.setConnEntity(model);
            });
            await db.getConnection();
        }
    }

    async initSqlite(req, res) {
        const iMax = 5;
        const i = 1;
        try {
            console.log('BaseService::initSqlite()/01')
            if (this.sqliteConn) {
                console.log('BaseService::initSqlite()/02')
            } else {
                console.log('BaseService::initSqlite()/03')
                // await this.setSLConn(i)
                this.sqliteConn = await this.connectDatabase(i)
            }
        } catch (e) {
            console.log('BaseService::initSqlite()/04')
            console.log('initSqlite()/Error:', e)
            // const p = e.toString().search('AlreadyHasActiveConnectionError');
            // if (p === -1 && i < iMax) {
            //     i++;
            //     await this.setSLConn(i);
            // }
            this.err.push(e.toString());
        }
    }

    async setSLConn(i) {
        const slConfig: ConnectionOptions = await sqliteConfig(`sqlite${i.toString()}`);
        try {
            await getConnection(`sqlite${i.toString()}`)
            this.sqliteConn = await getConnection(`sqlite${i.toString()}`).connect()
        } catch (error) {
            this.sqliteConn = await createConnection(slConfig)
        }
    }

    connSLClose() {
        if (this.sqliteConn) {
            this.sqliteConn.close();
        }
    }

    async connectDatabase(i: number = 1): Promise<Connection> {
        console.log('connectDatabase()/01')
        const opts: ConnectionOptions = await sqliteConfig(`sqlite${i.toString()}`);
        let connection: Connection | undefined
        try {
            console.log('connectDatabase()/02')
            const connectionManager = getConnectionManager()
            console.log('connectDatabase()/03')
            // calling connection.close() doesn't actually delete it from the map, so "has" will still be true;
            // so if this is anything but the first attempt, try to create the connection again
            if (connectionManager.has(opts.name) && i === 1) {
                console.log('connectDatabase()/04')
                // using a connection already connected (note this is a simplified version for lambda environment ...
                // see also: https://github.com/typeorm/typeorm/issues/3427
                connection = await connectionManager.get(`sqlite${i.toString()}`)
                console.log('connectDatabase()/05')
                if (!connection.isConnected) {
                    console.log('connectDatabase()/06')
                    throw new Error('Existing connection found but is not really connected')
                }
                console.log('connectDatabase()/07')
            } else {
                console.log('connectDatabase()/08')
                connection = await connectionManager.create(opts)
                console.log('connectDatabase()/09')
                await connection.connect()
            }
            console.log('connectDatabase()/10')
            return await connection
        } catch (e) {
            i++;
            console.log('connectDatabase()/11')
            if (i >= 5) {
                console.error('Giving up after too many connection attempts, throwing error')
                throw e
            }
            console.log('connectDatabase()/12')
            if (connection
                || connection.isConnected
                || connection.close()
            ) {
                console.log('connectDatabase()/13')
                const delayInMilliseconds = 200 * i;
                await setTimeout(async () => {
                    // connection.close();
                    return await this.connectDatabase(i)
                }, delayInMilliseconds);
            }
        }
    }

    repo(req, res, serviceModel) {
        try {
            console.log('BaseService::repo()/serviceModel:', serviceModel)
            return getConnection().getRepository(serviceModel);
        } catch (e) {
            return this.serviceErr(req, res, e, 'BaseService:repo');
        }
    }

    // /**
    //  * Connect to a database using the TypeORM ConnectionManager. Adds database to the manager if it is new. Tests database connection after connecting.
    //  * Reports the true current connection state regardless of:
    //  * - whether the connection already existed
    //  * - whether the database connection was lost silently after connecting previously.
    //  * @param database Database configuration model to try and create
    //  * @param stayConnected Will disconnect after testing by default. Change to true to keep the connection alive
    //  * @returns Whether the connection was successful
    //  */
    // async connect(database: ConnectionOptions, stayConnected = false): Promise<Connection> {
    //     let canConnect = false
    //     let con
    //     console.log('BaseService::connect()/01')
    //     const conMan = getConnectionManager()

    //     try {
    //         console.log('BaseService::connect()/02')
    //         if (conMan.has(database.name)) {
    //             console.log('BaseService::connect()/03')
    //             // If database already exists, get it
    //             con = await conMan.get(database.name)
    //         } else {
    //             console.log('BaseService::connect()/04')
    //             // If connection doesnst exist, add it
    //             con = await conMan.create(database)
    //         }
    //         console.log('BaseService::connect()/05')
    //         // // Try to connect
    //         // if (!con.isConnected) await con.connect()
    //         // console.log('BaseService::connect()/06')
    //         // // Store connection result
    //         // canConnect = con.isConnected
    //         // if (!canConnect) return false
    //         // console.log('BaseService::connect()/07')
    //         // // If TypeORM claims a connection, test it on the test table
    //         // try {
    //         //     console.log('BaseService::connect()/08')
    //         //     const conTest = (await con.getRepository(ConnectionTest).findOne()) || new ConnectionTest(0)
    //         //     conTest.i++
    //         //     conTest.save()
    //         // } catch (e) {
    //         //     canConnect = false
    //         // }

    //         // Disconnect if it was only a test. Is default
    //         if (!stayConnected) await con.close()
    //     } catch (e) {
    //         console.error(e)
    //     }

    //     return await con;
    // }

    /**
     * resolve the class that is being called
     * via module, controller(class) and action(method)
     * @param req
     * @param res
     * @param clsCtx
     * @returns
     */
    async resolveCls(req, res, clsCtx: IControllerContext) {
        try {
            console.log('BaseService::resolveCls()/01:')
            const eImport = await import(clsCtx.path);
            console.log('BaseService::resolveCls()/02:')
            const eCls = eImport[clsCtx.clsName];
            console.log('BaseService::resolveCls()/03:')
            const cls = new eCls();
            console.log('BaseService::resolveCls()/04:')
            if (this.sess) {
                // set sessData in req so it is available thoughout the bootstrap
                req.post.sessData = this.sess;
            }
            return await cls[clsCtx.action](req, res);
        } catch (e) {
            this.serviceErr(req, res, e, 'BaseService:resolveCls')
        }
    }

    async serviceErr(req, res, e, eCode, lineNumber = null) {
        const svSess = new SessionService();
        try {
            svSess.sessResp.cd_token = req.post.dat.token;
        } catch (er) {
            svSess.sessResp.cd_token = '';
            this.err.push(e.toString(er));
        }

        svSess.sessResp.ttl = svSess.getTtl();
        this.setAppState(true, this.i, svSess.sessResp);
        this.err.push(e.toString());
        const i = {
            messages: await this.err,
            code: eCode,
            app_msg: `Error at ${eCode}: ${e.toString()}`
        };
        await this.setAppState(false, i, svSess.sessResp);
        this.cdResp.data = [];
        return await this.respond(req, res);
    }

    async returnErr(req, res, i: IRespInfo) {
        const sess = this.getSess(req, res);
        await this.setAppState(false, i, sess);
        return await this.respond(req, res);
    }

    entryPath(pl: ICdRequest) {
        const ret = `../../${pl.ctx.toLowerCase()}/${this.toCdName(pl.m)}/controllers/${this.toCdName(pl.c)}.controller`;
        // console.log('BaseService::entryPath()/ret:', ret);
        return ret;
    }

    // from camel to hyphen seperated then to lower case
    toCdName(camel) {
        const ret = camel.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return ret;
    }

    async valid(req, res): Promise<boolean> {
        const pl = req.post;
        this.pl = pl;
        if (await this.noToken(req, res)) {
            return true;
        } else {
            if (!this.cdToken) {
                await this.setSess(req, res);
            }
            if (!this.instanceOfCdResponse(pl)) {
                return false;
            }
            if (!this.validFields(req, res)) {
                return false;
            }
        }
        return true;
    }

    async noToken(req, res) {
        console.log('BaseService::noToken()/01')
        const pl = req.post;
        const ctx = pl.ctx;
        const m = pl.m;
        const c = pl.c;
        const a = pl.a;
        let ret: boolean = false;
        if (!ctx || !m || !c || !a) {
            this.setInvalidRequest(req, res, 'BaseService:noTocken:01');
        }
        if (m === 'User' && (a === 'Login' || a === 'Register')) {
            console.log('BaseService::noToken()/02')
            if (m === 'User' && a === 'Register') {
                console.log('BaseService::noToken()/03')
                this.isRegRequest = true;
            }
            ret = true;
        }
        // exempt reading list of consumers. Required during registration when token is not set yet
        if (m === 'Moduleman' && c === 'Consumer' && a === 'GetAll') {
            ret = true;
        }
        // exempt anon menu calls
        if (m === 'Moduleman' && c === 'Modules' && a === 'GetAll') {
            ret = true;
        }
        // exampt mpesa call backs
        if ('MSISDN' in pl) {
            ret = true;
        }
        console.log('BaseService::noToken()/returning ret:', ret)
        return ret;
    }

    isRegisterRequest() {
        return this.isRegRequest;
    }

    /**
     * implement validation of fields
     * @param req
     * @param res
     * @returns
     */
    validFields(req, res) {
        /**
         * 1. deduce model directory from the req.post
         * 2. import model
         * 3. verify if fields exists
         */
        return true;
    }

    instanceOfCdResponse(object: any): boolean {
        return 'ctx' in object && 'm' in object && 'c' in object && 'a' in object && 'dat' in object && 'args' in object;
    }

    /**
     * for setting up response details
     * @param Success
     * @param Info
     * @param Sess
     */
    async setAppState(succ: boolean, i: IRespInfo | null, ss: ISessResp | null) {
        if (succ === false) {
            this.cdResp.data = [];
        }
        this.cdResp.app_state = {
            success: succ,
            info: i,
            sess: ss,
            cache: {},
            sConfig: {
                usePush: config.usePolling,
                usePolling: config.usePush,
                useCacheStore: config.useCacheStore,
            }
        };
    }

    setInvalidRequest(req, res, eCode: string) {
        this.err.push(INVALID_REQUEST);
        const i: IRespInfo = {
            messages: this.err,
            code: eCode,
            app_msg: ''
        }
        const sess = this.getSess(req, res);
        this.setAppState(false, i, sess);
        res.status(200).json(this.cdResp);
    }

    getSess(req, res) {
        return null; // yet to implement
    }

    sessIsValid(pl) {
        // const sess = new SessionService()
    }

    initCdResp(): ICdResponse {
        return {
            app_state: {
                success: false,
                info: {
                    messages: [],
                    code: '',
                    app_msg: '',
                },
                sess: {
                    cd_token: this.getGuid(),
                    jwt: null,
                    ttl: 0,
                },
                cache: {},
                sConfig: {
                    usePush: config.usePolling,
                    usePolling: config.usePush,
                    useCacheStore: config.useCacheStore,
                }
            },
            data: null
        }
    }

    async respond(req, res) {
        console.log('**********starting respond(res)*********');
        // res.status(200).json(this.cdResp);
        let ret;
        try {
            console.log('BaseService::respond(res)/this.pl:', JSON.stringify(req.post));
            console.log('BaseService::respond(res)/this.cdResp:', JSON.stringify(this.cdResp));
            ret = res.status(200).json(this.cdResp);
        } catch (e) {
            this.err.push(e.toString())
        }
        return ret;
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param result 
     * @param iCode 
     */
    successResponse(req, res, result,appMsg = null) {
        if(appMsg){
            this.i.app_msg = appMsg;
        }
        const svSess = new SessionService();
        svSess.sessResp.cd_token = req.post.dat.token;
        svSess.sessResp.ttl = svSess.getTtl();
        this.setAppState(true, this.i, svSess.sessResp);
        this.cdResp.data = result;
        this.respond(req, res)
    }

    /**
     * 
     * @param req 
     * @param extData // used to target any property of 'f_vals' other than 'data'
     * @param fValsIndex // used if f_val items are multiple
     * @returns 
     */
    getPlData(req, extData: string | null = null, fValsIndex: number | null = null) {
        console.log('BaseService::setPlData()/01');
        let ret = null;
        const svSess = new SessionService()
        if (this.validatePlData(req, extData)) {
            try {
                if (extData) {
                    console.log('BaseService::setPlData()/02')
                    if (fValsIndex) {
                        ret = req.post.dat.f_vals[fValsIndex][extData];
                    } else {
                        ret = req.post.dat.f_vals[0][extData];
                    }
                } else {
                    console.log('BaseService::setPlData()/03');
                    if (fValsIndex) {
                        ret = req.post.dat.f_vals[fValsIndex].data;
                    } else {
                        ret = req.post.dat.f_vals[0].data;
                    }
                }
                console.log('BaseService::setPlData()/04');
                return ret;
            } catch (e) {
                this.setAlertMessage(e.toString(), svSess, false)
                return {}
            }
        } else {
            this.setAlertMessage('invalid validation request', svSess, false)
            return {}
        }
    }

    async setPlData(req, item: ObjectItem, extData: string = null): Promise<void> {
        console.log('BaseService::setPlData()/item:', item);
        if (extData) {
            console.log('BaseService::setPlData()/extData:', extData);
            console.log('BaseService::setPlData()/req.post.dat.f_vals[0][extData]:', req.post.dat.f_vals[0][extData]);
            req.post.dat.f_vals[0][extData][item.key] = item.value;
        } else {
            req.post.dat.f_vals[0].data[item.key] = item.value;
        }
        console.log('BaseService::setPlData()/req.post.dat.f_vals[0]:', req.post.dat.f_vals[0]);
    }

    /**
     * prevent a situation where either
     * 'data' property is missing or
     * extData property is missing
     * @param req 
     * @param res 
     * @param extData 
     */
    async validatePlData(req, extData) {
        const svSess = new SessionService()
        let ret = false;
        if (extData) {
            if (extData in req.post.dat.f_vals[0]) {
                ret = true;
            } else {
                this.setAlertMessage('BaseService::validatePlData/requested property is missing', svSess, false)
            }
        } else {
            if ('data' in req.post.dat.f_vals[0]) {
                ret = true;
            } else {
                this.setAlertMessage('BaseService::validatePlData/requested property is missing', svSess, false)
            }
        }
    }

    getReqToken(req) {
        const r: ICdRequest = req.post
        return r.dat.token
    }

    // getPlQuery(req, extData = null): Promise<any> {
    //     if (extData) {
    //         return req.post.dat.f_vals[0][extData];
    //     } else {
    //         return req.post.dat.f_vals[0].data;
    //     }
    // }

    async setCreateIData(req, controllerData: ICdRequest, item: ObjectItem): Promise<ICdRequest> {
        // console.log('BaseService::setCreateIData()/item:', item);
        // console.log('BaseService::setCreateIData()/controllerData(1):', controllerData);
        controllerData[item.key] = item.value;
        // console.log('BaseService::setCreateIData()/controllerData(2):', controllerData);
        return await controllerData;
    }

    getQuery(req) {
        console.log('BaseService::getQuery()/01')
        console.log('BaseService::getQuery()/req.post.dat:', JSON.stringify(req.post.dat))
        const q = req.post.dat.f_vals[0].query;
        this.pl = req.post;
        if (q) {
            return q;
        } else {
            return {};
        }
    }

    async getEntityPropertyMap(model) {
        const entityMetadata: EntityMetadata = await getConnection().getMetadata(model);
        const cols = await entityMetadata.columns;
        const colsFiltd = await cols.map(async (col) => {
            return await {
                propertyAliasName: col.propertyAliasName,
                databaseNameWithoutPrefixes: col.databaseNameWithoutPrefixes,
                type: col.type
            };
        });
        return colsFiltd;
    }

    async getEntityPropertyMapSL(req, res, model) {
        await this.initSqlite(req, res);
        const entityMetadata: EntityMetadata = await this.sqliteConn.getMetadata(model);
        const cols = await entityMetadata.columns;
        // console.log('BaseService::getEntityPropertyMapSL()/cols:', cols)
        const colsFiltdArr = [];
        const colsFiltd = await cols.map(async (col) => {
            const ret = {
                propertyAliasName: await col.propertyAliasName,
                databaseNameWithoutPrefixes: await col.databaseNameWithoutPrefixes,
                type: await col.type
            };
            console.log('getEntityPropertyMapSL()/ret:', ret);
            colsFiltdArr.push(ret);
            return ret;
        });
        console.log('BaseService::getEntityPropertyMapSL()/colsFiltd:', await colsFiltd)
        console.log('BaseService::getEntityPropertyMapSL()/colsFiltdArr:', await colsFiltdArr)
        return colsFiltdArr;
    }

    async validateUnique(req, res, params) {
        console.log('BaseService::validateUnique()/01')
        console.log('BaseService::validateUnique()/req.post:', JSON.stringify(req.post))
        console.log('BaseService::validateUnique()/req.post.dat.f_vals[0]:', JSON.stringify(req.post.dat.f_vals[0]))
        console.log('BaseService::validateUnique()/params:', params)
        await this.init(req, res);
        // assign payload data to this.userModel
        //** */ params.controllerInstance.userModel = this.getPlData(req);
        // set connection
        // const baseRepository = getConnection().getRepository(params.model);
        console.log('BaseService::validateUnique()/repo/model:', params.model)
        const baseRepository: any = await this.repo(req, res, params.model)
        // get model properties
        const propMap = await this.getEntityPropertyMap(params.model).then((result) => {
            // console.log('validateUnique()/result:', result)
            return result;
        });
        // console.log('validateUnique()/propMap:', await propMap)
        // const strQueryItems = await this.getQueryItems(req, propMap, params)
        const strQueryItems = await this.getQueryItems(req, params)
        console.log('BaseService::validateUnique()/strQueryItems:', strQueryItems)
        // convert the string items into JSON objects
        // const arrQueryItems = await strQueryItems.map(async (item) => {
        //     console.log('validateUnique()/item:', await item)
        //     return await JSON.parse(item);
        // });

        // console.log('validateUnique()/arrQueryItems:', arrQueryItems)
        // const filterItems = await JSON.parse(strQueryItems)
        const filterItems = await strQueryItems
        console.log('BaseService::validateUnique()/filterItems:', filterItems)
        // execute the query
        const results = await baseRepository.count({
            where: await filterItems
        });
        console.log('BaseService::validateUnique()/results:', results)
        // return boolean result
        let ret = false;
        if (results === 0) {
            ret = true;
        } else {
            this.err.push('duplicate not allowed');
            // console.log('BaseService::create()/Error:', e.toString())
            const i = {
                messages: this.err,
                code: 'BaseService:validateUnique',
                app_msg: ''
            };
            await this.setAppState(false, i, null);
        }
        console.log('BaseService::validateUnique()/ret:', ret)
        return ret;
    }

    // async getQueryItems(req, propMap: any[], params: any) {
    async getQueryItems(req, params, fields = null) {
        ////////////////////////////////////////////////
        if (fields === null) {
            fields = req.post.dat.f_vals[0].data
        }
        const entries = Object.entries(fields);
        // console.log('getQueryItems()/entries:', entries)
        const entryObjArr = entries.map((e) => {
            // console.log('getQueryItems()/e:', e)
            const k = e[0];
            const v = e[1];
            const ret = JSON.parse(`[{"key":"${k}","val":"${v}","obj":{"${k}":"${v}"}}]`)
            // console.log('getQueryItems()/ret:', ret)
            return ret;
        })
        // console.log('getQueryItems()/entryObjArr:', entryObjArr)
        const cRules: string[] = params.controllerInstance.cRules.noDuplicate;
        const qItems = entryObjArr.filter(f => this.isNoDuplicate(f, cRules))
        // console.log('getQueryItems()/qItems:', qItems)
        const result: any = {};
        qItems.forEach(async (f: any) => {
            result[f[0].key] = f[0].val;
        })
        return await result;
    }

    /**
     * filter mapping for no-duplicate-fields
     * - the result is used in validateUnique(req, res, params)
     * to query existence of duplicate entries
     * @param name
     * @param alias
     * @param cRules
     * @returns
     */
    async isNoDuplicateField(name, alias, cRules) {
        const ndFieldNames = cRules.noDuplicate as object[];
        const noDuplicateField = ndFieldNames.filter(fieldName => alias === fieldName);
        let ret = false;
        if (noDuplicateField.length > 0) {
            ret = true;
        } else {
            ret = false;
        }
        return ret;
    }

    isNoDuplicate(fData, cRules = []) {
        // console.log('isNoDuplicate()/cRules:', cRules)
        // console.log('isNoDuplicate()/fData:', fData)
        return cRules.filter((fieldName => fieldName === fData[0].key)).length > 0;
        // console.log('isNoDuplicate()/field:', dupFields)
        // let ret = false;
        // if (dupFields.length > 0) {
        //     ret = true;
        // } else {
        //     ret = false;
        // }
        // return ret;
    }

    async validateRequired(req, res, cRules) {
        const svSess = new SessionService();
        await this.init(req, res);
        const rqFieldNames = cRules.required as string[];
        this.isInvalidFields = await rqFieldNames.filter((fieldName) => {
            if (!(fieldName in this.getPlData(req))) { // required field is missing
                return fieldName;
            }
        });
        if (this.isInvalidFields.length > 0) {
            // console.log('BaseService::validateRequired()/cRules:', JSON.stringify(cRules))
            // console.log('BaseService::validateRequired()/isInvalid:', JSON.stringify(this.isInvalidFields))
            this.i.app_msg = `the required fields ${this.isInvalidFields.join(', ')} is missing`;
            this.i.messages.push(this.i.app_msg)
            this.setAppState(false, this.i, svSess.sessResp);
            return false;
        } else {
            return true;
        }
    }

    async validateUniqueI(req, res, params) {
        console.log('BaseService::validateUnique()/01')
        console.log('BaseService::validateUnique()/req.post:', JSON.stringify(req.post))
        console.log('BaseService::validateUnique()/req.post.dat.f_vals[0]:', JSON.stringify(req.post.dat.f_vals[0]))
        console.log('BaseService::validateUnique()/params:', params)
        await this.init(req, res);
        // assign payload data to this.userModel
        //** */ params.controllerInstance.userModel = this.getPlData(req);
        // set connection
        // const baseRepository = getConnection().getRepository(params.model);
        console.log('BaseService::validateUnique()/repo/model:', params.model)
        const baseRepository: any = await this.repo(req, res, params.model)
        // get model properties
        const propMap = await this.getEntityPropertyMap(params.model).then((result) => {
            // console.log('validateUnique()/result:', result)
            return result;
        });
        // console.log('validateUnique()/propMap:', await propMap)
        // const strQueryItems = await this.getQueryItems(req, propMap, params)
        const strQueryItems = await this.getQueryItems(req, params)
        console.log('BaseService::validateUnique()/strQueryItems:', strQueryItems)
        // convert the string items into JSON objects
        // const arrQueryItems = await strQueryItems.map(async (item) => {
        //     console.log('validateUnique()/item:', await item)
        //     return await JSON.parse(item);
        // });

        // console.log('validateUnique()/arrQueryItems:', arrQueryItems)
        // const filterItems = await JSON.parse(strQueryItems)
        const filterItems = await strQueryItems
        console.log('BaseService::validateUnique()/filterItems:', filterItems)
        // execute the query
        const results = await baseRepository.count({
            where: await filterItems
        });
        console.log('BaseService::validateUnique()/results:', results)
        // return boolean result
        let ret = false;
        if (results === 0) {
            ret = true;
        } else {
            this.err.push('duplicate not allowed');
            // console.log('BaseService::create()/Error:', e.toString())
            const i = {
                messages: this.err,
                code: 'BaseService:validateUnique',
                app_msg: ''
            };
            await this.setAppState(false, i, null);
        }
        console.log('BaseService::validateUnique()/ret:', ret)
        return ret;
    }

    /**
     *
     * used where create is called remotely
     * Note that both create() and createI(), are trailed with
     * doc data, with dates, user and other application information
     * used in document tracking
     * @param req
     * @param res
     * @param serviceInput
     * @returns
     */
    async create(req, res, serviceInput: IServiceInput) {
        console.log('BaseService::create()/01')
        await this.init(req, res);
        let newDocData;
        try {
            console.log('BaseService::create()/02')
            console.log('BaseService::create()/serviceInput0:', serviceInput)
            console.log('BaseService::create()/021')
            newDocData = await this.saveDoc(req, res, serviceInput);
            console.log('BaseService::create()/022')
            console.log('BaseService::create()/newDocData:', newDocData)
        } catch (e) {
            console.log('BaseService::create()/03')
            this.serviceErr(req, res, e, 'BaseService:create/savDoc')
        }
        let serviceRepository = null;
        try {
            console.log('BaseService::create()/04')
            console.log('BaseService::create()/serviceInput1:', serviceInput)
            // serviceRepository = await getConnection().getRepository(serviceInput.serviceModel);
            console.log('BaseService::create()/repo/model:', serviceInput.serviceModel)
            serviceRepository = await this.repo(req, res, serviceInput.serviceModel)
        } catch (e) {
            console.log('BaseService::create()/serviceInput2:', serviceInput)
            console.log('BaseService::create()/05')
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:create/getConnection',
                app_msg: ''
            };
            await this.serviceErr(req, res, e, 'BaseService:create')
            return this.cdResp;
        }

        try {
            console.log('BaseService::create()/06')
            let modelInstance = serviceInput.serviceModelInstance;
            if ('dSource' in serviceInput) {
                console.log('BaseService::create()/07')
                if (serviceInput.dSource === 1) { // data source is provided by the req...data.
                    // req.post.dat.f_vals[0].data.doc_id = await newDocData.docId;
                    console.log('BaseService::create()/08')
                    console.log('BaseService::create()/newDocData:', newDocData)
                    await this.setPlData(req, { key: 'docId', value: await newDocData.docId }) // set docId
                    console.log('BaseService::create()/09')
                    const serviceData = await this.getServiceData(req, serviceInput);
                    console.log('BaseService::create()/10')
                    console.log('BaseService::create()/serviceData:', serviceData);
                    modelInstance = await this.setEntity(serviceInput, serviceData);
                    console.log('BaseService::create()/11')
                    return await serviceRepository.save(await modelInstance);
                }
                console.log('BaseService::create()/12')
            }
        } catch (e) {
            console.log('BaseService::create()/13')
            this.err.push(e.toString());
            console.log('BaseService::create()/Error:', e.toString())
            const i = {
                messages: this.err,
                code: 'BaseService:create',
                app_msg: ''
            };
            await this.setAppState(false, i, null);
            await this.serviceErr(req, res, e, 'BaseService:create')
            // return this.cdResp;
        }
    }

    async createSL(req, res, serviceInput: IServiceInput) {
        try {
            const repo: any = await this.sqliteConn.getRepository(serviceInput.serviceModel);
            const pl = this.getPlData(req);
            return await repo.save(pl);
        } catch (e) {
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BillService:create',
                app_msg: ''
            };
            await this.serviceErr(req, res, e, 'BillService:create')
            return this.cdResp;
        }
    }

    /**
     * similar to create() but
     * used where create is called internally
     * Note that both create and createI, are trailed with
     * doc data, with dates, user and other application information
     * used in document tracking
     * @param req
     * @param res
     * @param createIParams
     */
    async createI(req, res, createIParams: CreateIParams): Promise<any> {
        console.log('BaseService::createI()/01')
        await this.init(req, res);
        let newDocData;
        let ret: any;
        try {
            console.log('BaseService::createI()/02')
            newDocData = await this.saveDoc(req, res, createIParams.serviceInput);
            // console.log('BaseService::createI()/newDocData:', newDocData)
        } catch (e) {
            console.log('BaseService::createI()/03')
            this.serviceErr(req, res, e, 'BaseService:createI()/savDoc')
        }
        let serviceRepository = null;
        try {
            console.log('BaseService::createI()/04')
            // serviceRepository = await getConnection().getRepository(createIParams.serviceInput.serviceModel);
            console.log('BaseService::createI()/repo/model:', createIParams.serviceInput.serviceModel)
            serviceRepository = await this.repo(req, res, createIParams.serviceInput.serviceModel)
        } catch (e) {
            console.log('BaseService::createI()/05')
            console.log('BaseService::createI()/Error/01')
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:create/getConnection',
                app_msg: 'problem creating connection'
            };
            console.log('BaseService::createI()/06')
            await this.serviceErr(req, res, e, 'BaseService:create/getConnection')
            return this.cdResp;
        }

        try {
            console.log('BaseService::createI()/07')
            let modelInstance = createIParams.serviceInput.serviceModelInstance;
            if ('dSource' in createIParams.serviceInput) {
                console.log('BaseService::createI()/08')
                if (createIParams.serviceInput.dSource === 1) {
                    console.log('BaseService::createI()/09')
                    console.log('BaseService::createI()/newDocData:', newDocData)
                    console.log('BaseService::createI()/createIParams:', createIParams)
                    console.log('BaseService::createI()/createIParams.controllerData:', createIParams.controllerData)
                    createIParams.controllerData = await this.setCreateIData(req, createIParams.controllerData, { key: 'docId', value: await newDocData.docId })
                    console.log('BaseService::createI()/091')
                    const serviceData = await createIParams.controllerData;
                    console.log('BaseService::createI()/092')
                    modelInstance = await this.setEntity(createIParams.serviceInput, await serviceData);
                    console.log('BaseService::createI()/093')
                    ret = await serviceRepository.save(await modelInstance);
                }
            }
        } catch (e) {
            console.log('BaseService::createI()/10')
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:createI',
                app_msg: 'problem saving data'
            };
            await this.serviceErr(req, res, e, 'BaseService:createI')
            ret = false;
        }
        console.log('BaseService::createI()/11')
        return await ret;
    }


    async saveDoc(req, res, serviceInput: IServiceInput) {
        await this.init(req, res);
        console.log('BaseService::saveDoc()/01')
        // const docRepository: any = await getConnection().getRepository(DocModel);
        console.log('BaseService::saveDoc()/repo/model:', DocModel)
        const docRepository: any = await this.repo(req, res, DocModel)
        console.log('BaseService::saveDoc()/02')
        const doc = await this.setDoc(req, res, serviceInput);
        console.log('BaseService::saveDoc()/03')
        console.log('BaseService::saveDoc()/doc:', JSON.stringify(doc))
        return await docRepository.save(doc);
    }

    async addParam(req, param) {
        return { ...req.post.dat.f_vals[0].data, ...param }; // merge objects
    }

    async setDoc(req, res, serviceInput) {
        console.log('BaseService::setDoc()/01')
        if (!this.cdToken) {
            console.log('BaseService::setDoc()/02')
            await this.setSess(req, res);
        }
        console.log('BaseService::setDoc()/03')
        const dm: DocModel = new DocModel();
        const iDoc = new DocService();
        dm.docFrom = this.cuid;
        dm.docName = serviceInput.docName;
        console.log('BaseService::setDoc()/04')
        dm.docTypeId = await iDoc.getDocTypeId(req, res);
        console.log('BaseService::setDoc()/05')
        dm.docDate = await this.mysqlNow();
        console.log('BaseService::setDoc()/06')
        return await dm;
    }

    async setSess(req, res) {
        console.log('BaseService::setSess()/01')
        this.svSess = new SessionService();
        if (await !this.cdToken) {
            console.log('BaseService::setSess()/02')
            try {
                console.log('BaseService::setSess()/req.post:', req.post)
                if ('sessData' in req.post) {
                    console.log('BaseService::setSess()/021')
                    console.log('BaseService::setSess()/req.post.sessData:', req.post.sessData)
                    this.sess = [req.post.sessData]
                } else {
                    console.log('BaseService::setSess()/022')
                    this.sess = await this.svSess.getSession(req, res);
                }
                console.log('BaseService::setSess()/03')
                console.log('BaseService::setSess()/this.sess:', this.sess)
                if (this.sess) {
                    console.log('BaseService::setSess()/04')
                    if (this.sess.length > 0) {
                        console.log('BaseService::setSess()/05')
                        console.log('this.sess:', this.sess);
                        this.setCuid(this.sess[0].currentUserId);
                        this.cdToken = await this.sess[0].cdToken;
                    } else {
                        console.log('BaseService::setSess()/06')
                        const noToken = await this.noToken(req, res)
                        console.log('BaseService::setSess()/noToken:', noToken)
                        if (noToken === false) {
                            this.i = {
                                messages: this.err,
                                code: 'BaseService:setSess1',
                                app_msg: 'invalid session'
                            };
                            // do not report 'invalid session' if the session is 'noToken' required.
                            await this.serviceErr(req, res, this.i.app_msg, this.i.code)
                            // this.respond(req, res);
                        }
                    }
                } else {
                    console.log('BaseService::setSess()/07')
                    this.i = {
                        messages: this.err,
                        code: 'BaseService:setSess2',
                        app_msg: 'invalid session'
                    };
                    await this.serviceErr(req, res, this.i.app_msg, this.i.code)
                    this.respond(req, res);
                }
            } catch (e) {
                console.log('BaseService::setSess()/08')
                this.i = {
                    messages: this.err,
                    code: 'BaseService:setSess3',
                    app_msg: e.toString()
                };
                // await this.serviceErr(req, res, this.i.app_msg, this.i.code)
                await this.setAlertMessage(e.toString(), this.svSess, false)
                // this.respond(req, res);
            }

        }
    }

    async getServiceData(req, serviceInput: IServiceInput) {
        if (serviceInput.data) {
            return await serviceInput.data;
        } else {
            return await this.getPlData(req);
        }
    }

    async setPropertyMapArr(serviceInput) {
        const propMap = await this.getEntityPropertyMap(serviceInput.serviceModel);
        const propMapArr = [];
        await propMap.forEach(async (field: any) => {
            const f = await field;
            const aName = f.propertyAliasName;
            const rName = f.databaseNameWithoutPrefixes;
            propMapArr.push({ alias: aName, fieldName: rName });
        });
        return propMapArr;
    }

    async setEntity(serviceInput: IServiceInput, serviceData: any): Promise<any> {
        const propMapArr = await this.setPropertyMapArr(serviceInput);
        const serviceInstance = serviceInput.serviceModelInstance;
        propMapArr.forEach(async (field: any, i) => {
            serviceInstance[field.alias] = serviceData[field.alias];
        });
        return await serviceInstance;
    }

    async mysqlNow() {
        console.log('BaseService::mysqlNow()/01')
        const now = new Date();
        const date = await moment(
            now,
            'ddd MMM DD YYYY HH:mm:ss'
        );
        console.log('BaseService::mysqlNow()/02')
        const ret = await date.format('YYYY-MM-DD HH:mm:ss'); // convert to mysql date
        console.log('BaseService::mysqlNow()/03')
        return ret;
    }

    getGuid() {
        return uuidv4();
    }

    getCuid(req) {
        return req.post.sessData[0].currentUserId;
    }

    setCuid(cuid: number) {
        this.cuid = cuid;
    }

    async read(req, res, serviceInput: IServiceInput): Promise<any> {
        console.log('BaseService::read()/01')
        await this.init(req, res);
        console.log('BaseService::read()/02')
        // console.log('BaseService::read()/repo/model:', JSON.stringify(serviceInput.serviceModel))
        const repo: any = await this.repo(req, res, serviceInput.serviceModel);
        console.log('BaseService::read()/03')
        let r: any = null;
        switch (serviceInput.cmd.action) {
            case 'find':
                try {
                    console.log('BaseService::read()/031')
                    r = await repo.find(serviceInput.cmd.query);
                    console.log('BaseService::read()/04')
                    if (serviceInput.extraInfo) {
                        console.log('BaseService::read()/05')
                        return {
                            result: r,
                            fieldMap: await this.feildMap(serviceInput)
                        }
                    } else {
                        console.log('BaseService::read()/06')
                        return await r;
                    }
                }
                catch (err) {
                    console.log('BaseService::read()/07')
                    return await this.serviceErr(req, res, err, 'BaseService:read');
                }
                break;
            case 'count':
                try {
                    r = await repo.count(serviceInput.cmd.query);
                    console.log('BaseService::read()/r:', r)
                    return r;
                }
                catch (err) {
                    return await this.serviceErr(req, res, err, 'BaseService:read');
                }
                break;
        }


        // this.serviceErr(res, err, 'BaseService:read');
    }

    read$(req, res, serviceInput): Observable<any> {
        return from(this.read(req, res, serviceInput));
    }

    async readCount(req, res, serviceInput): Promise<any> {
        await this.init(req, res);
        // const repo = getConnection().getRepository(serviceInput.serviceModel);
        console.log('BaseService::readCount()/repo/model:', serviceInput.serviceModel)
        const repo: any = await this.repo(req, res, serviceInput.serviceModel)
        try {
            const [result, total] = await repo.findAndCount(
                this.getQuery(req)
            );
            return {
                items: result,
                count: total
            }
        }
        catch (err) {
            return await this.serviceErr(req, res, err, 'BaseService:readCount');
        }
    }

    readCount$(req, res, serviceInput): Observable<any> {
        return from(this.readCount(req, res, serviceInput));
    }

    async readPaged(req, res, serviceInput): Promise<any> {
        await this.init(req, res);
        // const repo = getConnection().getRepository(serviceInput.serviceModel);
        console.log('BaseService::readPaged()/repo/model:', serviceInput.serviceModel)
        const repo: any = await this.repo(req, res, serviceInput.serviceModel)
        try {
            const [result, total] = await repo.findAndCount(
                this.getQuery(req)
            );
            return {
                items: result,
                count: total
            }
        }
        catch (err) {
            return await this.serviceErr(req, res, err, 'BaseService:readPaged');
        }
    }

    readPaged$(req, res, serviceInput): Observable<any> {
        return from(this.readPaged(req, res, serviceInput));
    }

    async readCountSL(req, res, serviceInput): Promise<any> {
        await this.initSqlite(req, res);
        try {
            const repo = this.sqliteConn.getRepository(serviceInput.serviceModel);
            const meta = await this.getEntityPropertyMapSL(req, res, serviceInput.serviceModel);
            const [result, total] = await repo.findAndCount(
                this.getQuery(req)
            );
            return {
                metaData: meta,
                items: result,
                count: total
            }
        }
        catch (err) {
            return await this.serviceErr(req, res, err, 'BaseService:readCount');
        }
    }

    readCountSL$(req, res, serviceInput): Observable<any> {
        return from(this.readCountSL(req, res, serviceInput));
    }

    async feildMap(serviceInput) {
        const meta = getConnection().getMetadata(serviceInput.serviceModel).columns;
        return await meta.map((c) => {
            return { propertyPath: c.propertyPath, givenDatabaseName: c.givenDatabaseName, dType: c.type };
        });
    }

    async feildMapSL(req, res, serviceInput: IServiceInput) {
        await this.initSqlite(req, res);
        // console.log('BaseService::feildMapSL()/this.sqliteConn:', this.sqliteConn)
        console.log('BaseService::feildMapSL()/serviceInput:', serviceInput.serviceModel)
        const meta = await this.sqliteConn.getMetadata(serviceInput.serviceModel).columns;
        return await meta.map(async (c) => {
            return { propertyPath: await c.propertyPath, givenDatabaseName: await c.givenDatabaseName, dType: await c.type };
        });
    }

    async get(req, res, model: any, q: IQuery): Promise<any> {
        console.log('BaseService::get/q:', q);
        const serviceInput: IServiceInput = {
            serviceModel: model,
            docName: 'BaseService::get',
            cmd: {
                action: 'find',
                query: q
            },
            dSource: 1
        }
        try {
            return await this.read(req, res, serviceInput)
        } catch (e) {
            console.log('CdObjService::read$()/e:', e)
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:update',
                app_msg: ''
            };
            this.serviceErr(req, res, e, i.code)
            return await new Promise(
                (resolve, reject) => resolve(null)
            );
        }
    }

    get$(req, res, model: any, q: IQuery): Observable<any> {
        console.log('BaseService::get/q:', q);
        const serviceInput: IServiceInput = {
            serviceModel: model,
            docName: 'BaseService::get',
            cmd: {
                action: 'find',
                query: q
            },
            dSource: 1
        }
        try {
            return this.read$(req, res, serviceInput)
        } catch (e) {
            console.log('BaseService::read$()/e:', e)
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:get$',
                app_msg: ''
            };
            this.serviceErr(req, res, e, i.code)
            return from(null);
        }
    }

    async readSL(req, res, serviceInput: IServiceInput): Promise<any> {
        try {
            this.initSqlite(req, res);
            const repo = this.sqliteConn.getRepository(serviceInput.serviceModel);
            const svSess = new SessionService();
            // const billRepository = this.sqliteConn.getRepository(BillModel)
            // const allBills = await billRepository.find()
            // console.log('allBills:', allBills)
            // this.i.app_msg = '';
            // this.setAppState(true, this.i, svSess.sessResp);
            // this.cdResp.data = allBills;
            // const r = await this.respond(req, res);

            let r: any = null;
            switch (serviceInput.cmd.action) {
                case 'find':
                    try {
                        r = await repo.find(serviceInput.cmd.query);
                        if (serviceInput.extraInfo) {
                            return {
                                result: r,
                                fieldMap: await this.feildMapSL(req, res, serviceInput)
                            }
                        } else {
                            return await r;
                        }
                    }
                    catch (err) {
                        return await this.serviceErr(req, res, err, 'BillService:read');
                    }
                    break;
                case 'count':
                    try {
                        r = await repo.count(serviceInput.cmd.query);
                        console.log('BillService::read()/r:', r)
                        return r;
                    }
                    catch (err) {
                        return await this.serviceErr(req, res, err, 'BillService:read');
                    }
                    break;
            }
            // this.serviceErr(res, err, 'BaseService:read');
        } catch (e) {
            return await this.serviceErr(req, res, e, 'BillService:read');
        }
    }

    readSL$(req, res, serviceInput): Observable<any> {
        return from(this.readSL(req, res, serviceInput));
    }

    async update(req, res, serviceInput) {
        let ret: any = [];
        try {
            await this.init(req, res);
            // const serviceRepository = await getConnection().getRepository(serviceInput.serviceModel);
            console.log('BaseService::update()/repo/model:', serviceInput.serviceModel)
            const serviceRepository: any = await this.repo(req, res, serviceInput.serviceModel)
            const result = await serviceRepository.update(
                serviceInput.cmd.query.where,
                await this.fieldsAdaptor(serviceInput.cmd.query.update, serviceInput)
            )
            if ('affected' in result) {
                this.cdResp.app_state.success = true;
                this.cdResp.app_state.info.app_msg = `${result.affected} record/s updated`;
                ret = result;
            } else {
                this.cdResp.app_state.success = false;
                this.cdResp.app_state.info.app_msg = `some error occorred`;
                if (this.debug) {
                    ret = result;
                }
            }
            return ret;
        } catch (e) {
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:update',
                app_msg: ''
            };
            // await this.setAppState(false, i, null);
            await this.serviceErr(req, res, e, i.code)
            return this.cdResp;
        }
    }

    update$(req, res, serviceInput) {
        return from(this.update(req, res, serviceInput))
    }

    async updateSL(req, res, serviceInput: IServiceInput) {
        console.log('BillService::updateSL()/01')
        await this.initSqlite(req, res);
        const svSess = new SessionService();
        const repo: any = await this.sqliteConn.getRepository(serviceInput.serviceModel);
        const result = await repo.update(
            serviceInput.cmd.query.where,
            await this.fieldsAdaptorSL(req, res, serviceInput.cmd.query.update, serviceInput)
        );
        console.log('result:', result)
        // this.cdResp.data = ret;
        svSess.sessResp.ttl = svSess.getTtl();
        this.setAppState(true, this.i, svSess.sessResp);
        this.cdResp.data = result;
        this.respond(req, res)
    }

    updateSL$(req, res, serviceInput) {
        return from(this.updateSL(req, res, serviceInput))
    }

    /**
     * this method is used to modify values as desired for
     * acceptance to db.
     * @param fieldsData
     * @param serviceInput
     * @returns
     */
    async fieldsAdaptor(fieldsData: any, serviceInput) {
        // get model properties
        const propMap = await this.feildMap(serviceInput);
        for (const fieldName in fieldsData) {
            if (fieldName) {
                const fieldMapData: any = propMap.filter(f => f.propertyPath === fieldName);

                /**
                 * adapt boolean values as desired
                 * in the current case, typeorm rejects 1, "1" as boolean so
                 * we convert them as desired;
                 */
                if (fieldMapData[0]) {
                    if (this.fieldIsBoolean(fieldMapData[0].dType)) {
                        if (this.isTrueish(fieldsData[fieldName])) {
                            fieldsData[fieldName] = true;
                        } else {
                            fieldsData[fieldName] = false;
                        }
                    }
                }
            }
        }
        return fieldsData;
    }

    async fieldsAdaptorSL(req, res, fieldsData: any, serviceInput) {
        // get model properties
        const propMap = await this.feildMapSL(req, res, serviceInput);
        for (const fieldName in fieldsData) {
            if (fieldName) {
                const fieldMapData: any = propMap.filter((f: any) => f.propertyPath === fieldName);

                /**
                 * adapt boolean values as desired
                 * in the current case, typeorm rejects 1, "1" as boolean so
                 * we convert them as desired;
                 */
                if (fieldMapData[0]) {
                    if (this.fieldIsBoolean(fieldMapData[0].dType)) {
                        if (this.isTrueish(fieldsData[fieldName])) {
                            fieldsData[fieldName] = true;
                        } else {
                            fieldsData[fieldName] = false;
                        }
                    }
                }
            }
        }
        return fieldsData;
    }

    fieldIsBoolean(fieldType): boolean {
        return fieldType.toString() === 'function Boolean() { [native code] }';
    }

    isTrueish(val) {
        let ret = false;
        switch (val) {
            case true:
                ret = true;
                break;
            case 'true':
                ret = true;
                break;
            case 1:
                ret = true;
                break;
            case '1':
                ret = true;
                break;
        }
        return ret;
    }

    async delete(req, res, serviceInput) {
        console.log('BaseService::delete()/01')
        let ret: any = [];
        await this.init(req, res);
        // const serviceRepository = await getConnection().getRepository(serviceInput.serviceModel);
        console.log('BaseService::delete()/repo/model:', serviceInput.serviceModel)
        const serviceRepository: any = await this.repo(req, res, serviceInput.serviceModel)
        const result = await serviceRepository.delete(
            serviceInput.cmd.query.where
        )

        if ('affected' in result) {
            this.cdResp.app_state.success = true;
            this.cdResp.app_state.info.app_msg = `${result.affected} record/s deleted`;
            ret = result;
        } else {
            this.cdResp.app_state.success = false;
            this.cdResp.app_state.info.app_msg = `some error occorred`;
            if (this.debug) {
                ret = result;
            }
        }
        return ret;
    }

    delete$(req, res, serviceInput) {
        return from(this.delete(req, res, serviceInput))
    }

    async deleteSL(req, res, serviceInput: IServiceInput) {
        console.log('BillService::updateSL()/01')
        let ret: any = [];
        await this.initSqlite(req, res);
        const repo = await this.sqliteConn.getRepository(serviceInput.serviceModel);
        const result = await repo.delete(
            serviceInput.cmd.query.where
        )
        console.log('BaseService::deleteSL()/result:', result)
        if ('affected' in result) {
            this.cdResp.app_state.success = true;
            this.cdResp.app_state.info.app_msg = `${result.affected} record/s deleted`;
            ret = result;
        } else {
            this.cdResp.app_state.success = false;
            this.cdResp.app_state.info.app_msg = `some error occorred`;
            if (this.debug) {
                ret = result;
            }
        }
        return ret;
    }

    deleteSL$(req, res, serviceInput) {
        return from(this.deleteSL(req, res, serviceInput))
    }

    //////////////////////////
    // TEST JSON MYSQL QUERY:

    /**
     * 
         {
            "ctx": "Sys",
            "m": "InteRact",
            "c": "InteRactPub",
            "a": "TestJsonQuery",
            "dat": {
                "f_vals": [
                    {
                        "query": {
                            "select": [
                                "inte_ract_pub_id",
                                "inte_ract_pub_name",
                                "inte_ract_pub_description",
                                "inte_ract_pub_guid",
                                "doc_id",
                                "inte_ract_pub_type_id",
                                "public",
                                "m",
                                "c",
                                "j_val"
                            ],
                            "where": [
                                {
                                    "conjType": "",
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
    * @param filter 
    */
    // type orm query json column
    // this.repo.query('SELECT some-column->"$.email_verification.token" as `token`  FROM `user` WHERE some-column->"$.email_verification.token" = "some-token";');

    // getManager().getRepository(User)
    //     .createQueryBuilder('user')
    //     .select()
    //     .where(`user.address ::jsonb @> \'{"state":"${query.location}"}\'`)

    async readJSON(req, res, serviceInput: IServiceInput): Promise<any> {
        console.log('BaseService::readJSON()/01')
        await this.init(req, res);
        console.log('BaseService::readJSON()/02')
        console.log('BaseService::readJSON()/repo/model:', JSON.stringify(serviceInput.serviceModel))
        const repo: any = await this.repo(req, res, serviceInput.serviceModel);
        console.log('BaseService::readJSON()/03')
        let r: any = null;
        const q = serviceInput.cmd.query
        switch (serviceInput.cmd.action) {
            case 'find':
                try {
                    console.log('BaseService::readJSON()/031')
                    // r = await repo.find(serviceInput.cmd.query);
                    console.log('BaseService::readJSON()/q:', q)
                    // working- option 1:
                    // r = await repo.query('SELECT * FROM `inte_ract_pub` WHERE j_val->"$.domain.group.doc_id" = 11091;');

                    // working-option 2:
                    r = await repo.createQueryBuilder('inte_ract_pub')
                        /**
                         * at the moment any effort to query selected fields
                         * have not worked. No error but returns []
                         * below options have been tested
                         * .select(q.select) with q.select as array of fields
                         * .select(['inte_ract_pub.inte_ract_pub_id'])
                         * NB: When config is set with logs on, the same sql generated retrieves data but
                         * when used here, there is and empry [] as result.
                         */
                        .select()
                        .where(`${this.getQbFilter(<IQbInput>q)}`)
                        .getMany()
                    console.log('BaseService::readJSON()/04')
                    if (serviceInput.extraInfo) {
                        console.log('BaseService::readJSON()/05')
                        return {
                            result: r,
                            fieldMap: await this.feildMap(serviceInput)
                        }
                    } else {
                        console.log('BaseService::readJSON()/06')
                        return await r;
                    }
                }
                catch (err) {
                    console.log('BaseService::readJSON()/07')
                    return await this.serviceErr(req, res, err, 'BaseService:read');
                }
                break;
            case 'count':
                try {
                    r = await repo.count(serviceInput.cmd.query);
                    console.log('BaseService::readJSON()/r:', r)
                    return r;
                }
                catch (err) {
                    return await this.serviceErr(req, res, err, 'BaseService:readJSON');
                }
                break;
        }


        // this.serviceErr(res, err, 'BaseService:read');
    }

    readJSON$(req, res, serviceInput): Observable<any> {
        return from(this.readJSON(req, res, serviceInput));
    }

    getQbFilter(q: IQbInput) {
        let ret = ''
        q.where.forEach((qItem) => {
            let conjType = ''
            if (qItem.conjType) {
                conjType = qItem.conjType
            }
            if (qItem.dataType === 'json') {
                ret += ` ${conjType} JSON_EXTRACT(${qItem.field}, ${qItem.jPath}) ${qItem.operator} ${qItem.val} `
            } else {
                ret += ` ${conjType} ${qItem.field} ${qItem.operator} ${qItem.val} `
            }
        })
        return ret
    }
    /////////////////////////
    // Redis stuff

    async redisInit(req, res) {
        this.redisClient = createClient();
        this.redisClient.on('error', async (err) => {
            console.log('BaseService::redisCreate()/02')
            this.err.push(err.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:redisCreate',
                app_msg: ''
            };
            await this.serviceErr(req, res, this.err, 'BaseService:redisCreate')
            return this.cdResp;
        });

        await this.redisClient.connect();
    }

    async redisCreate(req, res) {
        await this.redisInit(req, res);
        console.log('BaseService::redisCreate()/01')
        const pl: CacheData = await this.getPlData(req);
        console.log('BaseService::redisCreate()/pl:', pl)
        try {
            const setRet = await this.redisClient.set(pl.key, pl.value);
            console.log('BaseService::redisCreate()/setRet:', setRet)
            const readBack = await this.redisClient.get(pl.key);
            console.log('BaseService::redisCreate()/readBack:', readBack)
            return {
                status: setRet,
                saved: readBack,
            };
        } catch (e) {
            console.log('BaseService::redisCreate()/04')
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:redisCreate',
                app_msg: ''
            };
            await this.serviceErr(req, res, this.err, 'BaseService:redisCreate')
            return this.cdResp;
        }

    }

    async redisRead(req, res, serviceInput: IServiceInput) {
        await this.redisInit(req, res);
        console.log('BaseService::redisRead()/01')
        const pl: CacheData = await this.getPlData(req);
        console.log('BaseService::redisRead()/pl:', pl)
        try {
            const getRet = await this.redisClient.get(pl.key);
            console.log('BaseService::redisRead()/getRet:', getRet)
            return getRet
        } catch (e) {
            console.log('BaseService::redisRead()/04')
            this.err.push(e.toString());
            const i = {
                messages: this.err,
                code: 'BaseService:redisRead',
                app_msg: ''
            };
            await this.serviceErr(req, res, this.err, 'BaseService:redisRead')
            return this.cdResp;
        }
    }

    redisDelete(req, res, serviceInput: IServiceInput) {
        this.redisClient.del('foo', (err, reply) => {
            if (err) throw err;
            console.log(reply);
        });
    }

    async redisAsyncRead(req, res, serviceInput: IServiceInput) {
        return new Promise((resolve, reject) => {
            this.redisClient.get('myhash', (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    async validateInputRefernce(msg: string, validationResponse: any[], svSess: SessionService): Promise<boolean> {
        if (validationResponse.length > 0) {
            console.log('BaseService::validateCreate()/1')
            return true;
        } else {
            // console.log('BaseService::validateCreate()/2')
            // this.i.app_msg = `${validationItem} reference is invalid`;
            // this.err.push(this.i.app_msg);
            // this.setAppState(false, this.i, svSess.sessResp);
            this.setAlertMessage(msg, svSess, false)
            return false;
        }
    }

    async setAlertMessage(msg: string, svSess: SessionService, success: boolean) {
        this.i.app_msg = msg;
        this.err.push(this.i.app_msg);
        await this.setAppState(success, this.i, svSess.sessResp);
    }

    logTimeStamp(msg: string = null) {
        const first_parameter = arguments[0];
        const other_parameters = Array.prototype.slice.call(arguments, 1);

        function formatConsoleDate(date) {
            const hour = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const milliseconds = date.getMilliseconds();

            return '[' +
                ((hour < 10) ? '0' + hour : hour) +
                ':' +
                ((minutes < 10) ? '0' + minutes : minutes) +
                ':' +
                ((seconds < 10) ? '0' + seconds : seconds) +
                '.' +
                ('00' + milliseconds).slice(-3) +
                '] : ' + msg;
        }

        console.log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
    };

    controllerCreate(req, res) {
        return 1;
    }

    controllerUpdate(req, res) {
        return 1;
    }

    controllerDelete(req, res) {
        return 1;
    }

    intersect(arrA, arrB, intersectionField) {
        return Lá.intersectionBy(arrA, arrB, intersectionField);
    }

    intersectionLegacy = (arr1, arr2) => {
        const res = [];
        // for(let i = 0; i < arr1.length; i++){
        for (const i of arr1) {
            if (!arr2.includes(i)) {
                continue;
            };
            res.push(i);
        };
        return res;
    };

    intersectMany = (...arrs) => {
        let res = arrs[0].slice();
        for (let i = 1; i < arrs.length; i++) {
            res = this.intersectionLegacy(res, arrs[i]);
        };
        return res;
    };

    isEmpty(value) {
        return (value == null || value.length === 0);
    }



    /**
     *
     * The type K is constrained to be a value computed from the keyof operator on
     * type T. Remember that the keyof operator will return a string literal type that is made
     * up of the properties of an object, so K will be constrained to the property names of
     * the type T.
     *
     * @param object
     * @param key
     */
    getProperty<T, K extends keyof T>
        (object: T, key: K) {
        const propertyValue = object[key];
    }


    ///////////////////////

    createClassInstance<T>(arg1: new () => T): T {
        return new arg1();
    }

}

