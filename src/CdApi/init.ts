import { processPost } from './sys/utils/request';
import { CdExec } from './CdExec';
export async function CdInit(req: any, res: any) {
    const r = await processPost(req, res, async () => {
        const cb = new CdExec();
        await cb.exec(req, res);
    });
};


