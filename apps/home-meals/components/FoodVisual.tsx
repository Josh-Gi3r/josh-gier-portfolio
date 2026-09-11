export function FoodVisual({ tone, label, compact = false }: { tone: string; label: string; compact?: boolean }) {
  return (
    <div className={`food-visual tone-${tone} ${compact ? "compact" : ""}`} aria-label={`${label} image placeholder`}>
      <div className="food-visual-orb orb-a" />
      <div className="food-visual-orb orb-b" />
      <div className="food-visual-plate"><div className="food-visual-sauce"/><div className="food-visual-garnish"/></div>
      <span className="photo-kicker">PHOTO PLACEHOLDER</span>
      <strong>{label}</strong>
    </div>
  );
}
