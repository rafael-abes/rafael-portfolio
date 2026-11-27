import type { Metadata } from "next";
import { RecipeCollection } from "@/src/components/recipe/RecipeCollection";

export const metadata: Metadata = {
  title: "The recipes · Rafael Abes",
  description: "Selected software engineering projects by Rafael Abes, written up as recipes.",
  alternates: { canonical: "/recipes" },
};

export default function Page() {
  return <RecipeCollection />;
}