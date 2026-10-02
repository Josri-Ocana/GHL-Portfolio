import type { ProjectVideo } from "@/types/project";
export function safeExternalUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : undefined;
  } catch {
    return undefined;
  }
}
export function videoFileUrl(value: string): string | undefined {
  const external = safeExternalUrl(value);
  if (external) return external;
  if (!value.startsWith("/media/") || /\\|%2f|%5c/i.test(value)) return undefined;
  const url = new URL(value, "https://local.invalid");
  return url.pathname.startsWith("/media/") && url.pathname.endsWith(".mp4")
    ? `${url.pathname}${url.search}${url.hash}`
    : undefined;
}
export function videoEmbedUrl(video: ProjectVideo): string | undefined {
  const safe = safeExternalUrl(video.url);
  if (!safe || video.provider === "file") return undefined;
  const url = new URL(safe);
  const host = url.hostname.replace(/^www\./, "");
  const segments = url.pathname.split("/").filter(Boolean);
  if (video.provider === "loom" && host === "loom.com") {
    const id = ["share", "embed"].includes(segments[0]) ? segments[1] : undefined;
    if (id && /^[a-zA-Z0-9]+$/.test(id)) return `https://www.loom.com/embed/${id}`;
  }
  if (
    video.provider === "youtube" &&
    ["youtube.com", "youtu.be", "youtube-nocookie.com"].includes(host)
  ) {
    const id =
      host === "youtu.be"
        ? segments[0]
        : url.searchParams.get("v") ||
          (["embed", "shorts"].includes(segments[0]) ? segments[1] : undefined);
    if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  if (video.provider === "vimeo" && ["vimeo.com", "player.vimeo.com"].includes(host)) {
    const id = segments.find((segment) => /^\d+$/.test(segment));
    const hash = url.searchParams.get("h") || (id ? segments[segments.indexOf(id) + 1] : undefined);
    if (id)
      return `https://player.vimeo.com/video/${id}${hash && /^[a-zA-Z0-9]+$/.test(hash) ? `?h=${hash}` : ""}`;
  }
}
