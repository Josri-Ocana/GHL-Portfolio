// Oxc's experimental raw-transfer buffer fails intermittently on this Windows host.
// Use Knip's supported standard parser fallback; analysis rules remain unchanged.
if (process.platform === "win32") process.env.KNIP_DISABLE_RAW_TRANSFER = "1";
