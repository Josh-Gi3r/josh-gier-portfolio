import {readFileSync,readdirSync} from "node:fs";
import {join} from "node:path";
import {createDecipheriv} from "node:crypto";

const apiKey=process.env.OPENAI_API_KEY?.trim();
if(!apiKey){console.error("VOICE_BOOTSTRAP_ERROR missing OPENAI_API_KEY");process.exit(1)}

function readEncryptedBundle(){
  const keyRaw=process.env.VOICE_BOOTSTRAP_KEY?.trim();
  if(!keyRaw)throw new Error("missing VOICE_BOOTSTRAP_KEY");
  const key=Buffer.from(keyRaw,"base64");
  if(key.length!==32)throw new Error("VOICE_BOOTSTRAP_KEY must decode to 32 bytes");
  const dir=join(process.cwd(),"scripts","voice-bootstrap-payload");
  const encoded=readdirSync(dir).filter(x=>x.startsWith("part-")).sort().map(x=>readFileSync(join(dir,x),"utf8").trim()).join("");
  const raw=Buffer.from(encoded,"base64");
  if(raw.length<32)throw new Error("encrypted payload is too small");
  const nonce=raw.subarray(0,12),body=raw.subarray(12),tag=body.subarray(body.length-16),ciphertext=body.subarray(0,body.length-16);
  const decipher=createDecipheriv("aes-256-gcm",key,nonce);
  decipher.setAAD(Buffer.from("home-meals-custom-voice-v1"));
  decipher.setAuthTag(tag);
  const plain=Buffer.concat([decipher.update(ciphertext),decipher.final()]);
  const consentLength=plain.readUInt32BE(0);
  if(consentLength<1||consentLength>=plain.length-4)throw new Error("invalid consent length");
  return {consentAudio:plain.subarray(4,4+consentLength),sampleAudio:plain.subarray(4+consentLength)};
}

async function postForm(path,form){
  const res=await fetch(`https://api.openai.com/v1${path}`,{method:"POST",headers:{Authorization:`Bearer ${apiKey}`},body:form});
  const text=await res.text();
  if(!res.ok)throw new Error(`${path} ${res.status}: ${text.slice(0,2000)}`);
  return JSON.parse(text);
}

try{
  const {consentAudio,sampleAudio}=readEncryptedBundle();
  let consentId=process.env.VOICE_BOOTSTRAP_EXISTING_CONSENT_ID?.trim()||"";
  if(!consentId){
    const form=new FormData();
    form.append("name","Josh Home Meals consent");
    form.append("language","en");
    form.append("recording",new Blob([consentAudio],{type:"audio/ogg"}),"josh_voice_consent.ogg");
    const result=await postForm("/audio/voice_consents",form);
    consentId=String(result.id||result.consent_id||"");
    if(!consentId)throw new Error("consent response missing id");
    console.log(`HOME_MEALS_VOICE_CONSENT_ID=${consentId}`);
  }
  const voiceForm=new FormData();
  voiceForm.append("name","Josh Home Meals");
  voiceForm.append("audio_sample",new Blob([sampleAudio],{type:"audio/ogg"}),"josh_voice_sample.ogg");
  voiceForm.append("consent",consentId);
  const voice=await postForm("/audio/voices",voiceForm);
  const voiceId=String(voice.id||voice.voice_id||"");
  if(!voiceId)throw new Error("voice response missing id");
  console.log(`HOME_MEALS_CUSTOM_VOICE_ID=${voiceId}`);
}catch(err){
  console.error("VOICE_BOOTSTRAP_ERROR",err instanceof Error?err.message:String(err));
  process.exit(1);
}
