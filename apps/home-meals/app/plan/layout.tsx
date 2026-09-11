import type {ReactNode} from "react";
import {ShoppingSync} from "@/components/app/ShoppingSync";
export default function PlanLayout({children}:{children:ReactNode}){return <>{children}<ShoppingSync/></>}
