import { times } from "../types/times";
import { ref } from "../types/ref";
import { errors } from "../types/errors";
export declare namespace cart {
    type ID = string;
    type Item = {
        commodity_id: string;
        quantity: number;
        seq: number;
        selected: boolean;
        available: boolean;
        last_at: times.String;
    };
    type Cart = {
        scope: ref.Scope;
        lead: ref.Lead;
        id: ID;
        commodities: Item[];
        birth_at: times.String;
    } | null;
    type PutRequest = {
        scope: ref.Scope;
        lead: ref.Lead;
        id: ID;
        commodity_id: string;
        quantity: number;
    };
    type DeductRequest = PutRequest;
    type SelectedSwitchRequest = {
        scope: ref.Scope;
        lead: ref.Lead;
        id: ID;
        commodity_id_array: string[];
        selected: boolean;
    };
    type GetRequest = {
        scope: ref.Scope;
        lead: ref.Lead | null;
        id: ID | null;
    };
    type CleanRequest = GetRequest;
    function put(req: PutRequest): Promise<[cart: Cart | null, err: errors.Error]>;
    function deduct(req: DeductRequest): Promise<[cart: Cart | null, err: errors.Error]>;
    function selectedSwitch(req: SelectedSwitchRequest): Promise<[cart: Cart | null, err: errors.Error]>;
    function get(req: GetRequest): Promise<[cart: Cart, err: errors.Error]>;
    function clean(req: CleanRequest): Promise<errors.Error>;
}
