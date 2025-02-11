import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  // Create a Supabase client and fetch the session
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users to the homepage
  if (!session) {
    redirect("/");
  }

  // Fetch all user profiles from the "profiles" table
  const { data: users, error } = await supabase.from("profiles").select("id, email, display_name, biography");

  if (error) {
    return <p className="text-red-500">Failed to fetch users: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <TypographyH2>Users</TypographyH2>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <div key={user.id} className="rounded border p-4 shadow">
            <h3 className="text-lg font-semibold">{user.display_name || "No Name Provided"}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="mt-2">{user.biography ?? "No biography available."}</p>

            {sessionUser && sessionUser.id === user.id && (
              <>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="mt-2 w-full">
                      Update Biography
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Biography</DialogTitle>
                      <DialogDescription>Edit your biography and save changes.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Enter new biography..."
                      className="h-24 w-full rounded border p-2"
                    />
                    <div className="mt-4 flex gap-2">
                      <Button onClick={updateBiography}>Save</Button>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
