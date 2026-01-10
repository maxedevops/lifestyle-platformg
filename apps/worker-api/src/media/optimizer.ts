export async function handleImageRequest(request: Request, env: Bindings) {
  const url = new URL(request.url);
  const imageKey = url.pathname.split('/media/')[1];
  
  // 1. Fetch from R2
  const object = await env.R2_BUCKET.get(imageKey);
  if (!object) return new Response('Not Found', { status: 404 });

  // 2. Check for transformation parameters (e.g., ?width=400)
  const options = {
    width: parseInt(url.searchParams.get('w') || '800'),
    quality: 85,
    format: 'webp',
  };

  // 3. Return optimized response using Cloudflare's built-in image resizing
  // Note: This requires the "Image Resizing" feature enabled in the CF Dashboard
  return new Response(object.body, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=604800, immutable',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}