import type { Metadata } from "next";
import { RecipeCollection } from "@/src/components/recipe/RecipeCollection";

export const metadata: Metadata = {
  title: "The recipes · À la Rafael",
  description: "Selected software engineering projects by Rafael Abes, written up as recipes.",
  alternates: { canonical: "/recipes" },
};

export default function Page() {
  return <RecipeCollection />;
}