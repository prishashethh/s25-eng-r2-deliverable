/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/* It defines a Species type based on the Supabase database schema. */
type Species = Database["public"]["Tables"]["species"]["Row"];

/* Defines a list of valid kingdom values (e.g., Animalia, Plantae, etc.).*/
const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

/* SpeciesSchema ensures form validation */
const speciesSchema = z.object({
  scientific_name: z.string().trim().min(1),
  common_name: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  kingdom: kingdoms,
  total_population: z.number().int().positive().nullable(),
  description: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  endangered: z.boolean().default(false),
});

type FormData = z.infer<typeof speciesSchema>;

export default function EditSpeciesDialog({ species }: { species: Species }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      scientific_name: species.scientific_name,
      common_name: species.common_name,
      kingdom: species.kingdom,
      total_population: species.total_population,
      description: species.description,
      endangered: species.endangered ?? false,
    },
    mode: "onChange",
  });

  <FormField
    control={form.control}
    name="endangered"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Endangered</FormLabel>
        <FormControl>
          <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />;

  /* Connects to Supabase. Updates the species record */
  const onSubmit = async (input: FormData) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("species")
      .update({
        scientific_name: input.scientific_name,
        common_name: input.common_name,
        kingdom: kingdoms.parse(input.kingdom),
        total_population: input.total_population,
        description: input.description,
        endangered: input.endangered,
      })
      .eq("id", species.id);

    if (error) {
      return toast({ title: "Error updating species", description: error.message, variant: "destructive" });
    }

    setOpen(false);
    form.reset(input);
    router.refresh();

    return toast({ title: "Species updated successfully!" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="mt-2 w-full">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
          <DialogDescription>Modify the species details and save your changes.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <FormField /*Renders a label and input box. Displays validation errors (FormMessage) if the input is invalid.*/
              control={form.control}
              name="scientific_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scientific Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="common_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Common Name</FormLabel>
                  <FormControl>
                    <Input value={field.value ?? ""} onChange={field.onChange} placeholder="Enter Common Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kingdom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kingdom</FormLabel>
                  <FormControl>
                    <select
                      value={field.value ?? "Animalia"} // Default to a valid kingdom
                      onChange={(e) => field.onChange(kingdoms.parse(e.target.value))}
                      className="w-full rounded border p-2"
                    >
                      {kingdoms.options.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_population"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Population</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value !== null ? field.value : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                      placeholder="Enter total population"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea value={field.value ?? ""} onChange={field.onChange} placeholder="Enter description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex gap-2">
              <Button type="submit">Save Changes</Button>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
