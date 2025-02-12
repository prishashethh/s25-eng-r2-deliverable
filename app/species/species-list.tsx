/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import type { Database } from "@/lib/schema";
import { useState } from "react";
import AddSpeciesDialog from "./add-species-dialog";
import SpeciesCard from "./species-card";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesList({ species, sessionId }: { species: Species[]; sessionId: string }) {
  const [search, setSearch] = useState("");

  // Filter species based on search query
  const filteredSpecies = species.filter((sp: Species) => {
    const searchLower = search.toLowerCase();
    return (
      sp.scientific_name?.toLowerCase().includes(searchLower) ||
      sp.common_name?.toLowerCase().includes(searchLower) ||
      sp.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog userId={sessionId} />
      </div>

      <Separator className="my-4" />

      <div className="mb-5 flex justify-center">
        <Input
          type="text"
          placeholder="Search species..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded border p-2"
        />
      </div>

      <div className="flex flex-wrap justify-center">
        {filteredSpecies.length > 0 ? (
          filteredSpecies.map((sp) => <SpeciesCard key={sp.id} species={sp} sessionId={sessionId} />)
        ) : (
          <p className="col-span-full text-center text-gray-600">No species found.</p>
        )}
      </div>
    </>
  );
}
