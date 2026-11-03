import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { sitemapStaticPaths, sitemapXML } from "@/lib/sitemap";

describe("Public search discovery", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("includes all six public business pages", () => {
    expect(sitemapStaticPaths(router)).toEqual(["/", "/about", "/contact", "/industries", "/services", "/track"]);
  });

  it("excludes dashboards and account flows", () => {
    const paths = sitemapStaticPaths(router);
    for (const path of ["/admin", "/portal", "/auth", "/reset-password", "/sitemap.xml"]) {
      expect(paths).not.toContain(path);
    }
  });

  it("uses the public domain without invented modification dates", () => {
    const xml = sitemapXML("https://thornvelllogisticservices.online", [{ path: "/services" }]);
    expect(xml).toContain("<loc>https://thornvelllogisticservices.online/services</loc>");
    expect(xml).not.toContain("<lastmod>");
  });

  it("rejects URLs that escape the public origin", () => {
    expect(() => sitemapXML("https://thornvelllogisticservices.online", [{ path: "//example.com" }])).toThrow("Invalid sitemap path");
  });
});