import { createFileRoute, notFound } from "@tanstack/react-router";

const PAGES: Record<string, { title: string; body: string }> = {
  privacy: { title: "Privacy Policy", body: "We collect only the details you submit through our enquiry forms and use them solely to respond to your request. The full privacy policy will be published here once finalised by Thornvell Logistics." },
  terms: { title: "Terms & Conditions", body: "Terms and conditions of service will be published here once finalised by Thornvell Logistics." },
  cookies: { title: "Cookie Policy", body: "This website uses only the cookies required for it to function. The full cookie policy will be published here once finalised." },
};

export const Route = createFileRoute("/legal/$page")({
  loader: ({ params }) => {
    const page = PAGES[params.page];
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Legal"} — Thornvell Logistics` },
      { name: "description", content: `${loaderData?.title ?? "Legal information"} for Thornvell Logistics.` },
      { property: "og:title", content: `${loaderData?.title ?? "Legal"} — Thornvell Logistics` },
      { property: "og:description", content: "Legal information for Thornvell Logistics." },
    ],
  }),
  component: Legal,
});

function Legal() {
  const page = Route.useLoaderData();
  return (
    <>
      <div className="h-20 bg-navy-deep" />
      <section className="container-x max-w-3xl py-24">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 text-4xl font-extrabold text-navy-deep">{page.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{page.body}</p>
      </section>
    </>
  );
}
