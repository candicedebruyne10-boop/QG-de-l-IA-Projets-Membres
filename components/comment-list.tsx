import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types";
import { Card } from "@/components/ui/card";

export function CommentList({ comments }: { comments: Comment[] }) {
  if (!comments.length) {
    return (
      <Card className="p-6">
        <p className="text-sm text-[#6B7280]">Aucun commentaire pour le moment. Le premier retour qualifié aide souvent beaucoup un créateur.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-[#2D355A]">{comment.profiles?.display_name ?? "Membre QG"}</p>
              <p className="text-sm text-[#7A869F]">{formatDate(comment.created_at)}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#55607A]">{comment.body}</p>
        </Card>
      ))}
    </div>
  );
}
