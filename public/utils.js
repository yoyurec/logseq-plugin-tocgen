import { parse } from "./marked-renderer.js"

export async function parseContent(content) {
  // Remove front matter.
  content = content.replace(/---\n(-(?!--)|[^-])*\n---\n?/g, "")

  // Remove properties.
  content = content.replace(/\b[^:\n]+:: [^\n]+/g, "")

  // Handle markdown.
  content = parse(content)

  // Replace block refs with their content.
  let match
  while ((match = /\(\(([^\)]+)\)\)/d.exec(content)) != null) {
    const [start, end] = match.indices[0]
    const refUUID = match[1]
    const refBlock = await logseq.Editor.getBlock(refUUID)
    const refContent = await parseContent(refBlock.content)
    content = `${content.substring(0, start)}${refContent}${content.substring(
      end,
    )}`
  }

  // Remove page refs
  content = content.replace(/\[\[([^\]]+)\]\]/g, "$1")

  // Remove html escape characters. For exmaple: "&amp;"
  content = htmlDecode(content)

  return content.trim()
}

function htmlDecode(str) {
  if (str.length === 0) {
    return ""
  }

  return str
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
}

export const HeadingTypes = {
  // Accepts anything as a heading
  any: "any",
  // Accepts only H1..Hn as headings
  h: "h",
}