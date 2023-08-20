import { network } from "../network";
export declare class BrowserStorage implements network.IStorage {
    get<V>(key: string): V | null;
    set<V>(key: string, val: V): void;
    clean(): void;
    iter<V>(callback: (key: string, val: V) => void): void;
    remove(key: string): void;
}
