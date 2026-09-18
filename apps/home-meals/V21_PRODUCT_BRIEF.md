# Home Meals V21 — Working Recipe Images

## Product goal
Give Josh a real image-generation action for new household recipes. A new/off-catalog dish can move through:

ask → working recipe → generated hero image → cook → rate → revise → keep as one of ours.

V21 is additive to V20. It does not replace the verified Home Meals recipe catalogue and it does not turn generated imagery into culinary truth.

## Product decisions
- Use OpenAI GPT Image 2.5 for working-recipe imagery.
- Default model: `gpt-image-2.5-sunburst`, the highest-capability GPT Image 2.5 API model.
- Default quality: `max`.
- Default output: 1536×1024 WebP, optimized for recipe hero/card crops.
- Generated images are illustrations of the working recipe, never represented as a real photo of a cook.
- Do not generate an image for every draft automatically.
- Josh may suggest image generation for a concrete new recipe.
- Josh may execute generation when the user explicitly asks to generate/show/make an image.
- Re-generating never changes recipe truth or Kitchen state.
- Working-recipe images remain separate from canonical verified recipe assets.

## Core flows

### New recipe in Ask Josh
1. Josh returns a structured household draft.
2. User can save it.
3. User can generate an image.
4. If the user explicitly asked for an image, the image action may start automatically after the draft is saved.
5. The resulting image is attached to the working recipe.

### Existing working recipe
- No image → Generate image
- Has image → Regenerate
- Has image → Try another look
- Candidate alternate → Use this image / Keep current

### Revised recipe
Josh may suggest another image if the formulation changed materially, but never overwrites an existing hero without an explicit generation action.

## Storage
Recipe image bytes are stored in household Postgres, not as base64 inside recipe JSON.

`home_meals_recipe_images`
- id
- household_id
- draft_id
- mime_type
- image_bytes
- prompt
- model
- quality
- width
- height
- look
- selected
- created_at

Only one image is selected per working recipe.

## API
### GET /api/recipe-image?draftId=
Returns image metadata and selected hero.

### POST /api/recipe-image
Generates one image.
Input:
- draftId
- mode: initial | replace | candidate
- lookHint optional

### PATCH /api/recipe-image
Selects an existing candidate as the hero.

### GET /api/recipe-image/[id]
Serves the private image bytes to an authenticated household session.

## Josh action contract
`recipeImageAction.type`:
- none
- suggest_generate_recipe_image
- generate_recipe_image
- regenerate_recipe_image

Rules:
- `generate_recipe_image` only for an explicit user request for an image.
- `regenerate_recipe_image` only when the user explicitly asks to redo/change the image.
- `suggest_generate_recipe_image` may be used for a concrete working recipe when imagery would be useful.
- Image action never invents a canonical recipe ID.

## Visual prompt principles
- believable home-cooked food photography
- accurate visible ingredients for the recipe
- appetising but not hyper-stylised
- warm natural light
- landscape composition suitable for 3:2 cropping
- no typography, logo, package mockups or hands
- no ingredients that contradict the recipe
- no impossible garnish or restaurant fantasy plating unless the recipe itself calls for it

## Acceptance
- New working recipe can generate a GPT Image 2.5 image.
- Explicit image request can invoke the generation action.
- Existing draft can generate/regenerate.
- Alternate look can be previewed without replacing the current hero.
- Candidate can be selected deliberately.
- Generated hero appears on the working-recipe page and Cook shelf.
- Image storage survives reload and another household device.
- Private image endpoint requires the household session.
- No silent Kitchen/plan/prep mutation.
- No automatic promotion into the verified recipe catalogue.
- 44px controls and no mobile overflow.
- One visible Josh.
- Existing V20 and food-truth gates remain green.
