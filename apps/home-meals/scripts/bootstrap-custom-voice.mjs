const apiKey=process.env.OPENAI_API_KEY?.trim();
if(!apiKey){console.error("VOICE_BOOTSTRAP_ERROR missing OPENAI_API_KEY");process.exit(1)}
const readParts=(prefix,countName)=>{
  const n=Number(process.env[countName]||"0");
  if(!Number.isInteger(n)||n<1)throw new Error(`missing ${countName}`);
  let s="";
  for(let i=0;i<n;i++){const key=`${prefix}_${String(i).padStart(2,"0")}`,part=process.env[key];if(!part)throw new Error(`missing ${key}`);s+=part}
  return Buffer.from(s,"base64");
};
const postForm=async(path,form)=>{
  const res=await fetch(`https://api.openai.com/v1${path}`,{method:"POST",headers:{Authorization:`Bearer ${apiKey}`},body:form});
  const text=await res.text();
  if(!res.ok)throw new Error(`${path} ${res.status}: ${text.slice(0,2000)}`);
  return JSON.parse(text);
};
try{
  const consentAudio=readParts("VOICE_BOOTSTRAP_CONSENT", "VOICE_BOOTSTRAP_CONSENT_PARTS");
  const sampleAudio=readParts("VOICE_BOOTSTRAP_SAMPLE", "VOICE_BOOTSTRAP_SAMPLE_PARTS");
  let consentId=process.env.VOICE_BOOTSTRAP_EXISTING_CONSENT_ID?.trim()||"";
  if(!consentId){
    const form=new FormData();
    form.append("name","Josh Home Meals consent");
    form.append("language","en");
    form.append("recording",new Blob([consentAudio],{type:"audio/webm"}),"josh_voice_consent.webm");
    const result=await postForm("/audio/voice_consents",form);
    consentId=String(result.id||result.consent_id||"");
    if(!consentId)throw new Error("consent response missing id");
    console.log(`HOME_MEALS_VOICE_CONSENT_ID=${consentId}`);
  }
  const voiceForm=new FormData();
  voiceForm.append("name","Josh Home Meals");
  voiceForm.append("audio_sample",new Blob([sampleAudio],{type:"audio/webm"}),"josh_voice_sample.webm");
  voiceForm.append("consent",consentId);
  const voice=await postForm("/audio/voices",voiceForm);
  const voiceId=String(voice.id||voice.voice_id||"");
  if(!voiceId)throw new Error("voice response missing id");
  console.log(`HOME_MEALS_CUSTOM_VOICE_ID=${voiceId}`);
}catch(err){
  console.error("VOICE_BOOTSTRAP_ERROR",err instanceof Error?err.message:String(err));
  process.exit(1);
}
