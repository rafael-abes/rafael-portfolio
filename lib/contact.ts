/**
 * Contact details shown on the receipt and (later) the contact chapter.
 *
 * Nothing here has been supplied yet, so every value is null. Fill these in
 * and they appear everywhere automatically. While SHOW_DRAFT_MARKERS is on,
 * missing values show as a handwritten reminder on screen; they are never
 * written into a downloaded receipt.
 */
export interface Contact {
  email: string | null;
  linkedin: string | null;
  github: string | null;
  resume: string | null;
}

export const contact: Contact = {
  email: "rafaelabes.1201@gmail.com",
  linkedin: "linkedin.com/in/rafael-abes",
  github: "github.com/rafael-abes",
  // No public resume URL yet. Add one (for example a PDF in /public) and the receipt picks it up.
  resume: null,
};

export const contactLabels: Record<keyof Contact, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
  resume: "Resume",
};