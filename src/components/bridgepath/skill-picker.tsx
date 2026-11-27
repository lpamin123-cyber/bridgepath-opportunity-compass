import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { skills, type Skill } from "@/lib/bridgepath/model";
export function SkillPicker({
  value,
  onChange,
}: {
  value: Skill[];
  onChange: (skills: Skill[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Button
          key={skill}
          type="button"
          size="sm"
          variant={value.includes(skill) ? "secondary" : "outline"}
          aria-pressed={value.includes(skill)}
          onClick={() =>
            onChange(value.includes(skill) ? value.filter((s) => s !== skill) : [...value, skill])
          }
        >
          {value.includes(skill) ? <Check size={12} /> : <Plus size={12} />}
          {skill}
        </Button>
      ))}
    </div>
  );
}
