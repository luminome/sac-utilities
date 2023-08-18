export function formatMs(ms:number, decimals:number = 3): string {
    if (!+ms) return '0 ms';
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['ms', 'secs', 'mins', 'hrs', 'days'];
    const scales = [1, 1000, 60000, 3600000, 86400000];
    let i = 0;
    if(ms >= 1000) i = 1;
    if(ms >= 60000) i = 2;
    if(ms >= 3600000) i = 3;
    if(ms >= 86400000) i = 4;
    return `${i === 0 ? ms : (ms/scales[i]).toFixed(dm)} ${sizes[i]}`;
}

export function formatBytes(bytes:number, decimals:number = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1000; // 1024
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function keyGen(len:number = 6): string {
    return (Math.random() + 1).toString(36).substring(2,2+len).toUpperCase();
}

export type timer_model = {
    var_name: string,
    T0: Date,
    T1: number;
    T2: number;
    start: Function;
    stop: Function;
};

export const timer = (var_name:string):timer_model => {
    function start(){
        T.T1 = Date.now();
        return T;
    }
    function stop(){
        T.T2 = Date.now() - T.T1;
        return T.T2;
    }
    const T = {
        var_name: var_name,
        T0: new Date(),
        T1: 0.0,
        T2: 0.0,
        start,
        stop,
    }
    return T
}

export const objectToText = (obj:any, flat:string[] = [], l:number = 0) => {
    const spc = '  '.repeat(l);
    obj && Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object'){
            if(obj[key] instanceof Array){
                flat.push(`${spc} ${key}: ${obj[key].join(' | ')}`);
            }else if(obj[key] instanceof Date){
                flat.push(`${spc} ${key}: ${obj[key].toString()}`);
            }else if(obj[key] instanceof Function){
                flat.push(`${spc} ${key}: Function()`);
            }else{
                flat.push(`${spc} ${key}->`);
                objectToText(obj[key], flat, l+1);
            }
        }else{
            if(!(obj[key] instanceof Function)) flat.push(`${spc} ${key}: ${obj[key]}`);
        }
    });
    return flat;
}

export const objAssignPartial = (target:any, obj:any):void => {
    obj && Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && (obj[key] instanceof Object) && !(Array.isArray(obj[key]))){
            objAssignPartial(target[key], obj[key]);
        }else{
            !(obj[key] instanceof Function) && (target[key] = obj[key]);
        }
    });
}
  

export const setAttrs = (e:Element, a:any) => Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v as any));
