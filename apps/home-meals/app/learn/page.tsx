import {Help} from "@/components/app/Help";
import {HouseholdStatusCard} from "@/components/HouseholdStatusCard";
import {HouseholdMemory} from "@/components/HouseholdMemory";
import {JoshMemorySettings} from "@/components/JoshMemorySettings";
export default function HelpPage(){return <><Help/><div className="hm-screen" style={{paddingTop:0}}><JoshMemorySettings/><HouseholdMemory/><HouseholdStatusCard/></div></>}
