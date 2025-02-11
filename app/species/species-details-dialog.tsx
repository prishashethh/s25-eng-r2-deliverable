"use client"; /* Tells Next.js that this is a client-side component */

/* UI Componenets for creating the pop-up dialogue */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";

/* This defines the Species type from our database */
type Species = Database["public"]["Tables"]["species"]["Row"];

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
          <p>
            <strong>Description:</strong> {species.description ?? "No description available."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
