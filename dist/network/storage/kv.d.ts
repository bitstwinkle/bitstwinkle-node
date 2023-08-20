import { network } from "../network";
export declare class KVStorage implements network.IStorage {
    private db;
    get<V>(key: string): V;
    set<V>(key: string, val: V): void;
    clean(): void;
    iter<V>(callback: (key: string, val: V) => void): void;
    remove(key: string): void;
}
