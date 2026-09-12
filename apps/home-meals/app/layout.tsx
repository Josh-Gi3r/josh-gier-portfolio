import type {Metadata,Viewport} from "next";
import "./globals.css";
import {Shell} from "@/components/app/Shell";
import {HouseholdStateProvider} from "@/components/HouseholdState";
import {PwaRuntime} from "@/components/PwaRuntime";
import {MoreNav} from "@/components/MoreNav";
export const metadata:Metadata={title:{default:"Home Meals",template:"%s · Home Meals"},description:"Josh & G's home cooking app.",applicationName:"Home Meals",robots:{index:false,follow:false,nocache:true,googleBot:{index:false,follow:false,noimageindex:true}},referrer:"no-referrer",appleWebApp:{capable:true,title:"Home Meals",statusBarStyle:"default"}};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#f8f4ec",colorScheme:"light"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><PwaRuntime/><HouseholdStateProvider><Shell>{children}</Shell><MoreNav/></HouseholdStateProvider></body></html>}
