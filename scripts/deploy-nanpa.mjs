const hook = process.env.NANPA_VERCEL_DEPLOY_HOOK;
let url;
try {
  url = new URL(hook);
  if (url.origin !== "https://api.vercel.com" ||
      !/^\/v1\/integrations\/deploy\/prj_[A-Za-z0-9]+\/[A-Za-z0-9]+$/.test(url.pathname) ||
      url.username || url.password || url.search || url.hash) throw new Error();
} catch {
  throw new Error("Configure a dedicated Vercel main-branch deploy-hook secret.");
}

if (!process.argv.includes("--check")) {
  try {
    const response = await fetch(url, { method: "POST", signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error();
    const result = await response.json();
    if (!result?.job?.id) throw new Error();
    console.log("Vercel deployment requested. Verify the resulting deployment reaches Ready.");
  } catch {
    // A timed-out hook may already have started a deployment. Avoid automatic retries.
    throw new Error("Deployment request failed or is ambiguous. Inspect Vercel before manually rerunning.");
  }
}
