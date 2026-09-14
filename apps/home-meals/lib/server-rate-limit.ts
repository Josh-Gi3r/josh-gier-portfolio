type Bucket={count:number;resetAt:number};
const buckets=new Map<string,Bucket>();

export function requestRateKey(headers:Headers,scope:string){
 const forwarded=headers.get("x-forwarded-for")?.split(",")[0]?.trim();
 const ip=forwarded||headers.get("x-real-ip")?.trim()||headers.get("cf-connecting-ip")?.trim()||"unknown";
 return `${scope}:${ip}`;
}

export function consumeRateLimit(key:string,limit:number,windowMs:number,now=Date.now()){
 if(buckets.size>1000)for(const[k,b]of buckets)if(b.resetAt<=now)buckets.delete(k);
 const existing=buckets.get(key);
 const bucket=!existing||existing.resetAt<=now?{count:0,resetAt:now+windowMs}:existing;
 bucket.count+=1;buckets.set(key,bucket);
 return{ok:bucket.count<=limit,retryAfterSeconds:Math.max(1,Math.ceil((bucket.resetAt-now)/1000)),remaining:Math.max(0,limit-bucket.count)};
}

export function clearRateLimit(key:string){buckets.delete(key)}
