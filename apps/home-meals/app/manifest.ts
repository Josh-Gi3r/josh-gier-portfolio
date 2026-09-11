import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Home Meals", short_name: "Home Meals", description: "Josh & G's household food OS", start_url: "/", display: "standalone", background_color: "#f7f4ee", theme_color: "#f7f4ee", icons: [] };
}
