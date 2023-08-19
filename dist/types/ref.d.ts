export declare namespace ref {
    type Scope = {
        vn: string;
        jd: string;
        code: string;
    };
    type Collar = {
        code: string;
        id: string;
    };
    type Lead = {
        owner: Collar;
        code: string;
    };
}
