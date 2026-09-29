import type { Project } from "@/types/project";
import { VideoPlayer } from "./VideoPlayer";
export function ProjectWalkthrough({ project }: { project: Project }) {
  if (project.video) return <VideoPlayer video={project.video} />;
  if (!project.isDemo || !project.demoVideoSlot) return null;
  return (
    <div className="demo-video">
      <span className="micro">VIDEO WALKTHROUGH / DEMO MEDIA SLOT</span>
      <p>
        A closer look.
        <br />
        <span>Coming with real work.</span>
      </p>
      <span>No recording is available for this illustrative project.</span>
    </div>
  );
}
