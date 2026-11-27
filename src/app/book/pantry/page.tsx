import type { Metadata } from "next";
import { Pantry } from "@/src/components/misc/Pantry";

export const metadata: Metadata = {
  title: "The pantry · Rafael Abes",
  description: "The technologies and skills behind Rafael Abes's work. Pick ingredients to see which projects used them.",
  alternates: { canonical: "/pantry" },
};

export default function Page() {
  return <Pantry />;
}