import { loader, source } from './index'

function cb(){
    console.log(arguments);
}

const batch:source[] = [
    {url:'http://localhost:3000/sun.svg'},
    {url:'http://localhost:3000/test.json.txt',type:'json'},
    {url:'http://localhost:3000/water.json.txt',type:'text'},
]

loader(batch, cb).then((d) => console.log(d));
