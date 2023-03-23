import {
    Observable, map, mergeMap, of, distinct, bufferCount, share, forkJoin
} from 'rxjs';
import { GroupMemberService } from '../../user/services/group-member.service';
import { BaseService } from '../../base/base.service';
import { AclModel } from '../models/acl.model';
import { DocModel } from '../models/doc.model';
import { IAclCtx, ICdRequest, IQuery } from '../../base/IBase';
import { ModuleService } from './module.service';
import { SessionService } from '../../user/services/session.service';
import { ConsumerService } from './consumer.service';
import { AclUserViewModel } from '../models/acluserview.model';
import { AclModuleViewModel } from '../models/acl-module-view.model';
import { AclModuleMemberViewModel } from '../models/acl-module-member-view.model';

export class AclService {
    b: BaseService;
    nestedMembers = [];
    aclRet;
    cuid;
    arrDoc;
    moduleIndexName;
    staticModel;
    validated;
    aclCtx;
    currentModule;
    srvSess;
    srvConsumer;
    consumerGuid;
    consumer;
    isPublicModule = m => m.moduleIsPublic;
    trimmedModule = m => {
        return {
            moduleGuid: m.moduleGuid,
            moduleEnabled: m.moduleEnabled,
            moduleIsPublic: m.moduleIsPublic,
            moduleId: m.moduleId,
            moduleName: m.moduleName,
            isSysModule: m.isSysModule,
            moduleTypeId: m.moduleTypeId,
            groupGuid: m.groupGuid,
        };
    }

    constructor() {
        this.b = new BaseService();
        this.srvSess = new SessionService();
        this.srvConsumer = new ConsumerService();
    }

    async getAclModule(req, res, params) {
        // this.b.logTimeStamp(`AclService::getAclModule/params:${JSON.stringify(params)}`)
        // console.log('AclService::getAclModule(req, res,params)/params:', params)
        const result$ = of(
            this.aclUser$(req, res, { consumerGuid: params.consumerGuid }).pipe(map((u) => { return { useRoles: u } })),
            this.aclModule$(req, res).pipe(map((u) => { return { modules: u } })),
            this.aclModuleMembers$(req, res, params).pipe(map((u) => { return { moduleParents: u } }))
        ).pipe(
            mergeMap((obs$: any) => obs$),
            bufferCount(3)
        );

        result$
            .subscribe((r: any) => {
                // console.log(`AclService::getAclModule/subscribe/01`)
                // this.b.logTimeStamp(`AclService::getAclModule/r:${JSON.stringify(r)}`)
                // console.log(`AclService::getAclModule/r:${JSON.stringify(r)}`)
                const modules = r.filter((m) => {
                    if (typeof (m.modules) === 'object') {
                        return m
                    }
                })

                const moduleParents = r.filter(m => {
                    if (typeof (m.moduleParents) === 'object') {
                        return m
                    }
                })

                // console.log(`AclService::getAclModule/modules:${JSON.stringify(modules)}`)
                // console.log(`AclService::getAclModule/moduleParents:${JSON.stringify(moduleParents)}`)
                // console.log('modules[0]:', modules[0]);
                // console.log('moduleParents[0]:', moduleParents[0]);
                const matchedObjects = (a, b) => JSON.stringify(a) === JSON.stringify(b);
                const intersect = modules[0].modules.filter((module) => {
                    return moduleParents[0].moduleParents.filter((mp) => {
                        if (JSON.stringify(mp) === JSON.stringify(module)) {
                            return module;
                        }
                    })
                })
                this.b.cdResp = intersect;
                this.b.respond(req, res);
            });
    }

    /**
     * stream of users based on AclUserViewModel and
     * filtered by current consumer relationship and user role
     * @param req
     * @param res
     * @param params
     * @returns
     */
    aclUser$(req, res, params): Observable<any> {
        // this.b.logTimeStamp(`AclService::aclUser$/params:${JSON.stringify(params)}`)
        this.consumerGuid = params.consumerGuid;
        const q: IQuery = { where: {} };
        const user$ = this.b.get$(req, res, AclUserViewModel, q)
            .pipe(
                share() // to avoid repeated db round trips
            )
        const isRoot = u => u.userId === 1001;

        const isConsumerRoot = u => u.consumerResourceTypeId === 4
            && u.consumerGuid === this.consumerGuid
            && u.objGuid === params.currentUser.userGuid;

        const isConsumerTechie = u => u.consumerResourceTypeId === 5
            && u.consumerGuid === this.consumerGuid
            && u.objGuid === params.currentUser.userGuid;

        const isConsumerUser = u => u.consumerResourceTypeId === 6
            && u.consumerGuid === this.consumerGuid
            && u.objGuid === params.currentUser.userGuid;

        const isRoot$ = user$
            .pipe(
                map((u) => {
                    const ret = u.filter(isRoot)
                    return ret;
                })
                , distinct()
            );

        const isConsumerRoot$ = user$
            .pipe(
                map((u) => {
                    const ret = u.filter(isConsumerRoot)
                    return ret;
                })
                , distinct()
            );

        const isConsumerTechie$ = user$
            .pipe(
                map((u) => {
                    const ret = u.filter(isConsumerTechie)
                    return ret;
                })
                , distinct()
            );

        const isConsumerUser$ = user$
            .pipe(
                map((u) => {
                    // this.b.logTimeStamp(`AclService::aclUser$/u[isConsumerUser$]1:${JSON.stringify(u)}`)
                    const ret = u.filter(isConsumerUser)
                    // this.b.logTimeStamp(`AclService::aclUser$/u[isConsumerUser$]2:${JSON.stringify(u)}`)
                    return ret;
                })
                , distinct()
            );

        return forkJoin(
            {
                isRoot: isRoot$.pipe(map((u) => { return u })),
                isConsumerRoot: isConsumerRoot$.pipe(map((u) => { return u })),
                isConsumerUser: isConsumerUser$.pipe(map((u) => { return u }))
            }
        )
    }

    /**
     * stream of modules based on AclModuleViewModel and
     * filtered by isEnabled, isPublicModule and isConsumerResource
     * @param req
     * @param res
     * @returns
     */
    aclModule$(req, res) {
        // console.log('AclService::aclModule$()/this.consumerGuid:', this.consumerGuid)
        // console.log('AclService::aclModule$()/01:');
        // this.b.logTimeStamp(':AclService::aclModule$()/01')
        const isEnabled = m => m.moduleEnabled;
        const isPublicModule = m => m.moduleIsPublic;
        const isConsumerResource = m => m.moduleIsPublic || m.consumerGuid === this.consumerGuid
        const serviceInput = {
            serviceModel: AclModuleViewModel,
            docName: 'AclService::aclModule$',
            cmd: {
                action: 'find',
                query: { where: {} }
            },
            dSource: 1,
        }
        return this.b.read$(req, res, serviceInput)
            .pipe(
                share()
            )
            .pipe(
                map((m) => {
                    // this.b.logTimeStamp(':AclService::aclModule$()/02')
                    // console.log('AclService::aclModule$()/m1:', m)
                    return m.filter(isEnabled)
                }),
                map((m) => {
                    // console.log('AclService::aclModule$()/m2:', m)
                    // console.log('AclService::aclModule$()/03:');
                    // this.b.logTimeStamp(':AclService::aclModule$()/03')
                    return m.filter(isConsumerResource)
                })
                , distinct()
            )
            .pipe(
                map(modules => {
                    // this.b.logTimeStamp(':AclService::aclModule$()/04')
                    // console.log('AclService::aclModule$()/03:');
                    // console.log('aclModuleMembers/modules3:', modules);
                    const mArr = [];
                    modules.forEach((m) => {
                        m = {
                            moduleGuid: m.moduleGuid,
                            moduleEnabled: m.moduleEnabled,
                            moduleIsPublic: m.moduleIsPublic,
                            moduleId: m.moduleId,
                            moduleName: m.moduleName,
                            isSysModule: m.isSysModule,
                            moduleTypeId: m.moduleTypeId,
                            groupGuid: m.groupGuid,
                        };
                        mArr.push(m);
                    });
                    // this.b.logTimeStamp(':AclService::aclModule$()/05')
                    // console.log('AclService::aclModule$()/04:');
                    // console.log('aclModuleMembers/mArr:', mArr);
                    return mArr;

                })
                , distinct()
            )
    }

    // users and modules where they belong
    aclModuleMembers$(req, res, params): Observable<any> {
        // this.b.logTimeStamp('AclService::aclModuleMembers$/01')
        // console.log('AclService::aclModuleMembers$/01:');
        const isModuleMember = m => m.memberGuid === params.currentUser.userGuid;

        const serviceInput = {
            serviceModel: AclModuleMemberViewModel,
            docName: 'AclService::aclUser$',
            cmd: {
                action: 'find',
                query: { where: {} }
            },
            dSource: 1,
        }
        const modules$ = this.b.read$(req, res, serviceInput)
            .pipe(
                share() // to avoid repeated db round trips
            )
        return modules$
            .pipe(
                map((m) => {
                    if (this.isPublicModule) {
                        return m; // waive filtering if the module is public
                    } else {
                        return m.filter(isModuleMember)
                    }
                })
                , distinct()
            )
            .pipe(
                map(modules => {
                    // this.b.logTimeStamp('AclService::aclModuleMembers$/02')
                    // console.log('AclService::aclModuleMembers$/02:');
                    // console.log('aclModuleMembers/modules:', modules);
                    const mArr = [];
                    modules.forEach((m) => {
                        m = {
                            moduleGuid: m.moduleGuid,
                            moduleEnabled: m.moduleEnabled,
                            moduleIsPublic: m.moduleIsPublic,
                            moduleId: m.moduleId,
                            moduleName: m.moduleName,
                            isSysModule: m.isSysModule,
                            moduleTypeId: m.moduleTypeId,
                            groupGuid: m.groupGuid,
                        };
                        mArr.push(m);
                    });
                    return mArr;

                })
                , distinct()
            );
    }
}