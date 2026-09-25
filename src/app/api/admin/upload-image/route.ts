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
    let imageIndex = 0;
    let originalMimeOrExt = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      customSku = (formData.get('sku') as string | null) || '';
      const idxStr = formData.get('index') || formData.get('imageIndex');
      if (idxStr !== null && idxStr !== undefined) {
        imageIndex = parseInt(idxStr.toString(), 10) || 0;
      }

      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
      }

      originalMimeOrExt = file.type || file.name;
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (contentType.includes('application/json')) {
      const json = await req.json();
      const base64Data = json.image || json.base64 || '';
      customSku = json.sku || '';
      imageIndex = Number(json.index || json.imageIndex) || 0;

      if (!base64Data) {
        return NextResponse.json({ error: 'No base64 image data provided' }, { status: 400 });
      }

      // Detect format from data URI if present (e.g. data:image/png;base64,...)
      const mimeMatch = base64Data.match(/^data:(image\/\w+);base64,/);
      if (mimeMatch) {
        originalMimeOrExt = mimeMatch[1];
      }

      const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '').trim();
      buffer = Buffer.from(cleanedBase64, 'base64');
    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type. Use multipart/form-data or application/json' }, { status: 400 });
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty image buffer' }, { status: 400 });
    }

    // Determine target format & extension (.png, .webp, or .jpeg)
    const lowerType = originalMimeOrExt.toLowerCase();
    let ext = 'jpeg';
    let outputBuffer: Buffer;

    try {
      if (lowerType.includes('png')) {
        ext = 'png';
        outputBuffer = await sharp(buffer).png({ compressionLevel: 8 }).toBuffer();
      } else if (lowerType.includes('webp')) {
        ext = 'webp';
        outputBuffer = await sharp(buffer).webp({ quality: 90 }).toBuffer();
      } else {
        ext = 'jpeg';
        outputBuffer = await sharp(buffer).jpeg({ quality: 90, force: true }).toBuffer();
      }
    } catch (sharpErr) {
      // Fallback to JPEG if specific format conversion fails
      ext = 'jpeg';
      outputBuffer = await sharp(buffer).jpeg({ quality: 90, force: true }).toBuffer();
    }

    // Generate SKU-based filename: product-142.png (primary) or product-142-2.png, product-142-3.png (gallery)
    let cleanFilename = '';
    const skuNumMatch = customSku.match(/(\d+)/);
    const skuNum = skuNumMatch && skuNumMatch[1] ? skuNumMatch[1].padStart(3, '0') : null;

    if (skuNum) {
      if (imageIndex === 0) {
        cleanFilename = `product-${skuNum}.${ext}`;
      } else {
        cleanFilename = `product-${skuNum}-${imageIndex + 1}.${ext}`;
      }
    } else {
      const cleanSku = customSku ? customSku.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'uploaded';
      const suffix = imageIndex === 0 ? '' : `-${imageIndex + 1}`;
      const ts = Date.now().toString().slice(-4);
      cleanFilename = `product-${cleanSku}${suffix}-${ts}.${ext}`;
    }

    // 1. Try local filesystem save for instant dev environment availability
    try {
      const catalogDir = path.join(process.cwd(), 'public', 'catalog');
      if (!fs.existsSync(catalogDir)) {
        fs.mkdirSync(catalogDir, { recursive: true });
      }
      fs.writeFileSync(path.join(catalogDir, cleanFilename), outputBuffer);
    } catch (fsErr) {
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
      const base64Content = outputBuffer.toString('base64');

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
    const rawUrl = `https://raw.githubusercontent.com/${githubRepo}/main/public/catalog/${cleanFilename}`;

    if (!githubCommitted && !process.env.GITHUB_PAT) {
      return NextResponse.json({
        error: `GitHub upload failed: GITHUB_PAT environment variable is missing.`
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
      rawUrl: rawUrl,
      filename: cleanFilename,
      githubCommitted,
      sizeBytes: outputBuffer.length
    });

  } catch (error: any) {
    console.error('Upload Route Unhandled Error:', error);
    return NextResponse.json({ error: error?.message || 'Server upload failed' }, { status: 500 });
  }
}
