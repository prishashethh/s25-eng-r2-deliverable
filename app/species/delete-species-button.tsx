"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteSpeciesButton({ speciesId }: { speciesId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this species? This action cannot be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    const supabase = createBrowserSupabaseClient();

    const { error } = await supabase.from("species").delete().eq("id", speciesId);

    if (error) {
      setIsDeleting(false);
      return toast({ title: "Error", description: error.message, variant: "destructive" });
    }

    toast({ title: "Species deleted successfully." });
    router.refresh();
  };

  return (
    <Button onClick={() => void handleDelete()} variant="destructive" className="mt-2 w-full" disabled={isDeleting}>
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
