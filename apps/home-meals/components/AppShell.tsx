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
  if (q.includes("creamy") && q.includes("chicken")) return "Do the mustard mushroom chicken. You already have chicken, mushrooms, DARK cubes, cream and Dijon. Put water on for pasta first.";
  if (q.includes("tonight")) return "Tonight I’d use the mushrooms first: mustard mushroom chicken. It takes about 22 minutes and uses two DARK cubes.";
  if (q.includes("gold")) return "You have 8 GOLD cubes in the demo kitchen. This week’s plan uses two on Tuesday, so there’s no need to prep GOLD yet.";
  if (q.includes("cream")) return "Cream is marked LOW and the demo plan uses it Monday. Add one small carton to the next shop.";
  return "Phase 1 Home AI is using the household demo state. I can already answer against recipes, bases, the freezer and this week’s plan; realtime voice and vision plug into this surface in Phase 2.";
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ who: "you" | "home"; text: string }[]>([
    { who: "home", text: "What are we doing? Ask about tonight, the freezer, prep or a recipe." }
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
        <div className="rail-status"><span className="status-dot"/><div><strong>Kitchen synced</strong><small>Demo state · Phase 1</small></div></div>
      </aside>

      <main className="app-main">{children}</main>

      <nav className="mobile-nav">
        {nav.slice(0, 5).map((item) => <Link key={item.href} href={item.href} className={active === item.href ? "active" : ""}><Icon name={item.icon} size={19}/><span>{item.label}</span></Link>)}
      </nav>

      <button className="ask-home-fab" onClick={() => setOpen(true)}><Icon name="spark"/><span>Ask Home</span></button>

      {open && <div className="ask-sheet-backdrop" onClick={() => setOpen(false)}>
        <section className="ask-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="ask-sheet-head"><div><span className="eyebrow">HOUSEHOLD BRAIN</span><h2>Ask Home</h2></div><button className="icon-button" onClick={() => setOpen(false)}>×</button></div>
          <div className="ask-messages">
            {messages.map((message, i) => <div key={i} className={`message ${message.who}`}>{message.text}</div>)}
          </div>
          <div className="quick-prompts"><button onClick={() => setQuery("What should we cook tonight?")}>Tonight?</button><button onClick={() => setQuery("How many GOLD cubes?")}>GOLD stock</button><button onClick={() => setQuery("I want creamy chicken")}>Creamy chicken</button></div>
          <div className="ask-composer"><Link href="/scan" className="round-action"><Icon name="camera"/></Link><button className="round-action"><Icon name="mic"/></button><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about your kitchen…"/><button className="send-button" onClick={send}><Icon name="arrow"/></button></div>
        </section>
      </div>}
    </div>
  );
}
