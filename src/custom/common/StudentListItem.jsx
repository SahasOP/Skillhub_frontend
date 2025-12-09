import { Button } from "@mui/material";
import { UserPlus, X } from "lucide-react";


const StudentListItem = ({ student, onAdd, onRemove, isSelected }) => {
  const containerClasses = isSelected
    ? "flex items-center justify-between p-2 bg-blue-50 rounded"
    : "flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer";

  return (
    <div
      className={containerClasses}
      onClick={isSelected ? undefined : () => onAdd(student)}
      role={isSelected ? undefined : "button"}
      tabIndex={isSelected ? undefined : 0}
      onKeyDown={(e) => {
        if (!isSelected && (e.key === "Enter" || e.key === " ")) {
          onAdd(student);
        }
      }}
    >
      <div>
        <p className="font-medium">{student.name}</p>
        <p className="text-sm text-gray-500">
          {student.prn} | {student.year} | {student.branch}
        </p>
      </div>
      {isSelected ? (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(student._id);
          }}
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700"
          aria-label={`Remove ${student.name}`}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
      )}
    </div>
  );
};
export default StudentListItem;