import {openSource} from './open-source.js';

// The catalogue merges editorial copy after the open-source records, which shadows
// the fuller summary and journey written in open-source.js. Re-assert those fields
// here, where the merge lands last, so open-source.js stays the single source.
const carried=['pocket-t','whale-tracker','network-graph','launch-board','creator-storefront','tg-dex-miniapp'];
const openSourceDetail=Object.fromEntries(
 openSource.filter(p=>carried.includes(p.id))
  .map(p=>[p.id,{summary:p.summary,features:p.features,how:p.how,craft:p.craft,stack:p.stack,evidence:p.evidence}])
);

export const productDetails={
 ...openSourceDetail,
 '4sight':{
  name:'4Sight',
  kind:'Consumer finance & prediction markets',
  color:'#2464ef',
  image:'4sight-worldcup',
  logo:'4sight-logo',
  url:'https://4sight.money',
  demo:'4sight',
  state:'Production · a live transaction verified',
  summary:'A self-custodial money app for people who want prediction markets, stablecoin swaps and DeFi yield in one wallet they control, on web, a mobile shell and Telegram.',
  problem:'Onchain products usually make someone learn networks and protocols before they can do anything useful with their money. 4Sight starts with the action: take a position, swap a currency, put a balance to work, and keep custody of the funds throughout.',
  approach:'One consumer product over a set of specialist protocols. Every money operation is written as a state machine first, runs on a durable ledger, and can be stopped from either side.',
  features:[
   'Prediction markets through the Polymarket integration',
   'Stablecoin swap routing through LI.FI and Kyber',
   'DeFi yield through Aave, Morpho and Pendle',
   'GMX and Hyperliquid integrations behind the trading surfaces',
   'Funding and off-ramp routes through zkP2P, Bridge.xyz and Sera',
   'A self-custodial wallet on Privy, with viem and wagmi underneath',
   'A durable money-operation ledger behind every money operation',
   'Matched client and server kill switches on each operation',
   'One product across web, a mobile shell and Telegram'
  ],
  role:'Wrote the product scope, the state machine for every money operation and the release acceptance, then built it with an agent team on Next.js 15 and React 19 over viem, wagmi and Privy. Each money operation runs on a durable money-operation ledger with matched client and server kill switches, so an operation can be halted from either side rather than left to finish.',
  commercial:'A consumer distribution surface for prediction and FX activity, with the wallet, the markets and the yield in one place rather than three. The preview on this page demonstrates the experience; it does not place orders or connect a wallet.',
  how:[
   ['Fund a wallet you keep','Privy issues a self-custodial wallet, and zkP2P, Bridge.xyz and Sera carry money in and out of it.'],
   ['Take a position','Prediction markets run on the Polymarket integration. One question, YES or NO, with the price and the funding network shown before entry.'],
   ['Swap, earn or trade','Swaps route through LI.FI and Kyber, yield runs through Aave, Morpho and Pendle, and GMX and Hyperliquid sit behind the trading surfaces.'],
   ['Every operation is recorded','Each money operation is a state machine on a durable ledger, with matched client and server kill switches that can halt it mid-flight.'],
   ['Built on','Next.js 15 and React 19 over viem, wagmi and Privy, with a mobile shell and Telegram surfaces on the same product.'],
   ['The evidence','A live bet verified in production, 900+ tests, CI with secret scanning, a coverage gate, fork execution proof, a deliberately vulnerable canary to prove the audit gate fires, and BVI-governed legal pages. Open-source ancestor: prediction-fx-terminal.']
  ],
  craft:['Next.js 15 + React 19','viem / wagmi / Privy','Durable money-operation ledger','Client and server kill switches','900+ tests · CI secret scanning'],
  stack:['Next.js 15','React 19','viem','wagmi','Privy','Polymarket','LI.FI','Kyber','Aave','Morpho','Pendle','GMX','Hyperliquid','zkP2P','Bridge.xyz','Sera'],
  evidence:['A live bet verified in production','900+ tests','CI with secret scanning and a coverage gate','Fork execution proof','A deliberately vulnerable canary that proves the audit gate fires','BVI-governed legal pages']
 },
 'effex-product':{
  name:'NextCurrency',
  kind:'Publishing & market intelligence',
  color:'#096247',
  logo:'nextcurrency-logo',
  demo:'nextcurrency',
  url:'https://www.nextcurrency.news/',
  state:'Production · public API and MCP server',
  summary:'One graded view of 500+ stablecoins for issuers, regulators, banks and payment companies, published daily by an agent pipeline and readable as a public API or an MCP server.',
  problem:'Stablecoin information sits in scattered news, issuer disclosures, regulator notices and market datasets, and none of it grades an asset. NextCurrency reads that market, writes about it every day, publishes it, and turns the reader into a scored account.',
  approach:'A publishing system and a research database built as one product: monitoring, drafting and publishing agents on one side, safety grades, indices and corridor data on the other, with the same content available to people and to machines.',
  features:[
   'A to D safety grades across 500+ stablecoins',
   'Grades built from backing, reserve transparency, peg behaviour and maturity',
   'Four market indices',
   'A Southeast Asia Dollar Map of remittance corridors',
   'A public REST API over the same data',
   'An MCP server with five tools: list, get, safety grade, compare and market stats',
   'Monitoring agents tracking issuers, regulators, banks and payment networks',
   'Research and drafting agents writing daily coverage against a house style',
   'A multi-channel publisher pushing to the site, X and Instagram',
   'A scoring layer that lands matched readers in the CRM with first-touch attribution',
   'A 13-interval scheduler over CoinGecko, DeFiLlama, NewsAPI and Apify',
   'Unavailable data rendered as unavailable, with no invented zeroes'
  ],
  role:'Wrote the specification, data model and agent architecture. Cut release one to monitoring, drafting and publishing, shipped scoring and the CRM handoff in release two, and ran the build in two-week sprints from discovery to live in under eight weeks. Model routing runs cheap extraction and expensive drafting on different models, and a golden-set eval scores every draft for factual grounding and named-entity accuracy against a hand-verified reference set before publication, with anything below threshold going to human review.',
  commercial:'Daily coverage with no editorial headcount, at a draft rejection rate under 10%. It earns five figures of monthly recurring sponsorship revenue at software-level gross margin and is the largest single source of issuer sales-qualified leads for Sera.',
  how:[
   ['Read the market','Monitoring agents track issuers, regulators, banks and payment networks, and research and drafting agents produce the daily coverage against a house style.'],
   ['Grade the assets','A to D safety grades across 500+ stablecoins, built from backing, reserve transparency, peg behaviour and maturity, alongside four market indices.'],
   ['Follow the corridors','A Southeast Asia Dollar Map sets out the remittance corridors behind the market.'],
   ['Query it as data','A public REST API and an MCP server with five tools, list, get, safety grade, compare and market stats, give AI assistants the same view.'],
   ['Turn readers into accounts','A scoring layer matches readers and the companies covered to the issuer account map. Each match lands in the CRM as a scored account, and the article a company read first is recorded as the source of the lead.'],
   ['Built on','React 19, Vite 7, tRPC 11 and Drizzle on Postgres, with Privy auth, Cloudflare R2 and Containers, and a 13-interval scheduler over CoinGecko, DeFiLlama, NewsAPI and Apify.'],
   ['The evidence','52 test files, Docker and Cloudflare Worker deploys, 20+ audit and root-cause documents, 343 content files, and a hardened private rebuild after a compromise. Open-source ancestor: stablecoin-intelligence.']
  ],
  craft:['React 19 + Vite 7','tRPC 11 + Drizzle on Postgres','Privy auth · Cloudflare R2 / Containers','13-interval data scheduler','Public REST API + MCP server'],
  stack:['React 19','Vite 7','tRPC 11','Drizzle','Postgres','Privy','Cloudflare R2','Cloudflare Containers','CoinGecko','DeFiLlama','NewsAPI','Apify'],
  evidence:['52 test files','Docker and Cloudflare Worker deploys','20+ audit and root-cause documents','343 content files','A hardened private rebuild after a compromise','Draft rejection rate under 10%']
 },
 'esportz':{
  name:'Esportz.fun',
  kind:'Gaming discovery & participation',
  color:'#32c595',
  url:'https://esportz.fun/',
  state:'Deployed MVP',
  summary:'A gaming destination where traditional and Web3 players find games, understand what those games need to run, and come back for predictions, quests, XP, news and tournaments across a catalogue of 149+ titles.',
  problem:'Discovery is the easy half. A player who finds a game still needs to know whether it will run, what it costs to start and why to return next week. Esportz puts the requirements next to the game and the reasons to return next to both.',
  approach:'Use game discovery as the front door, then attach the repeat mechanics, predictions, quests, XP and tournaments, to the same catalogue rather than to a separate product.',
  features:[
   'A catalogue of 149+ games',
   'Game profiles with trailers, screenshots and hardware requirements',
   'Filters by genre, platform and chain',
   'Prediction surfaces on match and tournament outcomes',
   'Quests, XP and rewards',
   'Tournament listings and brackets',
   'News and guides for returning players',
   'A Razer partnership demonstration built on the live codebase, with Razer Gold and Silver wallet, a hardware shop and Silver quests'
  ],
  role:'Product strategy, the discovery-to-participation model and the build on Astro 5 SSR with React 19. Also built the Razer partnership demonstration on the live codebase, with Razer Gold and Silver wallet, a hardware shop and Silver quests. That demonstration is a partnership presentation and is not a won account.',
  commercial:'The catalogue earns the first visit and the participation mechanics earn the next one. The Razer build shows how a hardware and currency partner plugs into the same codebase without a separate product.',
  how:[
   ['Find the game','Browse 149+ titles by genre, platform or chain, and read the trailer, screenshots and hardware requirements before installing.'],
   ['Pick a reason to return','Follow a tournament, take a prediction, or start a quest that pays XP.'],
   ['Keep the progress','News, guides, community activity and an XP record hold the player across weeks rather than one session.'],
   ['Plug a partner in','The Razer demonstration adds Razer Gold and Silver wallet, a hardware shop and Silver quests to the same live codebase.'],
   ['Built on','Astro 5 SSR with React 19, Tailwind 4 and Radix, Drizzle on Postgres and Cloudflare R2, deployed on Vercel.']
  ],
  craft:['Astro 5 SSR + React 19','Tailwind 4 + Radix','Drizzle on Postgres','Cloudflare R2','Deployed on Vercel'],
  stack:['Astro 5','React 19','Tailwind 4','Radix','Drizzle','Postgres','Cloudflare R2','Vercel'],
  evidence:['Deployed on Vercel','149+ game catalogue','Razer partnership demonstration built on the live codebase']
 },
 'lamuse':{
  name:'LaMuse',
  kind:'Jewellery discovery & merchant tools',
  color:'#b09167',
  image:'lamuse-discover',
  demo:'lamuse',
  state:'Prototype in private testing',
  summary:'A jewellery platform with two sides: shoppers who discover, virtually try on and enquire about real pieces, and merchants who turn product photos into storefronts, content and customer conversations.',
  problem:'A shopper will not enquire about a piece they cannot picture on themselves, and a merchant with beautiful product photography still has no way to turn it into a conversation. Both sides of that gap are the product.',
  approach:'Design the consumer and merchant journeys as one loop. Discovery and try-on create a qualified enquiry; the merchant studio receives it with the product context already attached.',
  features:[
   'Visual discovery across type, material and style',
   'Virtual try-on against a shopper photo',
   'Saved inspiration collections',
   'Product-specific enquiries that carry their context to the merchant',
   'Merchant storefronts built from product photographs',
   'Creative and content tools for the merchant catalogue',
   'A merchant inbox for customer conversations',
   'An Expo shell for the app stores'
  ],
  role:'Product direction and the build on Next.js 16, React 19 and Prisma 7 on Postgres, with Auth.js, the OpenAI SDK and Playwright, and an Expo shell for the app stores. The repository carries a written control plane for Codex, Claude Code, Grok and a Buzz agent squad: named roles, per-agent inboxes, file ownership, handoff and review packets, and a rule that only the active driver may edit application code.',
  commercial:'Merchant subscriptions are the intended business model. Consumer discovery and the try-on journey exist to generate attributable enquiries for the businesses on the platform.',
  how:[
   ['Discover and save','Browse jewellery by type, material and style and collect pieces into personal inspiration.'],
   ['Try before enquiring','Virtual try-on puts a real piece on the shopper photo, so the enquiry starts from a decision rather than a question.'],
   ['Send a real enquiry','The conversation opens with the product already attached, and lands in the merchant inbox.'],
   ['Run the merchant studio','Turn product photographs into a storefront, generate the content around it and answer the inbound enquiry in one workspace.'],
   ['Built on','Next.js 16, React 19, Prisma 7 on Postgres, Auth.js, the OpenAI SDK and Playwright, with an Expo shell for the app stores.'],
   ['The evidence','CI, Playwright smoke and stateful suites, 29 product and execution documents, and wave-based delivery with a Definition of Done. A written agent control plane governs who may edit application code.']
  ],
  craft:['Next.js 16 + React 19','Prisma 7 on Postgres','Auth.js','OpenAI SDK','Expo app shell','Playwright'],
  stack:['Next.js 16','React 19','Prisma 7','Postgres','Auth.js','OpenAI SDK','Playwright','Expo'],
  evidence:['CI with Playwright smoke and stateful suites','29 product and execution documents','Wave-based delivery with a Definition of Done','A written control plane for Codex, Claude Code, Grok and a Buzz agent squad']
 },
 'blueballs':{
  image:'blueballs-home',
  gallery:['blueballs-fx','blueballs-developers'],
  source:'https://github.com/Josh-Gi3r/blueballs',
  url:'https://blueballs.tech',
  state:'Release v0.1.0 · open source, MIT',
  collection:'Open source',
  summary:'A self-hostable neobank stack for teams building banking or embedded-finance products: a tenant-isolated API with 181 documented operations on a double-entry ledger, a provider-neutral FX runtime and Solidity atomic-settlement contracts.',
  problem:'Anyone starting a neobank or an embedded-finance product rebuilds the same ledger, the same tenant boundaries and the same FX plumbing before shipping a single feature, and usually gets the accounting wrong on the way. Blueballs is that layer, written once, documented and open.',
  approach:'Put the accounting invariants in the engine rather than in a code review. Balances are derived from postings and never stored, and the two rules that keep a ledger honest are enforced by the system itself.',
  features:[
   'A tenant-isolated banking API with 181 documented operations',
   'A double-entry ledger that derives balances from postings and never stores them',
   'Two enforced invariants: every transaction’s legs sum to zero, and no customer account goes below zero',
   'A provider-neutral FX runtime',
   'Solidity atomic-settlement contracts, tested with Foundry',
   'A Sandbox Builder that turns a product brief into a test environment',
   'A Builder Agent behind a daily quota, a rate limit and an operator kill switch',
   'Partner descriptors for Bridge and Dakota',
   'OpenAPI documentation through Redocly',
   'Adapter and API standards for anyone extending it'
  ],
  role:'Wrote the platform scope and the ledger invariants, and built it as a pnpm monorepo of twelve packages that runs on Node with SQLite or on Cloudflare Workers with Durable Objects. The Builder Agent runs on Cloudflare’s agents SDK with Kimi K2.6 on Workers AI, behind a daily quota, a rate limit and an operator kill switch. The Solidity atomic-settlement contracts are tested with Foundry and the API is documented through Redocly.',
  commercial:'Released under MIT so a team can self-host the whole stack, read every operation and replace any provider. The governance files and adapter standards exist so that other people can build on it without asking.',
  how:[
   ['Open the reference product','Accounts, cards and FX run in a working reference experience rather than a specification document.'],
   ['Read the ledger','Balances are derived from postings and never stored. Every transaction’s legs sum to zero and no customer account can go below zero, enforced by the engine.'],
   ['Call the API','181 documented operations sit behind tenant isolation, with OpenAPI through Redocly and partner descriptors for Bridge and Dakota.'],
   ['Build a sandbox','The Sandbox Builder turns a written product brief into a test environment, with the Builder Agent held behind a daily quota, a rate limit and an operator kill switch.'],
   ['Built on','A pnpm monorepo of twelve packages, running on Node with SQLite or Cloudflare Workers with Durable Objects, with Foundry tests on the Solidity settlement contracts and Kimi K2.6 on Workers AI behind the agent.'],
   ['The evidence','43 test files and a verify gate; VISION, ROADMAP, GOVERNANCE, SECURITY, an RFC template and CODEOWNERS from day one; adapter and API standards.']
  ],
  craft:['pnpm monorepo · twelve packages','Node + SQLite or Cloudflare Workers','Durable Objects','Cloudflare agents SDK + Kimi K2.6','Foundry + OpenAPI / Redocly','MIT'],
  stack:['pnpm monorepo','Node','SQLite','Cloudflare Workers','Durable Objects','Cloudflare agents SDK','Kimi K2.6 on Workers AI','Solidity','Foundry','OpenAPI','Redocly'],
  evidence:['43 test files and a verify gate','VISION, ROADMAP, GOVERNANCE, SECURITY, an RFC template and CODEOWNERS from day one','Adapter and API standards','Partner descriptors for Bridge and Dakota']
 },
 'savills-os':{
  state:'High-fidelity prototype for a named enterprise prospect',
  summary:'A brokerage operating system: 38 surfaces linking market intelligence, CRM, property work, content production, campaigns, deals, recruitment and staff development, with six scripted persona journeys from broker to leadership.',
  problem:'A brokerage runs on separate tools for research, content, CRM and deals, so the enquiry a piece of market content generated never reaches the person who could close it. This puts the whole chain in one system.',
  approach:'Treat content as business development. Research informs market content, campaigns generate enquiries, and the enquiry context follows the account into sales rather than stopping at the marketing team.',
  features:[
   '38 surfaces in one operating system',
   'Market intelligence and research',
   'CRM and account management',
   'Property work and listings',
   'Content production tied to research',
   'Campaigns that generate tracked enquiries',
   'Deal pipeline and approvals',
   'Recruitment and staff development',
   'Six scripted persona journeys, from broker to leadership'
  ],
  role:'Specified the operating model and built the prototype on vanilla JS custom elements over a document-component runtime, with Vite 8, the Node test runner, Playwright evidence and Cloudflare R2 media. Content is treated as business development throughout: research informs the market content, campaigns generate enquiries, and the enquiry context follows the account into sales. The AI features are built as deterministic simulations and labelled as such.',
  commercial:'Built for a named enterprise prospect as a working argument rather than a deck. Better property content attracts demand, helps agents win instructions, and gives the agency a stronger recruiting and operating proposition.',
  how:[
   ['Start with the working day','A focused home surface brings priorities, content activity and approvals into one place for whichever persona is signed in.'],
   ['Turn research into content','Market intelligence feeds the content production surfaces, so what gets published is grounded in what the research found.'],
   ['Turn content into demand','Campaigns generate enquiries, and the enquiry context follows the account into CRM and the deal pipeline.'],
   ['Run the agency','Deals, approvals, recruitment and staff development sit on the same system as the front-of-house work, across six scripted persona journeys from broker to leadership.'],
   ['Built on','Vanilla JS custom elements on a document-component runtime, Vite 8, the Node test runner, Playwright evidence and Cloudflare R2 media, with the AI features written as deterministic simulations and labelled as such.'],
   ['The evidence','416 tests and a full handover pack: acceptance criteria, a maturity matrix, a keep, improve, merge or remove disposition for every one of the 38 surfaces, known issues, roles and permissions, and a copy audit.']
  ],
  craft:['Vanilla JS custom elements','Document-component runtime','Vite 8 + Node test runner','Playwright evidence','Cloudflare R2 media','416 tests'],
  stack:['Vanilla JS custom elements','Document-component runtime','Vite 8','Node test runner','Playwright','Cloudflare R2'],
  evidence:['416 tests','Acceptance criteria and a maturity matrix','A keep, improve, merge or remove disposition for every surface','Known issues, roles and permissions, and a copy audit']
 },
 'yours':{
  state:'Production · live publishing and billing acceptance outstanding',
  summary:'An autonomous marketing officer for a single small business: nineteen workspaces and twelve named AI staff roles that turn approved brand truth into campaigns, editable content, exact-version approvals, verified publishing, measured outcomes and governed learning, under human supervision.',
  problem:'A small business cannot hire a marketing department and cannot supervise one it does not understand. Yours gives it the department and keeps the human in the approval seat, with brand truth approved once and every output traced back to it.',
  approach:'Named roles with bounded responsibilities, one gateway that decides which model serves which task, and approval on an exact version rather than on a description of it. Mock activity and invented metrics are forbidden by the product’s own non-negotiables.',
  features:[
   'Nineteen workspaces covering the marketing department',
   'Twelve named AI staff roles under human supervision',
   'Approved brand truth as the single source for every output',
   'Editable content with exact-version approvals',
   'Verified publishing and measured outcomes',
   'Governed learning that feeds the next campaign',
   'One model gateway that decides which provider serves which task, reserves budget, records provider receipts and settles cost per task',
   'A documented bakeoff protocol with a ten-point activation checklist before any new model is admitted',
   'An Ask Yours tool-calling assistant on a strict JSON action protocol',
   'A brand-guideline generator that turns a logo into a 17-section guideline',
   'A three-archetype YouTube thumbnail generator on Gemini image models',
   'A nightly editorial pipeline that scrapes, clusters and ranks sources on a tiered credibility system'
  ],
  role:'Wrote the 143 KB definitive product scope with its evidence hierarchy, tool-by-tool acceptance scenarios, object model, vertical packs and founder decisions, along with pricing, entitlements and vendor contracts. Built on Next.js 15, React 19 and Postgres 16 with pgvector under forced row-level security and three database roles, with a background worker, the Anthropic, OpenAI and Gemini SDKs, AWS KMS, S3 and Secrets Manager, and satori and ffmpeg rendering. Three satellite tools run live at runyours.ai subdomains: a brand-guideline generator, a YouTube thumbnail generator and a nightly editorial pipeline.',
  commercial:'One small business gets the output of a marketing department and keeps the approval. Three satellite tools are live at runyours.ai subdomains, and live publishing and billing acceptance are still outstanding.',
  how:[
   ['Approve the brand truth','Everything downstream is generated from an approved brand record, so no output invents its own version of the business.'],
   ['Let the staff work','Twelve named AI staff roles across nineteen workspaces plan campaigns and produce the content, each with a bounded remit.'],
   ['Approve the exact version','Content is editable and approval attaches to the exact version, not to a summary of it.'],
   ['Publish and measure','Publishing is verified rather than assumed, outcomes are measured, and the learning is governed back into the next campaign. Mock activity and invented metrics are forbidden by the product’s non-negotiables.'],
   ['Control the model spend','One gateway is the only place that decides which provider serves which task. It reserves budget, records provider receipts and settles cost per task, and a documented bakeoff protocol with a ten-point activation checklist governs which models get admitted.'],
   ['Built on','Next.js 15, React 19 and Postgres 16 with pgvector under forced row-level security and three database roles, plus a background worker, the Anthropic, OpenAI and Gemini SDKs, AWS KMS, S3 and Secrets Manager, satori and ffmpeg rendering, and an Ask Yours assistant on a strict JSON action protocol.'],
   ['The evidence','A 143 KB definitive product scope with an evidence hierarchy, tool-by-tool acceptance scenarios, object model, vertical packs and founder decisions; pricing, entitlements and vendor contracts; a security audit; six dated acceptance packets; CI with secret scanning; and a release gate with migration idempotence, RLS isolation and publish-chaos tests.']
  ],
  craft:['Next.js 15 + React 19','Postgres 16 + pgvector','Forced row-level security · three DB roles','Anthropic / OpenAI / Gemini gateway','AWS KMS, S3, Secrets Manager','satori + ffmpeg rendering'],
  stack:['Next.js 15','React 19','Postgres 16','pgvector','Background worker','Anthropic SDK','OpenAI SDK','Gemini SDK','AWS KMS','AWS S3','AWS Secrets Manager','satori','ffmpeg'],
  evidence:['A 143 KB definitive product scope with an evidence hierarchy','Tool-by-tool acceptance scenarios, object model and vertical packs','Pricing, entitlements and vendor contracts','A security audit','Six dated acceptance packets','CI with secret scanning','A release gate with migration idempotence, RLS isolation and publish-chaos tests']
 },
 'atlas':{
  collection:'Experiments',
  state:'Prototype · deterministic space-programming engine',
  summary:'A workplace brain for corporate real estate consultants: a written brief goes in and a typed, reproducible space programme comes out, with a 40-screen consultant cockpit around it.',
  problem:'Space programming is done in spreadsheets that nobody can reproduce, so two consultants with the same brief reach different answers and neither can show why. ATLAS keeps the mathematics deterministic and stores the inputs and the policy version behind every result.',
  approach:'Separate the planning mathematics from the AI adviser completely. The engine is deterministic and typed; the adviser is grounded and sits alongside it, never inside the calculation.',
  features:[
   'A deterministic space-programming engine',
   'Typed, reproducible programmes generated from a written brief',
   'A 40-screen consultant cockpit',
   'Every result stores the inputs and the policy version behind it',
   'Scenario comparison and explanation',
   'A grounded in-product advisor kept out of the calculation path',
   'A Protomaps basemap for location context',
   'Positioned as the seed of a Workplace Transformation OS'
  ],
  role:'Specified the engine and the cockpit and built them with six multi-agent workflow scripts with named roles. The engine runs on Python, FastAPI, Pydantic 2, SQLite and pytest; the cockpit on Vite, React and TypeScript with Playwright over a Protomaps basemap. Backed by 1,000+ backend and 200+ frontend tests, 12 ADRs including one for an MCP command contract, 27 audit documents and a CI continuation gate. A written retrospective records that breadth-first agent swarms produced a large, shallow application, and proposes a quality-first mode instead.',
  commercial:'Built for corporate real estate consultants in Singapore, and positioned as the seed of a Workplace Transformation OS. It is a prototype: the engine is deterministic and reproducible, and the results it produces are scenarios rather than measured operating outcomes.',
  how:[
   ['Set the brief','Describe the people, the work patterns and the assumptions behind a workplace decision.'],
   ['Generate the programme','A deterministic engine returns a typed, reproducible space programme, with the inputs and the policy version stored alongside the result.'],
   ['Compare scenarios','Adjust the programme, compare options and get each difference explained rather than asserted.'],
   ['Ask the adviser','A grounded in-product advisor sits next to the engine and never inside the calculation, so the mathematics stays deterministic.'],
   ['Built on','Python, FastAPI, Pydantic 2, SQLite and pytest for the engine; Vite, React and TypeScript with Playwright for the 40-screen cockpit, over a Protomaps basemap.'],
   ['The evidence','1,000+ backend and 200+ frontend tests, 12 ADRs, 27 audit documents, a CI continuation gate, and a written retrospective recording that breadth-first agent swarms produced a large, shallow application and proposing a quality-first mode.']
  ],
  craft:['Python + FastAPI + Pydantic 2','SQLite + pytest','Vite + React + TypeScript','Playwright','Protomaps basemap','1,000+ backend tests'],
  stack:['Python','FastAPI','Pydantic 2','SQLite','pytest','Vite','React','TypeScript','Playwright','Protomaps'],
  evidence:['1,000+ backend tests and 200+ frontend tests','12 ADRs, including an MCP command contract','27 audit documents','A CI continuation gate','A written retrospective on breadth-first agent swarms']
 },
 'sera-payroll':{
  demo:'payroll',
  state:'Product portfolio · open-sourced as stablecoin-payroll',
  summary:'An APAC payroll and employer-of-record product for Malaysia and Singapore, with statutory calculation engines, filing exports and separate operator, client and employee workspaces.',
  problem:'A company paying staff across Malaysia and Singapore runs two sets of statutory rules, two filing formats and three different audiences for the same payroll run. The product separates those audiences and keeps the country rules in the engine.',
  approach:'Keep preparation, review and payment as distinct states so an operator can find and fix a problem before money moves, and keep the statutory logic in a country engine rather than in the interface.',
  features:[
   'Operator, client and employee workspaces',
   'An employer workspace covering overview, payroll, people and reports',
   'Malaysia and Singapore statutory calculation engines',
   'Statutory filing exports for each country',
   'Separate preparation, review and payment stages',
   'A run that stays editable until the review stage passes',
   'Employer-of-record workflows alongside payroll',
   'A configurable settlement integration boundary'
  ],
  role:'Product scope and build within the Sera stablecoin family, alongside the Telegram money-changer. Built under the house method: a written scope with its invariants and a state document, an agent team on named, bounded roles, and an adversarial verification pass before merge, with Claude Code carrying the co-authored commits, session branches and hand-off logs. The generalised version is open-sourced as stablecoin-payroll, with the statutory engines and filing exports intact.',
  commercial:'Payroll and employer-of-record work for companies operating across Malaysia and Singapore, with the settlement layer left configurable so it can sit on a bank rail or a stablecoin rail.',
  how:[
   ['Prepare the run','Organise employees, pay inputs and the country-specific calculations before anything is submitted.'],
   ['Review before money moves','Preparation, review and payment are separate states, so an operator resolves the exceptions while the run is still editable.'],
   ['File and export','The Malaysia and Singapore statutory engines produce the filing exports each country needs.'],
   ['Give each audience its own view','Operator, client and employee workspaces show the same run at the right level of detail, with overview, payroll, people and reports in the employer workspace.'],
   ['Settle on whichever rail','The settlement integration is a boundary rather than a hard dependency, so the run can pay out on a bank rail or a stablecoin rail.'],
   ['How it was built','A written scope with its invariants and a state document, an agent team on named, bounded roles, and an adversarial verification pass before merge. Money and mainnet decisions stayed with the founder.']
  ],
  craft:['Payroll / HR / EOR workflows','Malaysia and Singapore statutory engines','Filing exports','Role-based workspaces','Configurable settlement boundary'],
  stack:['Malaysia and Singapore statutory calculation engines','Country filing exports','Role-based operator, client and employee workspaces','Staged preparation, review and payment model','Configurable settlement integration'],
  evidence:[
   'Open-sourced as stablecoin-payroll, with the statutory engines and filing exports intact',
   'Claude Code co-authored commits, session branches and hand-off logs on the repository',
   'Handoff documents and acceptance packets recording what is proven and what is simulated'
  ]
 },
 'serafx':{
  demo:'telegram',
  state:'Live on testnet',
  summary:'A Telegram mini-app that lets stablecoin holders in Southeast Asia swap and trade peer to peer on Sera Protocol’s onchain order book, and act as their own money changer.',
  problem:'Someone holding stablecoins in Southeast Asia still goes to a money changer or an exchange to move between currencies. This puts the order book in the chat app they already use, and lets them take the money changer’s side of the trade.',
  approach:'Design the escrow around the protocol limitation rather than around the happy path: a three-leg burst in which an offline maker’s vault releases funds only after the taker’s payment is verified onchain.',
  features:[
   'Swap and peer-to-peer trading inside Telegram',
   'Orders placed on Sera Protocol’s onchain order book',
   'A three-leg escrow burst designed around a protocol limitation',
   'An offline maker’s vault that releases only after the taker’s payment is verified onchain',
   'EIP-712 signing on ethers 6',
   'A grounded FX assistant relayed to Anthropic, OpenAI or Gemini',
   'A bounded trade-on-behalf agent',
   'Seven numbered invariants recorded for the agents that come next',
   'A readiness checklist gating the mainnet flip'
  ],
  role:'Wrote the escrow design, the seven numbered invariants and the working rules recorded for future agents, and built the app on React 19, the Telegram SDK, tRPC 11, Drizzle on MySQL and ethers 6 with EIP-712 signing, alongside a grounded FX assistant relayed to Anthropic, OpenAI or Gemini and a bounded trade-on-behalf agent.',
  commercial:'Distribution through Telegram rather than a wallet install, on Sera Protocol’s own order book. The generalised version is open-sourced as tg-dex-miniapp.',
  how:[
   ['Open it inside Telegram','A compact mini-app makes currencies, wallet actions and peer-to-peer offers reachable without leaving the chat.'],
   ['Take or make an offer','Orders sit on Sera Protocol’s onchain order book, so a holder can act as the money changer rather than pay one.'],
   ['Settle safely','A three-leg escrow burst works around a protocol limitation: an offline maker’s vault releases funds only once the taker’s payment is verified onchain.'],
   ['Ask before signing','A grounded FX assistant, relayed to Anthropic, OpenAI or Gemini, and a bounded trade-on-behalf agent sit inside the same app.'],
   ['Built on','React 19, the Telegram SDK, tRPC 11, Drizzle on MySQL and ethers 6 with EIP-712 signing.'],
   ['The evidence','A live bot on Sepolia with Vitest suites, seven numbered invariants recorded for future agents, and a readiness checklist gating the mainnet flip. Open-sourced as tg-dex-miniapp.']
  ],
  craft:['React 19 + Telegram SDK','tRPC 11 + Drizzle on MySQL','ethers 6 with EIP-712 signing','Anthropic / OpenAI / Gemini relay','Vitest on Sepolia'],
  stack:['React 19','Telegram SDK','tRPC 11','Drizzle','MySQL','ethers 6','EIP-712','Vitest'],
  evidence:['Live bot on Sepolia with Vitest suites','Seven numbered invariants recorded for future agents','A readiness checklist gating the mainnet flip']
 },
 'sera-agents':{
  demo:'agents',
  state:'Launch portfolio',
  summary:'Sera’s stablecoin FX exposed to AI agents as defined tools, so an agent can request a quote, inspect the assets and the route it is being offered, and convert currency inside a workflow it is already running.',
  problem:'An agent that needs to move value between currencies has no defined tool to do it, so the step falls back to a human. This makes stablecoin FX a callable capability with a clear contract.',
  approach:'Publish the FX capability as tools with defined inputs and outputs rather than as an API to be discovered, and position it to developers rather than to traders.',
  features:[
   'Stablecoin FX exposed as defined agent tools',
   'A quote request that returns the assets and the route',
   'The assets and the quote inspectable before the agent commits',
   'A defined result the agent can act on without a human step',
   'MCP workflows for agent clients',
   'Currency conversion inside a workflow the agent is already running',
   'Sera Protocol’s onchain order book behind the tool contract',
   'A developer-facing integration path rather than a trading interface'
  ],
  role:'Positioning, the developer proposition and the integration-led go-to-market for stablecoin FX as an agent capability. Wrote the case for exposing settlement as a defined tool contract rather than as another API for a developer to discover, and specified the request, inspect and return steps an agent runs through. Built under the house method: a written scope with its invariants and a state document, an agent team on named, bounded roles, and an adversarial verification pass before merge, with money and mainnet decisions kept with the founder.',
  commercial:'Integration-led distribution: the capability reaches the end user through the agent products that adopt it, rather than through a consumer interface.',
  how:[
   ['Connect a client','Stablecoin FX arrives through an agent-oriented integration rather than a trading interface, so a developer wires a tool rather than a screen.'],
   ['Request a quote','Currency conversion is a defined tool call. The agent asks for the conversion and gets the assets and the route back.'],
   ['Inspect the assets and the quote','The agent reads what it is being offered before it commits, rather than acting on a price it cannot see behind.'],
   ['Act on the result','The agent receives a defined result it can use in the workflow it was already running, with no human step in the middle.'],
   ['Built on','Sera Protocol’s onchain order book underneath, published as tool calls with defined inputs and outputs, with MCP workflows for agent clients.'],
   ['How it was built','A written scope with its invariants and a state document, an agent team on named, bounded roles, and an adversarial verification pass before merge. Money and mainnet decisions stayed with the founder.']
  ],
  craft:['Developer positioning','Agent tool workflows','MCP workflows','Stablecoin FX proposition','Integration-led GTM'],
  stack:['Agent tool interface','Defined tool inputs and outputs','MCP workflows','Stablecoin FX quoting','Sera Protocol onchain order book'],
  evidence:[
   'A written scope with its invariants and a state document, with money and mainnet decisions kept with the founder',
   'An agent team on named, bounded roles with an adversarial verification pass before merge',
   'The same Sera Protocol order book carries the Telegram money-changer, live on testnet'
  ]
 },
 'creator-platform':{
  image:'creator-storefront',
  state:'Product portfolio',
  summary:'A creator marketplace where a buyer finds the person, sees exactly what is being sold at what price, commissions it against a defined service, and follows the work through to delivery with both sides reading the same outstanding list.',
  problem:'Commissioning a creator usually means a direct message and a guess at scope. Putting the storefront, the offer and the delivery workflow in one place makes the transaction legible to both sides.',
  approach:'Make the offer the product. The storefront states the service, the price and the delivery expectation before anyone commits.',
  features:[
   'Creator profiles and storefronts',
   'Service discovery across creators',
   'Defined, bookable services with a stated scope and price',
   'A buyer journey from discovery through to commission',
   'A commission attached to a defined service rather than to a direct message',
   'A delivery and fulfilment workflow',
   'A shared view of what is still outstanding on a commission',
   'A generalised, brand-stripped copy released under MIT as creator-storefront'
  ],
  role:'Product experience, the marketplace model and full-stack development, from the creator storefront through to the delivery workflow. Built under the house method: a written scope with its invariants and a state document, an agent team on named, bounded roles, and an adversarial verification pass before merge. The generalised, brand-stripped version is released under MIT as creator-storefront.',
  commercial:'The marketplace takes its position between the creator’s audience and the buyer’s brief, with the service definition as the thing being sold.',
  how:[
   ['Discover a creator','Browse the person, their work and their storefront, and find the service rather than opening a conversation about it.'],
   ['Scope the work','The offer states the service, the price and what is delivered before anyone commissions it.'],
   ['Commission it','The purchase attaches to a defined service, so what was bought is on the record rather than in a thread.'],
   ['Follow delivery','A fulfilment workflow keeps the outstanding work visible to the buyer and the creator at the same time.'],
   ['How it was built','A written scope with its invariants and a state document, an agent team on named, bounded roles, and an adversarial verification pass before merge.'],
   ['The open-source sibling','The generalised, brand-stripped copy is released under MIT as creator-storefront, where the fan-token ledger is simulated and labelled.']
  ],
  craft:['Marketplace UX','Creator storefronts','Service definitions','Buyer and delivery journeys','Full-stack development'],
  stack:['Full-stack web application','Database-backed marketplace','Creator storefront model','Bookable service definitions','Delivery and fulfilment workflow'],
  evidence:[
   'Generalised as the MIT creator-storefront reference application',
   'An agent team on named, bounded roles with an adversarial verification pass before merge',
   'Handoff documents and acceptance packets recording what is proven and what is simulated'
  ]
 }
};
