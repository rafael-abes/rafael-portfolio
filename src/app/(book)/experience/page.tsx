import type { Metadata } from "next";
import { ChefJourney } from "@/src/components/chef/ChefJourney";

export const metadata: Metadata = {
  title: "The experience · Rafael Abes",
  description: "Professional experience and education.",
  alternates: { canonical: "/experience" },
};

export default function Page() {
  return <ChefJourney />;
}