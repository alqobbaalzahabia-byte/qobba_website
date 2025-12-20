import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const LANGUAGES = ["en", "ar"];
const EXCLUDED_ROUTES = ["dashboard", "login"];

function hasPageFile(dir) {
  return ["page.js", "page.jsx"].some((file) =>
    fs.existsSync(path.join(dir, file))
  );
}

function getRoutes(dir, baseRoute = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (EXCLUDED_ROUTES.includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const routeName = entry.name.startsWith("[") ? "" : `/${entry.name}`;
    const route = `${baseRoute}${routeName}`;

    if (hasPageFile(fullPath)) {
      routes.push(route || "/");
    }

    routes.push(...getRoutes(fullPath, route));
  }

  return routes;
}

export default function sitemap() {
  const baseDir = path.join(process.cwd(), "src/app/[lng]");
  const pages = getRoutes(baseDir);

  return LANGUAGES.flatMap((lng) =>
    pages.map((page) => ({
      url: `${BASE_URL}/${lng}${page === "/" ? "" : page}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: page === "/" ? 1.0 : 0.8,
    }))
  );
}