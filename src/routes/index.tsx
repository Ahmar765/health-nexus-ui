import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/pharma/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aether Pharma OS — The Future of Pharmacy Management" },
      { name: "description", content: "A luxury healthcare operating system: intelligent inventory, real-time analytics, and immersive 3D pharmacy operations." },
      { property: "og:title", content: "Aether Pharma OS" },
      { property: "og:description", content: "Intelligent inventory, analytics, and healthcare operations in one beautiful experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Landing />;
}
