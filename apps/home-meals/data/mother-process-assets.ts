export type ProcessAsset={stage:string;caption:string;url:string};
const hf=(slug:string)=>`https://d8j0ntlcm91z4.cloudfront.net/user_33B38CK6rN3xZGtZllRALJXPhHT/hf_${slug}_min.webp`;

export const motherProcessImages:Record<string,ProcessAsset[]>={
 red:[
  {stage:"01 · MISE EN PLACE",caption:"Onion, garlic, tomato paste and tomatoes measured before heat starts.",url:hf("20260911_143714_c0eb3348-63ff-4a03-a49e-079ef48bc107")},
  {stage:"02 · ONION CUE",caption:"Soft, translucent-sweet onion. RED does not want deep browning.",url:hf("20260911_143730_1c18d38f-10f4-4268-9700-4dcbd8852304")},
  {stage:"03 · FINAL TEXTURE",caption:"Glossy brick-red concentrate that briefly holds a clean spoon trail.",url:hf("20260911_143746_f227e2ce-bb85-41e9-b5e0-341f77fea7a7")},
  {stage:"04 · PORTION",caption:"Cool, divide into labelled working portions, then freeze.",url:hf("20260911_143802_171bc463-255a-4cd0-b26e-f7edb5351b9c")}
 ],
 gold:[
  {stage:"01 · MISE EN PLACE",caption:"Onion, ginger, garlic, tomato and warm spices weighed separately.",url:hf("20260911_143714_88ba4ddb-0bb2-474b-8d76-d1c0a56c1fe9")},
  {stage:"02 · ONION CUE",caption:"Genuinely deep golden onion before tomato — this is the flavour foundation.",url:hf("20260911_143730_9b3ab963-0dd1-4cdb-a03b-3fe963e1b2c1")},
  {stage:"03 · BHUNA CUE",caption:"Thick, glossy masala with the first oil separation visible at the edges.",url:hf("20260911_143746_0fb3dff8-ec59-4e4f-86d6-503ce89f9d95")},
  {stage:"04 · PORTION",caption:"Cool, divide into labelled working portions, then freeze.",url:hf("20260911_143802_ff9cacd0-23ed-45b3-9c96-3af5e6f05b41")}
 ],
 rempah:[
  {stage:"01 · MISE EN PLACE",caption:"Shallot, garlic, ginger, galangal, lemongrass, turmeric and candlenut.",url:hf("20260911_143714_ded39511-5eca-4eba-9123-17331287afbd")},
  {stage:"02 · FRYING CUE",caption:"Moisture has cooked away and small beads of oil are beginning to release.",url:hf("20260911_143730_4563dd8b-931b-4bec-9881-4410a6f7bd1d")},
  {stage:"03 · FINAL TEXTURE",caption:"Deep golden-orange, cohesive, spoonable and no longer raw-smelling.",url:hf("20260911_143746_d10fdce8-8638-4398-9cfb-931864b8c3a1")},
  {stage:"04 · PORTION",caption:"Cool, divide into labelled working portions, then freeze.",url:hf("20260911_143803_deb881a3-86bb-4eb6-8778-7d999ed534f2")}
 ],
 sambal:[
  {stage:"01 · MISE EN PLACE",caption:"Soaked dried chilli, shallot, garlic, belacan, tamarind and palm sugar.",url:hf("20260911_143714_51897138-c80a-4440-85c2-9c5b7ef58f8e")},
  {stage:"02 · PECAH MINYAK",caption:"The critical cue: darker paste with unmistakable red oil separated around it.",url:hf("20260911_143730_4c3fd6c0-8c72-4a2d-a364-f7021a05823f")},
  {stage:"03 · FINAL TEXTURE",caption:"Deep brick red, glossy, thick and rounded rather than harsh and raw.",url:hf("20260911_143746_96d688f1-c784-4c6d-b61c-400a00edcf5c")},
  {stage:"04 · PORTION",caption:"Cool, divide into labelled working portions, then freeze.",url:hf("20260911_143802_0d7d1c93-d38e-4fd7-adc0-0ab14d985190")}
 ],
 dark:[
  {stage:"01 · MISE EN PLACE",caption:"Unsalted brown stock plus classic aromatics; low salt matters before reduction.",url:hf("20260911_143714_57b02146-0e0f-40f6-b57f-bc9f0e5dcc90")},
  {stage:"02 · REDUCTION CUE",caption:"Quiet simmer, never a violent boil; colour and gloss intensify slowly.",url:hf("20260911_143730_792fb83f-169a-46db-bf2f-4cccfbdf7cf7")},
  {stage:"03 · FINAL BODY",caption:"The reduction coats the spoon and flows slowly without starch or cream.",url:hf("20260911_143746_64afe81b-6d6c-4cdd-a8ea-a80b22c3e961")},
  {stage:"04 · PORTION",caption:"Cool, divide the concentrate into small labelled working portions, then freeze.",url:hf("20260911_143802_70fc7db0-0a51-4815-8448-af85e2a82feb")}
 ],
 blond:[
  {stage:"01 · MISE EN PLACE",caption:"Onion, carrot and celery measured for a pale, sweet soffritto-style base.",url:hf("20260911_143715_659d35b1-14f8-449d-8fb4-3020472530c5")},
  {stage:"02 · VEGETABLE CUE",caption:"Fully soft and collapsed but still pale. BLOND should not become caramelised onion.",url:hf("20260911_143730_df576b11-60f5-42aa-ad26-e4d78b738506")},
  {stage:"03 · FINAL TEXTURE",caption:"Silky pale-golden savoury foundation, spoonable and not browned.",url:hf("20260911_143746_fc54f3ba-42f5-4682-9d5e-d3c787660df6")},
  {stage:"04 · PORTION",caption:"Cool, divide into labelled working portions, then freeze.",url:hf("20260911_143802_2a034ba1-0d9b-4fc7-9989-172d91e9b4cf")}
 ],
 clear:[
  {stage:"01 · MISE EN PLACE",caption:"Chicken frames, backs, wings and/or feet with measured cold water; onion is optional.",url:hf("20260914_073645_591c6848-319b-459c-81f9-1e0fa6d46b4a")},
  {stage:"02 · BARE SIMMER",caption:"Bring it up slowly, skim early, and keep the surface barely moving rather than boiling hard.",url:hf("20260914_073646_47c38322-fe9a-4e4c-8439-197572ce902b")},
  {stage:"03 · STRAIN",caption:"Strain cleanly and defat; the stock should stay pale-golden and visibly clear.",url:hf("20260914_073647_f8ecd5ba-ed2d-4aef-9a22-0f7c7b4f2181")},
  {stage:"04 · PORTION",caption:"Cool promptly, divide into practical working portions, then freeze.",url:hf("20260914_073645_c9e8b3b8-7144-46d2-984a-554d153f9b23")}
 ],
 onion:[
  {stage:"01 · MISE EN PLACE",caption:"Yellow onions sliced pole-to-pole with butter, a little neutral oil and salt.",url:hf("20260914_073707_4cf2d756-eefb-4220-9a88-2fdb8b43d84b")},
  {stage:"02 · FOND & DEGLAZE",caption:"Let light fond develop, then deglaze it back into the collapsed onions with tiny splashes of water.",url:hf("20260914_073707_6cc03b49-bfce-4678-a3a3-02511d782a3f")},
  {stage:"03 · MAHOGANY CUE",caption:"Uniformly deep mahogany and jammy, with no black edges and no pale centres.",url:hf("20260914_073707_d4c8200f-cbe5-413d-a151-22e9444d5ac2")},
  {stage:"04 · PORTION",caption:"Cool promptly, divide into practical working portions, then freeze.",url:hf("20260914_073707_5af7f883-5033-466c-a958-3bdec739a226")}
 ]
};