import {DraftRecipe} from "@/components/DraftRecipe";
export default async function DraftRecipePage({params}:{params:Promise<{id:string}>}){const{id}=await params;return <DraftRecipe id={id}/>}
