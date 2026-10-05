import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  webApplicationJsonLd,
} from "@/lib/seo/structured-data";
import { getCategoryById } from "@/lib/tools/categories";
import { getAllToolSlugs, getToolBySlug } from "@/lib/tools/registry";
import { isImageConverterSlug } from "@/lib/image-converter/configs";
import { isImageEditorSlug } from "@/lib/image-editor/configs";
import { isDocumentDataSlug } from "@/lib/document-data/configs";
import { isPdfToolSlug } from "@/lib/pdf/configs";
import { isAudioToolSlug } from "@/lib/audio/configs";
import { isVideoToolSlug } from "@/lib/video/configs";
import { isTextToolSlug } from "@/lib/text/configs";
import { isDeveloperToolSlug } from "@/lib/developer/configs";
import { isSecurityToolSlug } from "@/lib/security/configs";
import { isCalculatorToolSlug } from "@/lib/calculator/configs";
import { isSpecializedCalculatorSlug } from "@/lib/specialized-calculators";
import { isGeneratorToolSlug } from "@/lib/tools/generator-tools";

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return createPageMetadata({
      title: "Tool Not Found",
      description: "The requested Tool Base tool could not be found.",
      path: `/tools/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: tool.seoTitle.replace(" | Tool Base", ""),
    description: tool.seoDescription,
    path: tool.route,
    keywords: tool.keywords,
  });
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = getCategoryById(tool.category);
  const workspace =
    isImageConverterSlug(tool.slug) ||
    isImageEditorSlug(tool.slug) ||
    isPdfToolSlug(tool.slug) ||
    isDocumentDataSlug(tool.slug) ||
    isAudioToolSlug(tool.slug) ||
    isVideoToolSlug(tool.slug) ||
    isTextToolSlug(tool.slug) ||
    isDeveloperToolSlug(tool.slug) ||
    isSecurityToolSlug(tool.slug) ||
    isCalculatorToolSlug(tool.slug) ||
    isSpecializedCalculatorSlug(tool.slug) ||
    isGeneratorToolSlug(tool.slug) ? (
      <ToolWorkspace tool={tool} />
    ) : undefined;

  return (
    <>
      <JsonLd data={webApplicationJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          ...(category
            ? [{ name: category.name, path: category.route }]
            : [{ name: "All Tools", path: "/tools" }]),
          { name: tool.name, path: tool.route },
        ])}
      />
      {tool.faq.length ? <JsonLd data={faqJsonLd(tool.faq)} /> : null}
      <ToolPageShell tool={tool} workspace={workspace} />
    </>
  );
}
