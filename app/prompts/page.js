import SectionClient from "../SectionClient";

export const metadata = {
  title: "WSC Collaborative Writing Prompts — ScholarVault",
  description: "Free writing prompts for World Scholar's Cup practice.",
};

export default function PromptsPage() {
  return <SectionClient section="prompts" />;
}
