import { Helmet } from 'react-helmet-async'

function Seo ({
  title,
  description,
  url,
  image = '/og-image.jpg',
  schema,
  keywords,
  author = 'Les Deux Colombes',
  imageAlt = 'Les Deux Colombes Restaurant'
}) {
  const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://lesdeuxcolombes.fr'
  const fullUrl = `${SITE_URL}${url}`

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      {keywords && <meta name='keywords' content={keywords} />}
      <meta name='author' content={author} />
      <meta
        name='robots'
        content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, viewport-fit=cover'
      />

      {/* Open Graph Meta Tags */}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={fullUrl} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='Les Deux Colombes' />
      <meta property='og:locale' content='fr_FR' />
      {image && (
        <>
          <meta property='og:image' content={image} />
          <meta property='og:image:alt' content={imageAlt} />
          <meta property='og:image:width' content='1200' />
          <meta property='og:image:height' content='630' />
        </>
      )}

      {/* Twitter Meta Tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      {image && <meta name='twitter:image' content={image} />}
      <meta name='twitter:creator' content='@lesdeuxcolombes' />

      {/* Canonical Link */}
      <link rel='canonical' href={fullUrl} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type='application/ld+json'>{JSON.stringify(schema)}</script>
      )}

      {/* Additional SEO */}
      <meta name='theme-color' content='#C4A060' />
      <meta name='color-scheme' content='light' />
    </Helmet>
  )
}

export default Seo
