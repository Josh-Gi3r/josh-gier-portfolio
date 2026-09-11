"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "./Icons";

const nav = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/cook", label: "Cook", icon: "cook" as const },
  { href: "/prep", label: "Prep", icon: "prep" as const },
  { href: "/kitchen", label: "Kitchen", icon: "kitchen" as const },
  { href: "/plan", label: "Plan", icon: "plan" as const },
  { href: "/learn", label: "Learn", icon: "learn" as const }
];

const replyFor = (query: string) => {
  const q = query.toLowerCase();
  if (q.includes("gold")) return "GOLD is the Indian onion-tomato masala mother: 60 ml modules, starter batch ×12. The critical cue is properly golden onion first, then tomato cooked until thick and glossy with slight oil separation.";
  if (q.includes("sambal") || q.includes("pecah")) return "For SAMBAL, the clock is secondary. Keep frying until the paste darkens and red oil visibly separates from the solids — pecah minyak. Starter portions are 60 ml ×8.";
  if (q.includes("grocery") || q.includes("shop")) return "Start with the First Run shop, not the Full Library restock. It supports all six mothers plus PESTO, THAI-G, WOK-B, TARE-T and four core boosters.";
  if (q.includes("prep") || q.includes("session")) return "First Run is split into two sessions: Session A makes all six hot mother bases in about 3½ hours; Session B makes four core mids and four boosters in about 90 minutes.";
  if (q.includes("cream")) return "Cream stays out of the frozen mothers. Add it fresh at dinner time so the base freezes cleanly and can branch into non-creamy dishes too.";
  if (q.includes("label") || q.includes("freezer")) return "Label every frozen component CODE / ML / DATE — for example GOLD / 60 / 11SEP. Freeze with airflow around trays, then move solid portions into labelled bags.";
  if (q.includes("tonight") || q.includes("cook") || q.includes("meal")) return "The foundation is authoritative now; the researched meal library is the next content layer. I won’t invent a dinner from the old fixture recipes. Use Prep and Groceries first while meals are being rebuilt.";
  return "Ask me about a mother base, mid-base, booster, the First Run shop, prep-day sequence, portion size, freezer label or storage rule. The researched meal layer is next.";
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ who: "you" | "home"; text: string }[]>([
    { who: "home", text: "Foundation mode is live. Ask about mothers, mids, boosters, shopping, prep order, portions or freezer storage." }
  ]);
  const active = useMemo(() => nav.find((item) => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))?.href, [pathname]);

  const send = () => {
    const clean = query.trim();
    if (!clean) return;
    setMessages((m) => [...m, { who: "you", text: clean }, { who: "home", text: replyFor(clean) }]);
    setQuery("");
  };

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <Link href="/" className="brand-mark"><span>H</span><div><strong>Home Meals</strong><small>Josh + G</small></div></Link>
        <nav className="side-nav">
          {nav.map((item) => <Link key={item.href} href={item.href} className={active === item.href ? "active" : ""}><Icon name={item.icon}/><span>{item.label}</span></Link>)}
        </nav>
        <div className="rail-status"><span className="status-dot"/><div><strong>Foundation live</strong><small>Meals are the next content layer</small></div></div>
      </aside>

      <main className="app-main">{children}</main>

      <nav className="mobile-nav">
        {nav.slice(0, 5).map((item) => <Link key={item.href} href={item.href} className={active === item.href ? "active" : ""}><Icon name={item.icon} size={19}/><span>{item.label}</span></Link>)}
      </nav>

      <button className="ask-home-fab" onClick={() => setOpen(true)}><Icon name="spark"/><span>Ask Home</span></button>

      {open && <div className="ask-sheet-backdrop" onClick={() => setOpen(false)}>
        <section className="ask-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="ask-sheet-head"><div><span className="eyebrow">FOUNDATION BRAIN</span><h2>Ask Home</h2></div><button className="icon-button" onClick={() => setOpen(false)}>×</button></div>
          <div className="ask-messages">
            {messages.map((message, i) => <div key={i} className={`message ${message.who}`}>{message.text}</div>)}
          </div>
          <div className="quick-prompts"><button onClick={() => setQuery("What should I shop first?")}>First shop</button><button onClick={() => setQuery("How do I know GOLD is ready?")}>GOLD cue</button><button onClick={() => setQuery("How should I label the freezer?")}>Labels</button></div>
          <div className="ask-composer"><Link href="/scan" className="round-action"><Icon name="camera"/></Link><button className="round-action" disabled title="Realtime voice arrives with the AI phase"><Icon name="mic"/></button><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about the foundation…"/><button className="send-button" onClick={send}><Icon name="arrow"/></button></div>
        </section>
      </div>}
    </div>
  );
}
