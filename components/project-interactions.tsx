"use client";

import { useActionState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { addCommentAction } from "@/actions/comments";
import { createBetaRequestAction, toggleProjectLikeAction } from "@/actions/engagement";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const initialState: { error?: string; success?: string } | null = null;

export function ProjectInteractions({
  projectId,
  slug,
  hasLiked,
  likesCount,
  betaAvailable
}: {
  projectId: string;
  slug: string;
  hasLiked?: boolean;
  likesCount: number;
  betaAvailable: boolean;
}) {
  const [, likeAction, likePending] = useActionState(
    async () => toggleProjectLikeAction(projectId, slug),
    null
  );
  const [betaState, betaAction, betaPending] = useActionState(
    createBetaRequestAction.bind(null, projectId, slug) as any,
    initialState
  );
  const [commentState, commentAction, commentPending] = useActionState(
    addCommentAction.bind(null, projectId, slug) as any,
    initialState
  );

  return (
    <div className="space-y-6">
      <form action={likeAction}>
        <Button type="submit" variant={hasLiked ? "subtle" : "secondary"} disabled={likePending} className="w-full">
          <Heart className="mr-2 size-4" />
          {hasLiked ? "Retirer mon vote" : "Soutenir ce projet"} ({likesCount})
        </Button>
      </form>

      {betaAvailable ? (
        <form action={betaAction} className="space-y-3">
          <Textarea name="message" placeholder="Précisez votre contexte, votre métier ou le type de retour que vous pouvez apporter." />
          {betaState?.error ? <p className="text-sm text-red-600">{betaState.error}</p> : null}
          {betaState?.success ? <p className="text-sm text-emerald-700">{betaState.success}</p> : null}
          <Button type="submit" disabled={betaPending} className="w-full">
            <Sparkles className="mr-2 size-4" />
            {betaPending ? "Envoi..." : "Demander l’accès bêta"}
          </Button>
        </form>
      ) : null}

      <form action={commentAction} className="space-y-3">
        <Textarea name="body" placeholder="Partagez un retour concret, une question produit ou un angle d’usage métier." />
        {commentState?.error ? <p className="text-sm text-red-600">{commentState.error}</p> : null}
        {commentState?.success ? <p className="text-sm text-emerald-700">{commentState.success}</p> : null}
        <Button type="submit" variant="secondary" disabled={commentPending} className="w-full">
          {commentPending ? "Publication..." : "Laisser un commentaire"}
        </Button>
      </form>
    </div>
  );
}
