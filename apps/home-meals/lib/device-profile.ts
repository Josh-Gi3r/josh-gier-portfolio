export type HouseholdPerson="josh"|"g";
export const HOUSEHOLD_PERSON_KEY="home-meals-person-v1";

export function getHouseholdPerson():HouseholdPerson|null{
 if(typeof window==="undefined")return null;
 try{const value=localStorage.getItem(HOUSEHOLD_PERSON_KEY);return value==="josh"||value==="g"?value:null}catch{return null}
}
export function setHouseholdPerson(person:HouseholdPerson){
 try{localStorage.setItem(HOUSEHOLD_PERSON_KEY,person);window.dispatchEvent(new CustomEvent("home-meals:person",{detail:person}))}catch{}
}
export function householdPersonLabel(person:HouseholdPerson|null){return person==="g"?"G":"Josh"}
