import { Badge } from "@/components/ui/badge";

export function ProjectMeta({
  category,
  profession,
  projectStatus,
  stage
}: {
  category: string;
  profession: string;
  projectStatus: string;
  stage: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>{category}</Badge>
      <Badge>{profession}</Badge>
      <Badge>{projectStatus}</Badge>
      <Badge>{stage}</Badge>
    </div>
  );
}
