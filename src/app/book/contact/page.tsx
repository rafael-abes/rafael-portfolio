import type { Metadata } from "next";
import { ContactSection } from "@/src/components/ContactSection";

export const metadata: Metadata = {
  title: "The next course · Rafael Abes",
  description: "Get in touch with Rafael Abes.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContactSection />;
}