"use client";
import {useEffect,useRef,useState} from "react";
import styles from "./VoiceRuntime.module.css";

const STATE_KEY="home-meals-household-v11";
type Status="idle"|"connecting"|"listening"|"error";

function householdState(){try{const raw=localStorage.getItem(STATE_KEY);if(!raw)return {};const value=JSON.parse(raw);if(value&&typeof value==="object")delete value.mealPhotos;return value}catch{return {}}}
function fillAsk(text:string){window.dispatchEvent(new Event("home-meals:ask"));window.setTimeout(()=>{const input=document.querySelector<HTMLInputElement>(".hm-composer-v5 input");if(!input)return;const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value")?.set;setter?.call(input,text);input.dispatchEvent(new Event("input",{bubbles:true}));window.setTimeout(()=>input.form?.requestSubmit(),30)},120)}

export function VoiceRuntime(){
 const[status,setStatus]=useState<Status>("idle");const[message,setMessage]=useState("");const pcRef=useRef<RTCPeerConnection|null>(null);const streamRef=useRef<MediaStream|null>(null);const audioRef=useRef<HTMLAudioElement|null>(null);
 const stop=()=>{pcRef.current?.close();pcRef.current=null;streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;if(audioRef.current){audioRef.current.pause();audioRef.current.srcObject=null;audioRef.current=null}setStatus("idle");setMessage("")};
 const fallbackSpeech=()=>{const W=window as typeof window & {SpeechRecognition?:new()=>any;webkitSpeechRecognition?:new()=>any};const Recognition=W.SpeechRecognition||W.webkitSpeechRecognition;if(!Recognition){setMessage("Voice isn’t available in this browser yet.");setStatus("error");return}const rec=new Recognition();rec.lang="en-SG";rec.interimResults=false;rec.maxAlternatives=1;rec.onstart=()=>setStatus("listening");rec.onresult=(e:any)=>{const text=e.results?.[0]?.[0]?.transcript??"";setStatus("idle");if(text)fillAsk(text)};rec.onerror=()=>{setMessage("I couldn’t hear that clearly. Try again or type to Home.");setStatus("error")};rec.onend=()=>setStatus(s=>s==="listening"?"idle":s);rec.start()};
 const start=async()=>{if(status==="connecting")return;if(pcRef.current){stop();return}setStatus("connecting");setMessage("");try{
   if(!navigator.mediaDevices?.getUserMedia||typeof RTCPeerConnection==="undefined"){fallbackSpeech();return}
   const pc=new RTCPeerConnection();pcRef.current=pc;const audio=new Audio();audio.autoplay=true;audioRef.current=audio;pc.ontrack=e=>{audio.srcObject=e.streams[0]};
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});streamRef.current=stream;for(const track of stream.getTracks())pc.addTrack(track,stream);
   const dc=pc.createDataChannel("oai-events");dc.addEventListener("open",()=>setStatus("listening"));dc.addEventListener("message",event=>{try{const data=JSON.parse(event.data);if(data?.type==="error"){setMessage("Voice hit a connection error. You can still type to Home.");setStatus("error")}}catch{}});
   const offer=await pc.createOffer();await pc.setLocalDescription(offer);if(pc.iceGatheringState!=="complete")await new Promise<void>(resolve=>{const timeout=setTimeout(resolve,1800);const done=()=>{if(pc.iceGatheringState==="complete"){clearTimeout(timeout);pc.removeEventListener("icegatheringstatechange",done);resolve()}};pc.addEventListener("icegatheringstatechange",done)});
   const res=await fetch("/api/realtime",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sdp:pc.localDescription?.sdp??offer.sdp,state:householdState()})});
   if(res.status===503){pc.close();pcRef.current=null;stream.getTracks().forEach(t=>t.stop());streamRef.current=null;fallbackSpeech();return}
   if(!res.ok)throw new Error("realtime_failed");const answer=await res.text();await pc.setRemoteDescription({type:"answer",sdp:answer});
   pc.onconnectionstatechange=()=>{if(["failed","closed"].includes(pc.connectionState)){setMessage("Voice connection ended. Tap the mic to try again.");setStatus("error")}};
  }catch{pcRef.current?.close();pcRef.current=null;streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;fallbackSpeech()}};
 useEffect(()=>{const handler=()=>start();window.addEventListener("home-meals:voice",handler);return()=>{window.removeEventListener("home-meals:voice",handler);pcRef.current?.close();streamRef.current?.getTracks().forEach(t=>t.stop())}},[status]);
 if(status==="idle")return null;return <div className={`${styles.voice} ${status==="error"?styles.error:""}`} role="status"><span className={styles.dot}/><span><strong>{status==="connecting"?"Connecting Home…":status==="listening"?"Home is listening":"Voice needs attention"}</strong>{message&&<small>{message}</small>}</span><button onClick={status==="error"?()=>{setStatus("idle");setMessage("")}:stop}>{status==="error"?"Dismiss":"Stop"}</button></div>;
}
