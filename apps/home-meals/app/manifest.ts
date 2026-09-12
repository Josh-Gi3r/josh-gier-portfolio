import type {MetadataRoute} from "next";
export default function manifest():MetadataRoute.Manifest{return{name:"Home Meals",short_name:"Home Meals",description:"Josh & G's home cooking app",id:"/",start_url:"/",scope:"/",display:"standalone",background_color:"#f8f4ec",theme_color:"#f8f4ec",icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any"}]}}
