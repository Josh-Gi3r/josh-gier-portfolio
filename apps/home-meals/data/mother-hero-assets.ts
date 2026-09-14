// Hero photography for the mother bases. Six bases have a rendered hero; the
// others (CLEAR, ONION) render a tone tile until a photo exists. Assets only,
// no food truth lives here.
const hf=(id:string)=>`https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_${id}.png`;
export const motherHeroImages:Readonly<Record<string,string>>={
 red:hf("20260911_134125_992ea583-ae5c-450a-b59a-45c770f8e83f"),
 gold:hf("20260911_134125_428ee036-d32e-4fe3-add1-8bdfa634165f"),
 rempah:hf("20260911_134125_eeec74ee-7228-4a05-9f80-2c748388dd17"),
 sambal:hf("20260911_134125_4c0238e8-2470-40fc-acd0-f28cce25854f"),
 dark:hf("20260911_134125_18972d2b-6ce4-4010-819e-1d5a40a928d9"),
 blond:hf("20260911_134125_ce809161-e47d-40dd-a670-bed905d75ae9")
};
