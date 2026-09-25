import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    let buffer: Buffer | null = null;
    let customSku = '';
    let isGallery = false;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      customSku = (formData.get('sku') as string | null) || '';
      isGallery = formData.get('isGallery') === 'true';

      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (contentType.includes('application/json')) {
      const json = await req.json();
      const base64Data = json.image || json.base64 || '';
      customSku = json.sku || '';
      isGallery = json.isGallery === true;

      if (!base64Data) {
        return NextResponse.json({ error: 'No base64 image data provided' }, { status: 400 });
      }

      // Strip data URI prefix if present (e.g. data:image/png;base64,...)
      const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '').trim();
      buffer = Buffer.from(cleanedBase64, 'base64');
    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type. Use multipart/form-data or application/json' }, { status: 400 });
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty image buffer' }, { status: 400 });
    }

    // Convert ANY image format (PNG, WEBP, GIF, JPEG, Base64) to JPEG using sharp
    let jpegBuffer: Buffer;
    try {
      jpegBuffer = await sharp(buffer)
        .jpeg({ quality: 90, force: true })
        .toBuffer();
    } catch (sharpError: any) {
      console.error('Sharp JPEG Conversion Error:', sharpError);
      return NextResponse.json({ error: `Image conversion failed: ${sharpError?.message || 'Invalid image format'}` }, { status: 400 });
    }

    // Generate clean filename: product-XXX.jpeg
    const timestamp = Date.now().toString().slice(-6);
    let cleanFilename = '';

    if (customSku) {
      const numMatch = customSku.match(/(\d+)/);
      if (numMatch && numMatch[1]) {
        const skuNum = numMatch[1].padStart(3, '0');
        cleanFilename = isGallery ? `product-${skuNum}-gal-${timestamp}.jpeg` : `product-${skuNum}.jpeg`;
      } else {
        const cleanSku = customSku.toLowerCase().replace(/[^a-z0-9]/g, '-');
        cleanFilename = `product-${cleanSku}-${timestamp}.jpeg`;
      }
    } else {
      cleanFilename = `product-${timestamp}.jpeg`;
    }

    // 1. Try local filesystem save (works in local dev, safe fallback on Vercel)
    try {
      const catalogDir = path.join(process.cwd(), 'public', 'catalog');
      if (!fs.existsSync(catalogDir)) {
        fs.mkdirSync(catalogDir, { recursive: true });
      }
      fs.writeFileSync(path.join(catalogDir, cleanFilename), jpegBuffer);
    } catch (fsErr) {
      // Expected on Vercel serverless (read-only filesystem)
      console.warn('Local FS write skipped (serverless mode):', fsErr);
    }

    // 2. Commit file to GitHub Repository via GitHub Contents REST API
    const githubPat = process.env.GITHUB_PAT;
    const githubRepo = process.env.GITHUB_REPO || 'wpzvqrs8/shashienterprises';
    let githubCommitted = false;
    let githubErrorDetail = '';

    if (githubPat) {
      const gitHubFilePath = `public/catalog/${cleanFilename}`;
      const gitHubApiUrl = `https://api.github.com/repos/${githubRepo}/contents/${gitHubFilePath}`;
      const base64Content = jpegBuffer.toString('base64');

      // Check if file already exists to obtain SHA for overwrite
      let sha: string | undefined = undefined;
      try {
        const getRes = await fetch(gitHubApiUrl, {
          headers: {
            Authorization: `Bearer ${githubPat}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'ShashiEnterprises-CatalogUpload'
          }
        });
        if (getRes.ok) {
          const getJson = await getRes.json();
          sha = getJson.sha;
        }
      } catch (err) {
        console.warn('GitHub SHA Lookup warning:', err);
      }

      // Commit to GitHub (Triggers automatic Vercel deployment)
      const putRes = await fetch(gitHubApiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubPat}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ShashiEnterprises-CatalogUpload'
        },
        body: JSON.stringify({
          message: `admin: add catalog image ${cleanFilename}`,
          content: base64Content,
          branch: 'main',
          ...(sha ? { sha } : {})
        })
      });

      if (putRes.ok) {
        githubCommitted = true;
        console.log(`✅ Successfully committed public/catalog/${cleanFilename} to GitHub (${githubRepo}). Vercel deployment triggered.`);
      } else {
        githubErrorDetail = await putRes.text();
        console.error('❌ GitHub API Upload Error:', githubErrorDetail);
      }
    } else {
      githubErrorDetail = 'GITHUB_PAT environment variable is not configured on Vercel.';
      console.warn('⚠️ GITHUB_PAT not found in environment variables.');
    }

    const publicUrl = `/catalog/${cleanFilename}`;

    if (!githubCommitted && !process.env.GITHUB_PAT) {
      return NextResponse.json({
        error: `GitHub upload failed: GITHUB_PAT is missing in environment variables.`
      }, { status: 500 });
    }

    if (!githubCommitted && githubErrorDetail) {
      return NextResponse.json({
        error: `GitHub API error: ${githubErrorDetail}`
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: cleanFilename,
      githubCommitted,
      sizeBytes: jpegBuffer.length
    });

  } catch (error: any) {
    console.error('Upload Route Unhandled Error:', error);
    return NextResponse.json({ error: error?.message || 'Server upload failed' }, { status: 500 });
  }
}
