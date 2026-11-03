import { crew, crewById } from "@/lib/career-avatar";
import Avatar from "./Avatar";

// A row of the Tech Crew. Pass ids to pick who shows and in what order.
export default function CrewStrip({
  ids,
  size = 72,
  showNames = false,
  className = "",
}: {
  ids?: string[];
  size?: number;
  showNames?: boolean;
  className?: string;
}) {
  const members = ids ? ids.flatMap((id) => crewById(id) ?? []) : crew;
  return (
    <ul className={`flex flex-wrap items-end justify-center gap-x-3 gap-y-4 ${className}`}>
      {members.map((m) => (
        <li key={m.id} className="flex flex-col items-center gap-1">
          <Avatar
            look={m.look}
            size={size}
            label={showNames ? undefined : m.name}
            className="drop-shadow-md"
          />
          {showNames && <span className="text-sm font-extrabold">{m.name}</span>}
        </li>
      ))}
    </ul>
  );
}
