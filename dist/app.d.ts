import { type Application } from 'express';
import cors from 'cors';
declare const app: Application;
export declare const corsConfig: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
export default app;
//# sourceMappingURL=app.d.ts.map