import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function EditableBadgeButton() {
  const [values, setValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);

  const addValue = () => {
    if (inputValue.trim() !== "") {
      setValues([...values, inputValue.trim()]);
      setInputValue("");
    }
    setEditing(false);
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {values.map((val, index) => (
        <Badge key={index} className="flex items-center gap-1 cursor-pointer">
          {val}
          <X className="w-3 h-3 cursor-pointer" onClick={() => removeValue(index)} />
        </Badge>
      ))}
      {editing ? (
        <Input
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={addValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") addValue();
          }}
          className="w-32"
        />
      ) : (
        <Button variant="outline" size="icon" onClick={() => setEditing(true)}>
          <Plus className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
