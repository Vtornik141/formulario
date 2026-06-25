type ChoiceCardProps = {
  active: boolean;
  title: string;
  desc?: string;
  onClick: () => void;
};

export function ChoiceCard({ active, title, desc, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl px-4 py-3.5 transition w-full border-[1.5px] ${
        active ? "bg-musgo border-musgo" : "bg-crema-soft border-line"
      }`}
    >
      <div className={`text-sm font-semibold ${active ? "text-white" : "text-grafito"}`}>
        {title}
      </div>
      {desc && (
        <div className={`text-xs mt-0.5 ${active ? "text-white/85" : "text-grafito-soft"}`}>
          {desc}
        </div>
      )}
    </button>
  );
}
