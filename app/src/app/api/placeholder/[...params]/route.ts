import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const resolvedParams = await params;
  const [width, height] = resolvedParams.params;
  
  // Sanitize and validate width and height parameters
  const safeWidth = Math.min(Math.max(parseInt(width) || 400, 1), 2000);
  const safeHeight = Math.min(Math.max(parseInt(height) || 400, 1), 2000);
  
  // Create a simple placeholder image using SVG
  const svg = `
    <svg width="${safeWidth}" height="${safeHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">
        Generated Image Placeholder
      </text>
      <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">
        ${safeWidth}x${safeHeight}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
