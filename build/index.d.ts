export declare function formatMs(ms: number, decimals?: number): string;
export declare function formatBytes(bytes: number, decimals?: number): string;
export declare function keyGen(len?: number): string;
export type timer_model = {
    var_name: string;
    T1: number;
    T2: number;
    start: Function;
    stop: Function;
};
export declare const timer: (var_name: string) => timer_model;
