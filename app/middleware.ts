import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Since we're using localStorage for tokens (client-side only),
  // the actual authentication check is handled by the ProtectedRoute component
  // This middleware can be used for other purposes like logging, headers, etc.

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
