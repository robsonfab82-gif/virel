import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/instagram
 * Redireciona para a URL de autorização do Instagram Business (Facebook Login for Business).
 * Usa www.facebook.com/dialog/oauth — NÃO api.instagram.com (descontinuado).
 * Quando INSTAGRAM_APP_ID não estiver configurado, retorna 503 com instruções.
 */
export async function GET(request: NextRequest) {
  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri =
    process.env.INSTAGRAM_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/instagram/callback`;

  if (!appId || appId === "seu_app_id_aqui") {
    return NextResponse.json(
      {
        error: "instagram_not_configured",
        message:
          "INSTAGRAM_APP_ID não configurado. Adicione as credenciais do Meta no .env.local para ativar o OAuth.",
      },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: "public_profile,email",
    response_type: "code",
  });

  // Facebook Login for Business (Instagram Business Login)
  const authUrl = `https://www.facebook.com/dialog/oauth?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
