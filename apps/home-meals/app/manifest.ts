import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Home Meals", short_name: "Home Meals", description: "Josh & G's private home cooking, prep and planning app", start_url: "/", display: "standalone", background_color: "#fbf8f1", theme_color: "#1f5a40", icons: [{src:"/icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any"}] };
}
