declare class Collar {
    code: string;
    id: string;
    constructor(code: string, id: string);
}
declare class Ref {
}
declare class Lead {
    owner: Collar;
    code: string;
    constructor(owner: Collar, code: string);
}
