import type {Metadata,Viewport} from "next";
import {Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import {Shell} from "@/components/app/Shell";
import {HomeBar} from "@/components/app/HomeBar";
import {FirstRunKitchen} from "@/components/FirstRunKitchen";
import {HouseholdStateProvider} from "@/components/HouseholdState";
import {HouseholdSyncV12} from "@/components/HouseholdSyncV12";
import {SmartAskRuntime} from "@/components/SmartAskRuntime";
import {SmartAskVisibility} from "@/components/SmartAskVisibility";
import {VisionRuntime} from "@/components/VisionRuntime";
import {VoiceRuntime} from "@/components/VoiceRuntime";
import {PwaRuntime} from "@/components/PwaRuntime";
const jakarta=Plus_Jakarta_Sans({subsets:["latin"],weight:["400","500","600","700","800"],variable:"--font-jakarta",display:"swap"});
export const metadata:Metadata={title:{default:"Home Meals",template:"%s · Home Meals"},description:"Josh & G's home cooking app.",applicationName:"Home Meals",robots:{index:false,follow:false,nocache:true,googleBot:{index:false,follow:false,noimageindex:true}},referrer:"no-referrer",appleWebApp:{capable:true,title:"Home Meals",statusBarStyle:"default"}};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#fbfdfb",colorScheme:"light"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={jakarta.variable}><body><PwaRuntime/><HouseholdStateProvider><SmartAskVisibility/><SmartAskRuntime/><VisionRuntime/><Shell>{children}</Shell><HomeBar/><HouseholdSyncV12/><VoiceRuntime/><FirstRunKitchen/></HouseholdStateProvider></body></html>}
