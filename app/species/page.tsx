import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import SpeciesList from "./species-list";

export default async function SpeciesPage() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Obtain the ID of the currently signed-in user
  const sessionId = session.user.id;

  const { data: species } = await supabase
    .from("species")
    .select(
      `
    id,
    scientific_name,
    common_name,
    description,
    total_population,
    kingdom,
    endangered,
    author,
    image,
    profiles(id, display_name, email)
  `,
    )
    .order("id", { ascending: false });

  return <SpeciesList species={species ?? []} sessionId={sessionId} />;
}
