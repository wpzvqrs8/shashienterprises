import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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
      const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(cleanedBase64, 'base64');
    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
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
      return NextResponse.json({ error: 'Failed to process and convert image to JPEG format' }, { status: 400 });
    }

    // Determine target catalog directory: public/catalog
    const catalogDir = path.join(process.cwd(), 'public', 'catalog');
    if (!fs.existsSync(catalogDir)) {
      fs.mkdirSync(catalogDir, { recursive: true });
    }

    // Format clean filename: product-XXX.jpeg
    let skuNumber = '';
    if (customSku) {
      const numMatch = customSku.match(/(\d+)/);
      if (numMatch) {
        skuNumber = numMatch[1].padStart(3, '0');
      }
    }

    let cleanFilename = '';
    if (skuNumber) {
      const baseName = `product-${skuNumber}${isGallery ? '-gallery' : ''}`;
      // Check if file exists, add timestamp suffix if needed to avoid overwriting distinct images
      const targetPath = path.join(catalogDir, `${baseName}.jpeg`);
      if (fs.existsSync(targetPath) && isGallery) {
        cleanFilename = `${baseName}-${Date.now().toString().slice(-4)}.jpeg`;
      } else {
        cleanFilename = `${baseName}.jpeg`;
      }
    } else {
      // Find highest existing product-XXX number in public/catalog
      const existingFiles = fs.readdirSync(catalogDir);
      let highestNum = 0;
      for (const f of existingFiles) {
        const match = f.match(/^product-(\d+)/i);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > highestNum) highestNum = num;
        }
      }
      const nextNum = (highestNum + 1).toString().padStart(3, '0');
      cleanFilename = `product-${nextNum}.jpeg`;
    }

    // 1. Save locally to public/catalog for instant availability in local development
    const localFilePath = path.join(catalogDir, cleanFilename);
    fs.writeFileSync(localFilePath, jpegBuffer);

    // 2. Commit file to GitHub Repository via GitHub Contents REST API
    const githubPat = process.env.GITHUB_PAT;
    const githubRepo = process.env.GITHUB_REPO || 'wpzvqrs8/shashienterprises';
    let githubCommitted = false;

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
        const errText = await putRes.text();
        console.error('❌ GitHub API Upload Error:', errText);
      }
    } else {
      console.warn('⚠️ GITHUB_PAT not found in environment. File saved locally only.');
    }

    const publicUrl = `/catalog/${cleanFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: cleanFilename,
      githubCommitted,
      sizeBytes: jpegBuffer.length
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error?.message || 'Server upload failed' }, { status: 500 });
  }
}
