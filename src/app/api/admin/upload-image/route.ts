import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const customSku = (formData.get('sku') as string | null) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file format (PNG, JPG, JPEG, WEBP)
    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();
    const isValidFormat =
      mimeType.startsWith('image/jpeg') ||
      mimeType.startsWith('image/png') ||
      mimeType.startsWith('image/webp') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.webp');

    if (!isValidFormat) {
      return NextResponse.json({ error: 'Invalid file type. Only PNG, JPG, JPEG, and WEBP allowed.' }, { status: 400 });
    }

    const extension = fileName.endsWith('.png')
      ? 'png'
      : fileName.endsWith('.webp')
      ? 'webp'
      : 'jpeg';

    // Generate clean filename
    const timestamp = Date.now();
    let cleanFilename = '';
    if (customSku) {
      const numMatch = customSku.match(/(\d+)/);
      if (numMatch) {
        cleanFilename = `product-${numMatch[1].padStart(3, '0')}-${timestamp.toString().slice(-4)}.${extension}`;
      } else {
        cleanFilename = `${customSku.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp.toString().slice(-4)}.${extension}`;
      }
    } else {
      cleanFilename = `product-uploaded-${timestamp}.${extension}`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Content = buffer.toString('base64');

    // 1. Save locally to public/catalog for immediate local dev availability
    const catalogDir = path.join(process.cwd(), 'public', 'catalog');
    if (!fs.existsSync(catalogDir)) {
      fs.mkdirSync(catalogDir, { recursive: true });
    }
    const localFilePath = path.join(catalogDir, cleanFilename);
    fs.writeFileSync(localFilePath, buffer);

    // 2. Commit to GitHub Repository via GitHub Contents API
    const githubPat = process.env.GITHUB_PAT;
    const githubRepo = process.env.GITHUB_REPO || 'wpzvqrs8/shashienterprises';

    let githubCommitted = false;

    if (githubPat) {
      const gitHubFilePath = `public/catalog/${cleanFilename}`;
      const gitHubApiUrl = `https://api.github.com/repos/${githubRepo}/contents/${gitHubFilePath}`;

      // Check if file already exists to get its sha (for overwrite)
      let sha: string | undefined = undefined;
      try {
        const getRes = await fetch(gitHubApiUrl, {
          headers: {
            Authorization: `Bearer ${githubPat}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'ShashiEnterprises-AdminUpload'
          }
        });
        if (getRes.ok) {
          const getJson = await getRes.json();
          sha = getJson.sha;
        }
      } catch (err) {
        console.warn('File SHA lookup warning:', err);
      }

      // Upload file to GitHub
      const putRes = await fetch(gitHubApiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubPat}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ShashiEnterprises-AdminUpload'
        },
        body: JSON.stringify({
          message: `admin: upload catalog asset ${cleanFilename}`,
          content: base64Content,
          branch: 'main',
          ...(sha ? { sha } : {})
        })
      });

      if (putRes.ok) {
        githubCommitted = true;
        console.log(`Successfully committed public/catalog/${cleanFilename} to GitHub repo ${githubRepo}`);
      } else {
        const errText = await putRes.text();
        console.error('GitHub API Upload Error:', errText);
      }
    } else {
      console.warn('GITHUB_PAT not found in environment variables. File saved locally only.');
    }

    const publicUrl = `/catalog/${cleanFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: cleanFilename,
      githubCommitted,
      sizeBytes: buffer.length
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error?.message || 'Server upload failed' }, { status: 500 });
  }
}
