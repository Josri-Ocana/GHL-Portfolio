"use client";
import Image from "next/image";
import { useState } from "react";
import type { ProjectVideo } from "@/types/project";
import { safeExternalUrl, videoEmbedUrl, videoFileUrl } from "@/lib/media";
export function VideoPlayer({ video }: { video: ProjectVideo }) {
  const [loaded, setLoaded] = useState(false);
  const embed = videoEmbedUrl(video);
  const file = video.provider === "file" ? videoFileUrl(video.url) : undefined;
  const fallback = safeExternalUrl(video.url) || file;
  return (
    <div className="video-block">
      <div className="video-frame">
        {loaded && embed ? (
          <iframe
            src={embed}
            title={video.title}
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : loaded && file ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={video.poster}
            aria-label={video.title}
          >
            <source src={file} type="video/mp4" />
            {video.captions && (
              <track kind="captions" src={video.captions} srcLang="en" label="English" default />
            )}
            Your browser does not support this video.
          </video>
        ) : embed || file ? (
          <button
            className="video-poster"
            onClick={() => setLoaded(true)}
            aria-label={`Load video: ${video.title}`}
          >
            {video.poster && (
              <Image src={video.poster} alt="" fill sizes="(max-width: 900px) 100vw, 80vw" />
            )}
            <span className="button button-dark">
              <span className="cta-label">Watch walkthrough</span>
            </span>
            <span className="video-label">{video.title}</span>
          </button>
        ) : (
          <p className="video-unavailable">
            This walkthrough is available at the source link below.
          </p>
        )}
      </div>
      {fallback && (
        <a
          className="text-link"
          aria-label={`Watch walkthrough: ${video.title} (opens in a new tab)`}
          href={fallback}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="cta-label">Watch walkthrough</span>
        </a>
      )}
      {video.transcript && (
        <details className="video-transcript">
          <summary>Read video transcript</summary>
          <p>{video.transcript}</p>
        </details>
      )}
    </div>
  );
}
