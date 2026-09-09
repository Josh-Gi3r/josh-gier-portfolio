/* Portfolio-wide editorial cleanup.
   Keep the voice direct, specific and human. State what happened; do not sound
   defensive, over-explain the build process or narrate agent orchestration. */

const exact = new Map([
  // Site chrome and section labels
  ['THE COMPLETE INDEX','WORK INDEX'],
  ['THE PROJECT DIRECTORY','PROJECTS'],
  ['TAKE THE DOCUMENTS','CV & PORTFOLIO'],
  ['WHY IT EXISTS','THE PROBLEM'],
  ['The user need.','The problem.'],
  ['Every capability.','Key features.'],
  ['BUILT WITH','TECH'],
  ['WHAT PROVES IT','BUILT & SHIPPED'],
  ['PROOF','BUILT & SHIPPED'],
  ['Proof','Built & shipped'],
  ['WHY OPEN SOURCE','OPEN SOURCE'],
  ['THE COMMERCIAL LOGIC','BUSINESS MODEL'],
  ['The evidence','Built & shipped'],
  ['How it was built','Build'],
  ['Built on','Tech'],
  ['Campaign formats.','Selected formats.'],
  ['Brand and social executions adapted for different placements.','How the campaign adapted across placements.'],
  ['Product interface supplied by Josh. Screenshots show the product at the time of capture.','Original product screenshots.'],
  ['Interactive product walkthrough.','Interactive demo.'],
  ['Interactive rebuild of the live product interface, running on sample market data.','Interactive 4Sight demo using sample market data.'],
  ['Rebuilt from the publication’s layout and brand assets. Editorial copy is representative; live reporting and prices are in the product.','Interactive NextCurrency demo. Open the live product for current reporting and market data.'],
  ['Product journey preview using LaMuse’s original brand assets. Try-on generation is available in the prototype.','Interactive LaMuse demo using the original brand assets. Virtual try-on is available in the prototype.'],
  ['Representative directory layout. Open the product for current market data.','Demo directory. Open NextCurrency for live market data.'],
  ['Explore the tournament, then inspect the decision.','Choose a market and see how it works.'],
  ['Choose a market to inspect.','Choose a market.'],
  ['The product places the question, outcomes and funding context together. This portfolio demo contains no live odds.','Each market shows the question, the YES/NO outcome and funding details together. This demo does not use live odds.'],
  ['Read the market question, compare YES and NO, then review funding and the settlement network. The full product retrieves the current market price.','Compare YES and NO, then review funding and settlement. Open 4Sight for the live market price.'],
  ['Product workflow illustration','Demo flow'],
  ['Inspect the assets and quote','Review the quote'],
  ['Return a defined result','Return the result'],
  ['Country calculation engines and distinct operator, client and employee workspaces.','Malaysia and Singapore payroll calculations, with separate views for operators, employers and employees.'],
  ['Products, open-source releases and experiments.','Products, open-source software and experiments.'],
  ['See what each does, how it works and my contribution.','Work I built, led or released, with the details behind each project.'],
  ['Every campaign, the revenue record and the product work in detail.','Campaigns, products and commercial results in one file.'],
  ['Campaign / company source','Source'],

  // Phrases that sounded defensive or machine-written
  ['The engineering is open to inspect.','Selected products are open source on GitHub.'],
  ['Open-source work, with the code on GitHub.','Selected products are open source on GitHub.'],
  ['Ninety repositories. The engineering is open to inspect.','Open-source products, prototypes and source code on GitHub.'],
  ['Open-source products, prototypes and the code behind the work.','Open-source products, prototypes and source code on GitHub.'],
  ['I build and share developer tools, document software, banking references and community systems. Each project explains its purpose, my contribution and where to inspect the source.','I open-source selected products and tools so you can run them, read the code and see exactly what I built.'],
  ['I open-source selected products and tools so you can see what I built, run them yourself and read the code.','I open-source selected products and tools so you can run them, read the code and see exactly what I built.'],

  // Product pages: say what the product is and what Josh did, not the internal agent process
  ['One graded view of 500+ stablecoins for issuers, regulators, banks and payment companies, published daily by an agent pipeline and readable as a public API or an MCP server.','Stablecoin news, research and safety grades for 500+ assets, with a public API and MCP server.'],
  ['Stablecoin information sits in scattered news, issuer disclosures, regulator notices and market datasets, and none of it grades an asset. NextCurrency reads that market, writes about it every day, publishes it, and turns the reader into a scored account.','Stablecoin information is scattered across issuers, regulators, market data and news. NextCurrency brings it together, grades 500+ assets and publishes daily reporting for people working in payments.'],
  ['A publishing system and a research database built as one product: monitoring, drafting and publishing agents on one side, safety grades, indices and corridor data on the other, with the same content available to people and to machines.','NextCurrency combines a daily publication with a stablecoin research database. The same underlying data powers the site, safety grades, indices, API and MCP server.'],
  ['Wrote the specification, data model and agent architecture. Cut release one to monitoring, drafting and publishing, shipped scoring and the CRM handoff in release two, and ran the build in two-week sprints from discovery to live in under eight weeks. Model routing runs cheap extraction and expensive drafting on different models, and a golden-set eval scores every draft for factual grounding and named-entity accuracy against a hand-verified reference set before publication, with anything below threshold going to human review.','I defined the product, data model, editorial workflow and commercial attribution, launched it in under eight weeks and continue to run the publishing and growth system. Automated drafts are checked against a verified reference set before publication, with low-confidence work sent to human review.'],
  ['Daily coverage with no editorial headcount, at a draft rejection rate under 10%. It earns five figures of monthly recurring sponsorship revenue at software-level gross margin and is the largest single source of issuer sales-qualified leads for Sera.','NextCurrency earns five figures in monthly sponsorship revenue and is Sera’s largest source of issuer-qualified leads. Automated drafts have a rejection rate below 10%.'],

  ['A consumer distribution surface for prediction and FX activity, with the wallet, the markets and the yield in one place rather than three. The preview on this page demonstrates the experience; it does not place orders or connect a wallet.','4Sight brings prediction markets, stablecoin swaps and yield into one consumer app. The preview is a demo and does not place orders or connect a wallet.'],

  ['A shopper will not enquire about a piece they cannot picture on themselves, and a merchant with beautiful product photography still has no way to turn it into a conversation. Both sides of that gap are the product.','Shoppers want to see how a piece looks before they enquire. Merchants need those browsing and try-on moments to turn into real sales conversations.'],
  ['Design the consumer and merchant journeys as one loop. Discovery and try-on create a qualified enquiry; the merchant studio receives it with the product context already attached.','LaMuse connects discovery, virtual try-on and the merchant inbox. An enquiry reaches the merchant with the product already attached.'],
  ['Product direction and the build on Next.js 16, React 19 and Prisma 7 on Postgres, with Auth.js, the OpenAI SDK and Playwright, and an Expo shell for the app stores. The repository carries a written control plane for Codex, Claude Code, Grok and a Buzz agent squad: named roles, per-agent inboxes, file ownership, handoff and review packets, and a rule that only the active driver may edit application code.','I led the product direction and build across the shopper experience, virtual try-on and merchant tools. The product runs on Next.js, React and Postgres, with an Expo shell for mobile and Playwright coverage for the core flows.'],

  ['A self-hostable neobank stack for teams building banking or embedded-finance products: a tenant-isolated API with 181 documented operations on a double-entry ledger, a provider-neutral FX runtime and Solidity atomic-settlement contracts.','An open-source neobank stack with a double-entry ledger, 181 documented API operations, FX support and atomic-settlement contracts.'],
  ['Wrote the platform scope and the ledger invariants, and built it as a pnpm monorepo of twelve packages that runs on Node with SQLite or on Cloudflare Workers with Durable Objects. The Builder Agent runs on Cloudflare’s agents SDK with Kimi K2.6 on Workers AI, behind a daily quota, a rate limit and an operator kill switch. The Solidity atomic-settlement contracts are tested with Foundry and the API is documented through Redocly.','I defined the banking model and ledger rules, then built the twelve-package open-source stack for Node and Cloudflare Workers. It includes the banking API, FX runtime, sandbox builder, documented OpenAPI interface and Foundry-tested settlement contracts.'],
  ['Released under MIT so a team can self-host the whole stack, read every operation and replace any provider. The governance files and adapter standards exist so that other people can build on it without asking.','Released under MIT. Teams can self-host it, extend the API and replace providers without being locked to a vendor.'],

  ['An autonomous marketing officer for a single small business: nineteen workspaces and twelve named AI staff roles that turn approved brand truth into campaigns, editable content, exact-version approvals, verified publishing, measured outcomes and governed learning, under human supervision.','A marketing operating system for small businesses: plan campaigns, create content, approve exact versions, publish and measure results with AI-assisted workflows under human control.'],
  ['A small business cannot hire a marketing department and cannot supervise one it does not understand. Yours gives it the department and keeps the human in the approval seat, with brand truth approved once and every output traced back to it.','Small businesses often need the output of a marketing team without the cost of building one. Yours puts planning, content, approvals, publishing and reporting in one place while the owner keeps final control.'],
  ['Wrote the 143 KB definitive product scope with its evidence hierarchy, tool-by-tool acceptance scenarios, object model, vertical packs and founder decisions, along with pricing, entitlements and vendor contracts. Built on Next.js 15, React 19 and Postgres 16 with pgvector under forced row-level security and three database roles, with a background worker, the Anthropic, OpenAI and Gemini SDKs, AWS KMS, S3 and Secrets Manager, and satori and ffmpeg rendering. Three satellite tools run live at runyours.ai subdomains: a brand-guideline generator, a YouTube thumbnail generator and a nightly editorial pipeline.','I wrote the product spec, pricing and workflow model and led the build across 19 workspaces and 12 specialist AI roles. The platform runs on Next.js, React and Postgres, with separate tools for brand guidelines, YouTube thumbnails and editorial planning already live.'],
  ['One small business gets the output of a marketing department and keeps the approval. Three satellite tools are live at runyours.ai subdomains, and live publishing and billing acceptance are still outstanding.','Designed as a subscription product for small businesses that need consistent marketing execution without building an internal team. Three supporting tools are already live; publishing and billing are still being completed.'],

  ['A workplace brain for corporate real estate consultants: a written brief goes in and a typed, reproducible space programme comes out, with a 40-screen consultant cockpit around it.','A workplace planning tool for corporate real estate teams. It turns a written brief into a repeatable space programme and lets consultants compare scenarios in one workspace.'],
  ['Specified the engine and the cockpit and built them with six multi-agent workflow scripts with named roles. The engine runs on Python, FastAPI, Pydantic 2, SQLite and pytest; the cockpit on Vite, React and TypeScript with Playwright over a Protomaps basemap. Backed by 1,000+ backend and 200+ frontend tests, 12 ADRs including one for an MCP command contract, 27 audit documents and a CI continuation gate. A written retrospective records that breadth-first agent swarms produced a large, shallow application, and proposes a quality-first mode instead.','I defined the planning model and consultant interface, then led the build across Python/FastAPI and React/TypeScript. The prototype has more than 1,200 automated tests and keeps the planning calculation separate from the AI adviser.'],

  ['A brokerage operating system: 38 surfaces linking market intelligence, CRM, property work, content production, campaigns, deals, recruitment and staff development, with six scripted persona journeys from broker to leadership.','A brokerage operating system with 38 screens covering research, CRM, property work, content, campaigns, deals, recruitment and staff development.'],
  ['Built for a named enterprise prospect as a working argument rather than a deck. Better property content attracts demand, helps agents win instructions, and gives the agency a stronger recruiting and operating proposition.','Built as a working prototype for a named enterprise prospect. It connects property content to enquiries, instructions, deals and the wider brokerage workflow.'],

  ['An agent that needs to move value between currencies has no defined tool to do it, so the step falls back to a human. This makes stablecoin FX a callable capability with a clear contract.','AI agents that need to convert between stablecoins usually hand the step back to a person. Sera exposes FX as a defined tool with clear inputs and outputs.'],
  ['Integration-led distribution: the capability reaches the end user through the agent products that adopt it, rather than through a consumer interface.','Sera for Agents is distributed through developer integrations rather than a separate consumer app.'],

  ['Product scope, the dashboard experience and the provider adapter boundary, built with an agent team on named, bounded roles with an adversarial verification pass before merge, then packaged for release.','I defined the product, dashboard and data-provider interface, then packaged the working front end for open-source release.'],
  ['Product scope, the graph model and the shortest-path interaction, built with an agent team on named, bounded roles with an adversarial verification pass before merge, then packaged for release.','I defined the product, graph model and shortest-path interaction, then packaged it for open-source release.'],
  ['Product scope, the directory experience and the submission adapter, built with an agent team on named, bounded roles with an adversarial verification pass before merge, then packaged as a rebrandable starter with the community discovery flow written up as the next step.','I defined the directory, listing and submission experience, then packaged it as a rebrandable open-source starter.'],
  ['Wrote the 50-version task ledger the Manus dev-agent built the internal deck tool against, alongside the ambassador programme and the team link page. This is the generalised MIT release of that tool.','I defined the document-sharing workflow, narration and analytics requirements, then turned the internal Sera tool into a general-purpose MIT release.'],
  ['Specified the team link page with wallet passes and had it built the same way as the ambassador programme, with Manus dev-agent commits and Claude Code branches against a written task ledger. This is its MIT release.','I defined the team profile, wallet pass, QR and analytics experience, then released the generalised version under MIT.'],
  ['Wrote the escrow design, the seven numbered invariants and the working rules recorded for future agents in the private product, then released the brand-stripped, credential-free copy under MIT with the settlement layer left as configuration.','I designed the escrow and signing flows, built the Telegram client, then released a brand-neutral MIT version with settlement left configurable.'],
  ['Built the programme for Sera against a written build bible and scraping spec, with Manus dev-agent commits and Claude Code branches, including the Token2049 Evangelist cohort scored on content quality and real reach. The MIT template keeps the AI back-ends.','I designed and built Sera’s ambassador programme, including activity scoring, rank progression and the content studio, then released a reusable MIT version.'],
  ['Product scope, the marketplace and booking experience and the simulated token ledger, built with an agent team on named, bounded roles with an adversarial verification pass before merge, then brand-stripped and packaged for release as the MIT copy of Creator Services.','I defined the marketplace, booking flow and creator dashboard, then packaged the product as an MIT reference app with the token ledger clearly marked as simulated.'],
  ['A written scope with its invariants, then an agent team on named, bounded roles building in parallel lanes, with an adversarial verification pass before anything merged.','Built from a written product scope and released as a reviewed open-source project.'],
  ['Built by an agent team on named, bounded roles with an adversarial verification pass before merge','Source and release history are public on GitHub'],
  ['Seven numbered invariants and the owner’s working rules recorded for the agents that come next','Seven settlement and safety rules documented in the repository'],

  // Campaign copy that read like internal strategy language rather than portfolio copy
  ['Built NextCurrency as a stablecoin news, research and market-intelligence product that also acts as a commercial acquisition engine for Sera.','Built NextCurrency as a stablecoin news and market-intelligence publication that also generates qualified leads for Sera.'],
  ['Create a credible trade publication and data product for stablecoins that can monitor the market, publish quickly, build repeat readership and turn relevant companies into scored commercial opportunities.','Build a credible stablecoin trade publication that people in payments would actually read, then connect that readership to qualified commercial opportunities.'],
  ['Product specification, information architecture, editorial system, market intelligence, AI agent architecture, publishing workflow, audience growth, lead scoring, CRM handoff and commercialisation.','I built NextCurrency end to end: product, editorial workflow, market data, audience growth, lead scoring, CRM attribution and sponsorship.'],
  ['Readers and covered companies are matched against Sera’s target-account map and passed into CRM with scoring and first-touch attribution.','Readers and companies are matched to Sera’s target-account list. Qualified matches go into CRM with the first article they read recorded as the source.'],
  ['Media sponsorship plus an owned acquisition and intelligence channel for Sera’s issuer, bank and PSP pipeline.','Sponsorship revenue plus qualified issuer, bank and PSP leads for Sera.'],
  ['I owned the French-market acquisition scope from creative through funded account, as AI-native activation partner to the lead agency.','I owned the French acquisition programme from creative and media through KYC and funded account.'],
  ['Aier Studios owned the French-market acquisition scope from creative through funded account, as AI-native activation partner to the lead agency.','Aier Studios owned the French acquisition programme from creative and media through KYC and funded account.'],
  ['Founded an AI-native marketing and technology studio, built the platform that ran every client account, and sold it to Coliseum for US$3M.','Founded a marketing and technology studio, built the platform that ran every client account, and sold the business to Coliseum for US$3M.']
]);

const regex = [
  [/^Inspect the source(\s*↗)?$/i,'View source$1'],
  [/^Inspect full image(\s*↗)?$/i,'View full image$1'],
  [/^Inspect the interface(\s*↗)?$/i,'View interface$1'],
  [/^Inspect developer experience(\s*↗)?$/i,'View developer experience$1'],
  [/^Inspect FX experience(\s*↗)?$/i,'View FX experience$1'],
  [/grounded FX assistant/gi,'FX assistant'],
  [/bounded trade-on-behalf agent/gi,'trade-on-behalf agent limited to defined actions'],
  [/named, bounded roles/gi,'defined roles'],
  [/adversarial verification pass/gi,'review pass'],
  [/written control plane/gi,'documented delivery workflow']
];

function rewrite(value){
  if(!value)return value;
  let next=exact.get(value) ?? value;
  for(const [pattern,replacement] of regex) next=next.replace(pattern,replacement);
  return next;
}

function polishText(root){
  if(root.nodeType===Node.TEXT_NODE){
    const raw=root.nodeValue;
    const core=raw.trim();
    if(!core)return;
    const next=rewrite(core);
    if(next!==core){
      const start=raw.match(/^\s*/)?.[0]||'';
      const end=raw.match(/\s*$/)?.[0]||'';
      root.nodeValue=start+next+end;
    }
    return;
  }
  if(root.nodeType!==Node.ELEMENT_NODE && root.nodeType!==Node.DOCUMENT_NODE)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode()))polishText(node);
  const scope=root.querySelectorAll?root:document;
  scope.querySelectorAll?.('[aria-label],[title]').forEach(el=>{
    for(const attr of ['aria-label','title']){
      const value=el.getAttribute(attr);if(!value)continue;
      const next=rewrite(value);if(next!==value)el.setAttribute(attr,next);
    }
  });
}

polishText(document.body);
new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes)polishText(node);
}).observe(document.body,{childList:true,subtree:true});
