import type { Metadata } from "next";
import { TableOfContents } from "@/src/components/TableOfContents";
import { Intro } from "@/src/components/Intro";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Contents and introduction: the front of the book. */
export default function Home() {
  return (
    <>
      <TableOfContents />
      <Intro />
    </>
  );
}
