import { MapLike } from "typescript";

const DateWorker = new Date();
const SVG_NS = "http://www.w3.org/2000/svg";

export const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function insertAfter(referenceNode:HTMLElement, newNode:HTMLElement) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

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

export function formatLogDate(ms:number){
    DateWorker.setTime(ms);
    return DateWorker.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric", second:"numeric", hour12: false});
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

export const objectToText = (obj:any, prefix:boolean = false, flat:string[] = [], l:number = 0, hidden:string[] = []):string[] => {
    const spc = '  '.repeat(l);
    obj && Object.keys(obj).forEach((key) => {
        if(!hidden.includes(key)){
            let p = prefix ? `${spc} ${key}: ` : '';
            if (typeof obj[key] === 'object'){
                if(obj[key] instanceof Array){
                    flat.push(`${p}${obj[key].join(' | ')}`);
                }else if(obj[key] instanceof Date){
                    flat.push(`${p}${obj[key].toString()}`);
                }else if(obj[key] instanceof Function){
                    flat.push(`${p}Function()`);
                }else{
                    flat.push(`${p}`);
                    objectToText(obj[key], prefix, flat, l+1);
                }
            }else{
                if(!(obj[key] instanceof Function)) flat.push(`${p}${obj[key]}`);
            }
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
  


export const createSVGElement = (name:string, props:any, ...classes:string[]) => {
    const element = document.createElementNS(SVG_NS, name);
    props && setAttrs(element,props);
    classes && classes.forEach(c => element.classList.add(c));
    return element;
}

export const setAttrs = (e:Element, a:any) => Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v as any));
export const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));

//✅ POLYGONAL BRUTALITY
export const point_in_poly = (point:any, pX:number[], pY:number[]) => {
    //#//poly is special
    let x = point.x;
    let y = point.y;
    let j = pX.length - 1;
    let odd = false;

    for (let i = 0; i < pX.length; i++) {
        if ((pY[i] < y && pY[j] >= y || pY[j] < y && pY[i] >= y) && (pX[i] <= x || pX[j] <= x)) {
            odd !== (pX[i] + (y - pY[i]) * (pX[j] - pX[i]) / (pY[j] - pY[i])) < x;
        }
        j = i;
    }
    return odd;
}

//✅ POLYGONAL BRUTALITY
export const poly_to_bez = (pd:number[][], smooth:number=1.0) => {
    // https://stackoverflow.com/questions/15691499/how-do-i-draw-a-closed-curve-over-a-set-of-points
    // http://www.elvenprogrammer.org/projects/bezier/reference/index.html
    // Assume we need to calculate the control
    // points between (x1,y1) and (x2,y2).
    // Then x0,y0 - the previous vertex,
    //      x3,y3 - the next one.

    let ni, x0, y0, x1, y1, x2, y2, x3, y3, xc1, yc1, xc2, yc2, xc3, yc3, len1, len2, len3, k1, k2, xm1, xm2, ym1, ym2, ctrl1_x, ctrl1_y, ctrl2_x, ctrl2_y;
    const ar_set = [];
    
    const fluch = (n:number) => {
        if(n < 0) return pd.length-1;
        if(n >= pd.length) return n - (pd.length);
        return n;
    }

    for(let i = 0; i < pd.length; i++){ // polydata is tuples
        x0 = pd[fluch(i-1)][0];
        y0 = pd[fluch(i-1)][1];
        x1 = pd[i][0];
        y1 = pd[i][1];
        x2 = pd[fluch(i+1)][0];
        y2 = pd[fluch(i+1)][1];
        x3 = pd[fluch(i+2)][0];
        y3 = pd[fluch(i+2)][1];

        xc1 = (x0 + x1) / 2.0;
        yc1 = (y0 + y1) / 2.0;
        xc2 = (x1 + x2) / 2.0;
        yc2 = (y1 + y2) / 2.0;
        xc3 = (x2 + x3) / 2.0;
        yc3 = (y2 + y3) / 2.0;

        len1 = 1 / fsqrt((x1-x0) * (x1-x0) + (y1-y0) * (y1-y0));
        len2 = 1 / fsqrt((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1));
        len3 = 1 / fsqrt((x3-x2) * (x3-x2) + (y3-y2) * (y3-y2));

        k1 = len1 / (len1 + len2);
        k2 = len2 / (len2 + len3);

        xm1 = xc1 + (xc2 - xc1) * k1;
        ym1 = yc1 + (yc2 - yc1) * k1;
        xm2 = xc2 + (xc3 - xc2) * k2;
        ym2 = yc2 + (yc3 - yc2) * k2;

        // Resulting control points. Here smooth_value is mentioned
        // above coefficient K whose value should be in range [0...1].
        ctrl1_x = xm1 + (xc2 - xm1) * smooth + x1 - xm1;
        ctrl1_y = ym1 + (yc2 - ym1) * smooth + y1 - ym1;
        ctrl2_x = xm2 + (xc2 - xm2) * smooth + x2 - xm2;
        ctrl2_y = ym2 + (yc2 - ym2) * smooth + y2 - ym2;

        // ar_set.push([x1,y1,ctrl1_x,ctrl1_y,ctrl2_x,ctrl2_y,x2,y2]);
        ar_set.push({type:'C',values:[ctrl1_x, ctrl1_y, ctrl2_x, ctrl2_y, x2, y2]});
    }

    return ar_set;

}


//✅ fast 1/square-root (dist);
let buf = new ArrayBuffer(4), f32=new Float32Array(buf), u32=new Uint32Array(buf), x2, y;
export const fsqrt = (d:number) => {
  x2 = 0.5 * (f32[0] = d);
  u32[0] = (0x5f3759df - (u32[0] >> 1));
  y = f32[0];
  y = y * ( 1.5 - ( x2 * y * y ) ); // 1st iteration
  return y;
}

export const easeInOut = (t:number) => t > 0.5 ? 4 * Math.pow((t - 1), 3) + 1 : 4 * Math.pow(t, 3);

export const norm = (min:number, val:number, max:number) => ((val - min) / (max - min)) || 0;

export const interp = (a:number, t:number, b:number) => (a) - ((a - b) * t);


export type source = {
    url:string,
    size?:number | undefined,
    status?:string | undefined,
    type?:string | undefined,
    data?:any | undefined,
}

export async function loader(src_list:source[], cb:any=null) {
	const container:Promise<any>[] = [];
	const opts = {
	  headers: {
		'mode':'cors'
	  }
	}

	src_list.forEach(src => {
		if (cb) cb(src.url,'start');

		let ref = fetch(src.url, opts)
		.then(response => {
			src.size = Number(response.headers.get("content-length"));
			return response.text()
		})
		.then((text) => {
			if (cb) cb(src,'loaded');
			return src.type === 'json' ? JSON.parse(text) : text;
		})
		.catch((error) => {
            if (cb) cb(src,'error', error.status, error);
			console.log(error.status, error);
			return error;
		})
		container.push(ref);
	});

	const done = await Promise.all(container);
	src_list.forEach((src,i) => src.data = done[i]);
	return src_list;
}

export const round_to_dec = (n:number, d:number) => Math.round(n*(10**d))/10**d || 0;

// not that simple...
export const f32_slide = (arr:Float32Array, shape:number[], axis:number, r:number) => {
    const mem = {m: new Float32Array(shape[axis])};
    Math.sign(r) === -1 && (r = r+shape[axis]);
    let xr, sd = shape[axis];
    for(let i = 0; i < arr.length; i++){
        xr = i % sd;
        if(axis === 0){
            mem.m[xr] = arr[i];
            arr[i] = (xr + r < sd) ? arr[i + r] : mem.m[(xr + r) - sd];
        }
    }
    delete mem.m;
}

//not very elegant looking..
export const f32_upres = (arr:Float32Array, shape:number[], axis:number, r:number) => {
    const s = [...shape];
    const [sx, sy] = [...s];
    s[axis] *= r;
    const i_siz = (s[0] * s[1]);
    const k_arr = new Float32Array(i_siz);
    let a, b, c, xr, xrm, h=-(r-1);

    for(let i = 0; i < arr.length; i++){
        xr = i % sx;
        xr === (0) && (h += (r-1));
        xrm = i - xr; /// intervals of sx

        if(axis === 0){
            a = arr[xrm + xr];
            b = arr[xrm + xr + 1] || arr[xrm];
            for(let m = 0; m < r; m++){
                c = interp(a, m/r, b);
                k_arr[xrm*r + xr*r + m] = c;
            }
        }

        if(axis === 1){
            a = arr[i];
            b = arr[i + sx] || arr[xr];
            for(let m = 0; m < r; m++){
                c = interp(a, m/r, b);
                k_arr[i + sx*h + m*sx] = c;
            }
        }
    }

    return k_arr;
}

export const f32_upres_to_buffer = (arr:Float32Array, to_arr:Float32Array, shape:number[], axis:number, r:number) => {
    const s = [...shape];
    const [sx, sy] = [...s];
    // s[axis] *= r;
    // const i_siz = (s[0] * s[1]);
    // const k_arr = new Float32Array(i_siz);
    let a, b, c, xr, xrm, h=-(r-1);

    for(let i = 0; i < arr.length; i++){
        xr = i % sx;
        xr === (0) && (h += (r-1));
        xrm = i - xr; /// intervals of sx

        if(axis === 0){
            a = arr[xrm + xr];
            b = arr[xrm + xr + 1] || arr[xrm];
            for(let m = 0; m < r; m++){
                c = interp(a, m/r, b);
                to_arr[xrm*r + xr*r + m] = c;
            }
        }

        if(axis === 1){
            a = arr[i];
            b = arr[i + sx] || arr[xr];
            for(let m = 0; m < r; m++){
                c = interp(a, m/r, b);
                to_arr[i + sx*h + m*sx] = c;
            }
        }
    }

    // return k_arr;
}

//https://stackoverflow.com/questions/69216046/javascript-how-to-get-the-size-in-bytes-of-a-map
export const map_size_bytes = (oMap:Map<string | number, any>) => {
    function replacer(key:number | string, value: any) {
      if(value instanceof Map) {
        return {
          dataType: 'Map',
          value: [...value],
        };
      } else {
        return value;
      }
    }
    return JSON.stringify(oMap, replacer).length;
}

export const zpad = (n:number,i:number=2) => n.toString().padStart(i,'0');

export const avg = (n:number[]) => (n.reduce((a, b) => a + b, 0) / n.length) || 0;