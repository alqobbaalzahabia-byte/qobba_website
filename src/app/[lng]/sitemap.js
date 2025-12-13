export default function sitemap() {
  const baseUrl = 'http://localhost:3000';
  const languages = ['en', 'ar'];
  const pages = ['', 'services', 'projects', 'about-us', 'contact', 'team'];

  return languages.flatMap((lng) =>
    pages.map((page) => ({
      url: `${baseUrl}/${lng}${page ? `/${page}` : ''}`,
      lastModified: new Date().toISOString(),
      priority: page === '' ? 1.0 : 0.8,
      changefreq: 'weekly',
    }))
  );
}
