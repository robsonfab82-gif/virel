import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/pt-BR/dashboard";

  if (code) {
    // In production: exchange code for session with Supabase
    // const supabase = createServerClient();
    // await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  return NextResponse.redirect(new URL("/pt-BR/login?error=auth_failed", requestUrl.origin));
}
