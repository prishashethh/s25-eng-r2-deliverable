"use client"; /* Tells Next.js that this is a client-side component */

/* UI Componenets for creating the pop-up dialogue */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";

/* This defines the Species type from our database */
type Species = Database["public"]["Tables"]["species"]["Row"] & {
  profiles: {
    id: string;
    display_name: string | null;
    email: string;
  } | null; // ✅ Allow null in case no author data exists
};

export default function SpeciesDetailsDialog({ species }: { species: Species }) {
  return (
    <Dialog>
      <DialogTrigger asChild /* Allows the button to stay clickable */>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2" /* Add spacing between the items*/>
          <p>
            <strong>Common Name:</strong> {species.common_name ?? "N/A"}
          </p>
          <p>
            <strong>Total Population:</strong> {species.total_population?.toLocaleString() ?? "Unknown"}
          </p>
          <p>
            <strong>Kingdom:</strong> {species.kingdom}
          </p>
          <p className={`font-bold ${species.endangered ? "text-red-600" : "text-green-600"}`}>
            <strong>Status:</strong> {species.endangered ? "Endangered" : "Not Endangered"}
          </p>
          <p>
            <strong>Description:</strong> {species.description ?? "No description available."}
          </p>

          <hr className="my-3" />
          <p>
            <strong>Added By:</strong> {species.profiles?.display_name ?? "Unknown"}
          </p>
          <p>
            <strong>Contact:</strong> {species.profiles?.email ?? "No contact available"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
