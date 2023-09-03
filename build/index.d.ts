export declare function formatMs(ms: number, decimals?: number): string;
export declare function formatBytes(bytes: number, decimals?: number): string;
export declare function keyGen(len?: number): string;
export type timer_model = {
    var_name: string;
    T0: Date;
    T1: number;
    T2: number;
    start: Function;
    stop: Function;
};
export declare const timer: (var_name: string) => timer_model;
export declare const objectToText: (obj: any, flat?: string[], l?: number, hidden?: string[]) => string[];
export declare const objAssignPartial: (target: any, obj: any) => void;
export declare const setAttrs: (e: Element, a: any) => void;
