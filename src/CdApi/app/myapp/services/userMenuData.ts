import { Observable, of } from 'rxjs';
import { MenuViewModel } from '../../../sys/moduleman/models/menu-view.model';

export const userMenuData: MenuViewModel[]= [
    {
        'menuId': 1,
        'menuLabel': 'MyDesk',
        'menuGuid': 'c9c15362-528e-11e7-b64c-1fe82d2b500e',
        'closetFile': 'cd_guig/widget_closet/user.js',
        'menuActionId': 43212,
        'docId': null,
        'menuParentId': -1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43212,
        'cdObjName': 'set_office_dashboard',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': '6608C693-D3B3-FE68-57FE-D9FF97C3DB15',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 2,
        'menuLabel': 'Users',
        'menuGuid': '6c4590ed-5324-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/user.js',
        'menuActionId': 43211,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43211,
        'cdObjName': 'set_user_profile',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'A2C15607-0975-A6C0-0441-7D9C151EFE19',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 3,
        'menuLabel': 'Comm',
        'menuGuid': '9e245c2b-5324-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/comm.js',
        'menuActionId': 43214,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43214,
        'cdObjName': 'set_comm',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'D660307B-BC3B-BE17-C059-50A9192563C9',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 4,
        'menuLabel': 'notifications',
        'menuGuid': 'b46a23ff-5324-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/comm.js',
        'menuActionId': 43207,
        'docId': null,
        'menuParentId': 6,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43207,
        'cdObjName': 'set_notification',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': '53DC1993-1D32-ADD5-A4A5-F42D160AEAD2',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': null,
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 5,
        'menuLabel': 'logs',
        'menuGuid': 'c3fe6277-5324-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/user.js',
        'menuActionId': 43220,
        'docId': null,
        'menuParentId': 6,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43220,
        'cdObjName': 'set_user_logs',
        'lastSyncDate': '2017-06-19T05:16:51.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'C9C1EC34-5FA6-D195-FEA0-CCE3D987EAA7',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 6,
        'menuLabel': 'Settings',
        'menuGuid': 'd7866be1-5324-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/user.js',
        'menuActionId': 43213,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43213,
        'cdObjName': 'set_user_settings',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': '9C1F5DA9-7F95-1942-C619-7CAAB50E16A7',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 7,
        'menuLabel': 'Moduleman',
        'menuGuid': 'e420d6c6-5324-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/moduleman_v15.js',
        'menuActionId': 43152,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43152,
        'cdObjName': 'set_module_wizard_02',
        'lastSyncDate': '2017-03-03T08:05:58.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'FFB443B8-5DFC-A0BC-1C65-BB5572C52288',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '16E6E4FE-3739-4A5E-C506-620DBBC74851',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 8,
        'menuLabel': 'SyncGuig',
        'menuGuid': 'ef75eeee-5324-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/moduleman_v15.js',
        'menuActionId': 43150,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43150,
        'cdObjName': 'sync_guig',
        'lastSyncDate': '2017-03-03T08:05:58.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'FCEE0860-7F71-C210-FF4A-825492601262',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '16E6E4FE-3739-4A5E-C506-620DBBC74851',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 9,
        'menuLabel': 'CD-Scheduler',
        'menuGuid': '038bf011-5325-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/cd_scheduler.js',
        'menuActionId': 43216,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43216,
        'cdObjName': 'set_scheduler_dashboard',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'B80ACC83-B206-02EE-24F3-3E32599A9A09',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 10,
        'menuLabel': 'Subscribe',
        'menuGuid': '0ff293d0-5325-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/services_subscribe_01.js',
        'menuActionId': 43173,
        'docId': null,
        'menuParentId': 9,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43173,
        'cdObjName': 'set_services_subscribe_01',
        'lastSyncDate': '2017-03-20T16:48:41.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'F4E119BA-9DE4-5529-6845-D7B47FAC972A',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 11,
        'menuLabel': 'MyCalendar',
        'menuGuid': '1c8dfa59-5325-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/cd_calendar.js',
        'menuActionId': 43173,
        'docId': null,
        'menuParentId': 9,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43173,
        'cdObjName': 'set_services_subscribe_01',
        'lastSyncDate': '2017-03-20T16:48:41.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'F4E119BA-9DE4-5529-6845-D7B47FAC972A',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 12,
        'menuLabel': 'MyProgress',
        'menuGuid': '28177294-5325-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/cd_scheduler.js',
        'menuActionId': 43216,
        'docId': null,
        'menuParentId': 9,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43216,
        'cdObjName': 'set_scheduler_dashboard',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'B80ACC83-B206-02EE-24F3-3E32599A9A09',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 13,
        'menuLabel': 'SchedulerBlogs',
        'menuGuid': '3dea11d6-5325-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/cd_scheduler.js',
        'menuActionId': 43217,
        'docId': null,
        'menuParentId': 9,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43217,
        'cdObjName': 'set_scheduler_blogs',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': '812D88CB-080C-1660-2D40-9533B5D6B368',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 14,
        'menuLabel': 'Admin',
        'menuGuid': '481a880a-5325-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/admin.js',
        'menuActionId': 43222,
        'docId': null,
        'menuParentId': 9,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43222,
        'cdObjName': 'set_admin_dashboard',
        'lastSyncDate': '2017-06-19T05:16:51.000Z',
        'cdObjDispName': null,
        'cdObjGuid': '2CB8013B-11E4-7DB0-BC09-5054C30059C3',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 16,
        'menuLabel': 'Emails',
        'menuGuid': '72f37049-5325-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/comm.js',
        'menuActionId': 43221,
        'docId': null,
        'menuParentId': 3,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43221,
        'cdObjName': 'set_emails',
        'lastSyncDate': '2017-06-19T05:16:51.000Z',
        'cdObjDispName': null,
        'cdObjGuid': '86DEEC34-8251-9D30-0D2C-D2B11889BCF8',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 17,
        'menuLabel': 'Users&Groups',
        'menuGuid': '8c083d78-5325-11e7-8464-c04a002428aa',
        'closetFile': 'cd_guig/widget_closet/cd_users_groups.js',
        'menuActionId': 43219,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43219,
        'cdObjName': 'set_cd_users_groups',
        'lastSyncDate': '2017-06-16T19:25:46.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'ECB8A4B3-8A9C-D1E4-FE8C-4151EB9B169E',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 18,
        'menuLabel': 'controller_mgr',
        'menuGuid': '26ecaa83-5589-11e7-87ff-644f60f2a048',
        'closetFile': 'cd_guig/widget_closet/controller_01_v12.js',
        'menuActionId': 43154,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43154,
        'cdObjName': 'set_controller_01_v01',
        'lastSyncDate': '2017-03-03T08:05:58.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'DA246249-5BED-031A-C651-D0CAF8EEA623',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '16E6E4FE-3739-4A5E-C506-620DBBC74851',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 19,
        'menuLabel': 'Generic',
        'menuGuid': 'c6dc9201-58c3-11e7-a6b5-eac621544351',
        'closetFile': 'cd_guig/widget_closet/mod_generic/generic.js',
        'menuActionId': 43224,
        'docId': null,
        'menuParentId': 1,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43224,
        'cdObjName': 'set_generic',
        'lastSyncDate': '2017-06-24T10:04:15.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'gbhjnm',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 20,
        'menuLabel': 'Generic Form',
        'menuGuid': '9313CC85-C897-2A83-C03B-DDAB05E6379F',
        'closetFile': 'cd_guig/widget_closet/mod_generic/generic_form.js',
        'menuActionId': 43225,
        'docId': 4115,
        'menuParentId': 19,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43225,
        'cdObjName': 'set_generic_form',
        'lastSyncDate': '2017-06-26T07:31:34.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'EB4C581C-073A-A977-2326-90AAF36CC0E9',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 21,
        'menuLabel': 'Generic Foo Table',
        'menuGuid': '2C071A1D-773E-58AD-2004-B05B89B584F7',
        'closetFile': 'cd_guig/widget_closet/mod_generic/generic_foo_table.js',
        'menuActionId': 43226,
        'docId': 4117,
        'menuParentId': 19,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43226,
        'cdObjName': 'set_generic_foo_table',
        'lastSyncDate': '2017-06-26T08:28:18.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'D2F8941D-F43C-0565-0EC2-2FFE128B9084',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 22,
        'menuLabel': 'Generic Tree',
        'menuGuid': '7E5046F0-BC17-8203-14CE-50BCF5163F4D',
        'closetFile': 'cd_guig/widget_closet/mod_generic/generic_tree.js',
        'menuActionId': 43227,
        'docId': 4119,
        'menuParentId': 19,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43227,
        'cdObjName': 'set_generic_tree',
        'lastSyncDate': '2017-06-26T14:48:02.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'BCDE22B9-C26C-0A83-D2D1-0A5D28C5988B',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 23,
        'menuLabel': 'ProgressBar',
        'menuGuid': 'E2160F29-7ED6-C461-9481-2E8E302E2FD6',
        'closetFile': 'cd_guig/widget_closet/mod_generic/generic_progress_bar.js',
        'menuActionId': 43230,
        'docId': 4121,
        'menuParentId': 19,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 43230,
        'cdObjName': 'set_generic_progress_bar',
        'lastSyncDate': '2017-07-12T16:31:43.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'AAA0D98B-F303-966A-744D-1EFEF23FC56E',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 217,
        'menuLabel': 'controller-view',
        'menuGuid': '1A5ED30B-5BC2-046B-5872-AB1148EAA326',
        'closetFile': 'cd_guig/widget_closet/mod_generic/generic_controller.js',
        'menuActionId': 49168,
        'docId': 4745,
        'menuParentId': 19,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 49168,
        'cdObjName': 'set_generic_controller',
        'lastSyncDate': '2017-10-07T18:52:18.000Z',
        'cdObjDispName': null,
        'cdObjGuid': '9498A4DF-D44A-B45E-5B79-2A7B15BBFA13',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 218,
        'menuLabel': 'controller-view2',
        'menuGuid': '91EC7D03-AB65-1567-9193-BD396A8D73BB',
        'closetFile': 'cd_guig/widget_closet/mod_generic/generic_controller_view.js',
        'menuActionId': 49169,
        'docId': 4747,
        'menuParentId': 19,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 49169,
        'cdObjName': 'set_controller_view',
        'lastSyncDate': '2017-10-09T07:52:59.000Z',
        'cdObjDispName': null,
        'cdObjGuid': '5872283B-E0EF-4CC4-33FE-C6B1B2975074',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 220,
        'menuLabel': 'cd-memo',
        'menuGuid': 'C38A49B3-20D4-FF72-029D-D648E8503618',
        'closetFile': 'cd_guig/widget_closet/cd_memo.js',
        'menuActionId': 220,
        'docId': 4751,
        'menuParentId': 19,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 220,
        'cdObjName': 'getModelName',
        'lastSyncDate': null,
        'cdObjDispName': null,
        'cdObjGuid': '3151399B-304D-A89B-B220-E7466B9B10DE',
        'cdObjTypeGuid': '903b5530-f525-4d97-8e64-46f8a383f36b',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': '/Applications/XAMPP/xamppfiles/htdocs/corp-deskv1.2.1.1/app/modules/user/models/groupsmodel.php',
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        },
    {
        'menuId': 221,
        'menuLabel': 'memo',
        'menuGuid': 'CF37803C-8179-757B-814A-5985394BC3C0',
        'closetFile': 'cd_guig/widget_closet/mod_comm/cd_memo.js',
        'menuActionId': 49171,
        'docId': 4752,
        'menuParentId': 3,
        'moduleId': 45,
        'moduleGuid': '-dkkm6',
        'moduleName': 'user',
        'moduleIsPublic': 1,
        'isSysModule': 1,
        'children': null,
        'menuAction': null,
        'cdObjId': 49171,
        'cdObjName': 'set_cd_memo',
        'lastSyncDate': '2017-10-13T17:49:53.000Z',
        'cdObjDispName': null,
        'cdObjGuid': 'A4967C44-FFB3-44D0-825D-59F9F0308B7F',
        'cdObjTypeGuid': 'f5df4494-5cc9-4463-8e8e-c5861703280e',
        'lastModificationDate': null,
        'parentModuleGuid': '-dkkm6',
        'parentClassGuid': null,
        'parentObj': null,
        'showName': null,
        'icon': null,
        'showIcon': null,
        'currVal': null,
        'cdObjEnabled': null
        }
    ]
