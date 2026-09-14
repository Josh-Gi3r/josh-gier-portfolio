import {Help} from "@/components/app/Help";
import {HouseholdStatusCard} from "@/components/HouseholdStatusCard";
import {HouseholdMemory} from "@/components/HouseholdMemory";
export default function HelpPage(){return <><Help/><div className="hm-screen" style={{paddingTop:0}}><HouseholdMemory/><HouseholdStatusCard/></div></>}
