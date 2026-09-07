import test from 'node:test';
import assert from 'node:assert/strict';
import {projectiveMatrix} from './dist/screens.js';

test('all four corners follow the photographed TV at multiple display scales',()=>{
  const source=[[0,0],[400,0],[400,300],[0,300]];
  const photographed=[[1223,404],[1370,427],[1362,601],[1217,555]];
  for(const scale of [.226,.467,1,2.25]){
    const target=photographed.map(([x,y])=>[x*scale,y*scale]);
    const m=projectiveMatrix(400,300,target);
    source.forEach(([x,y],i)=>{
      const divisor=m[3]*x+m[7]*y+m[15];
      const result=[(m[0]*x+m[4]*y+m[12])/divisor,(m[1]*x+m[5]*y+m[13])/divisor];
      result.forEach((value,axis)=>assert.ok(Math.abs(value-target[i][axis])<1e-7));
    });
  }
});
