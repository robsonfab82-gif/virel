import { NextRequest, NextResponse } from "next/server";

export interface InstagramProfile {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
  name?: string;
  biography?: string;
  profile_picture_url?: string;
  website?: string;
  followers_count?: number;
}

/**
 * GET /api/auth/instagram/callback
 * Recebe o `code` do Facebook OAuth (Instagram Business Login),
 * troca por user access_token via graph.facebook.com,
 * depois busca páginas e token do Instagram Business Account.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const locale = searchParams.get("state") ?? "pt-BR";

  const dashboardUrl = `/${locale}/dashboard/brand`;

  // User denied access or error from Facebook/Instagram
  if (errorParam) {
    return NextResponse.redirect(
      new URL(
        `${dashboardUrl}?instagram_error=${encodeURIComponent(errorParam)}`,
        origin
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`${dashboardUrl}?instagram_error=no_code`, origin)
    );
  }

  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri =
    process.env.INSTAGRAM_REDIRECT_URI ||
    `${origin}/api/auth/instagram/callback`;

  if (!appId || !appSecret || appId === "seu_app_id_aqui") {
    return NextResponse.redirect(
      new URL(
        `${dashboardUrl}?instagram_error=not_configured`,
        origin
      )
    );
  }

  try {
    // 1. Trocar code por user access_token via Graph API (Facebook Login for Business)
    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?${tokenParams.toString()}`
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Facebook/Instagram token exchange failed:", err);
      return NextResponse.redirect(
        new URL(`${dashboardUrl}?instagram_error=token_exchange_failed`, origin)
      );
    }

    const tokenData: { access_token: string; token_type: string } =
      await tokenRes.json();
    const userAccessToken = tokenData.access_token;

    // 2. Buscar páginas do Facebook vinculadas ao usuário
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${userAccessToken}`
    );

    if (!pagesRes.ok) {
      const err = await pagesRes.text();
      console.error("Facebook pages fetch failed:", err);
      return NextResponse.redirect(
        new URL(`${dashboardUrl}?instagram_error=pages_fetch_failed`, origin)
      );
    }

    const pagesData: {
      data: Array<{ id: string; access_token: string; name: string }>;
    } = await pagesRes.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(
        new URL(`${dashboardUrl}?instagram_error=no_pages_found`, origin)
      );
    }

    // Usa a primeira página encontrada
    const page = pagesData.data[0];
    const pageAccessToken = page.access_token;

    // 3. Buscar conta do Instagram Business vinculada à página
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );

    if (!igAccountRes.ok) {
      const err = await igAccountRes.text();
      console.error("Instagram Business Account fetch failed:", err);
      return NextResponse.redirect(
        new URL(
          `${dashboardUrl}?instagram_error=ig_account_fetch_failed`,
          origin
        )
      );
    }

    const igAccountData: {
      instagram_business_account?: { id: string };
      id: string;
    } = await igAccountRes.json();

    const igAccountId = igAccountData.instagram_business_account?.id;

    if (!igAccountId) {
      return NextResponse.redirect(
        new URL(
          `${dashboardUrl}?instagram_error=no_instagram_business_account`,
          origin
        )
      );
    }

    // 4. Buscar dados do perfil do Instagram Business
    const profileFields =
      "id,username,account_type,media_count,name,biography,profile_picture_url,website,followers_count";
    const profileRes = await fetch(
      `https://graph.facebook.com/v21.0/${igAccountId}?fields=${profileFields}&access_token=${pageAccessToken}`
    );

    if (!profileRes.ok) {
      const err = await profileRes.text();
      console.error("Instagram profile fetch failed:", err);
      return NextResponse.redirect(
        new URL(`${dashboardUrl}?instagram_error=profile_fetch_failed`, origin)
      );
    }

    const profile: InstagramProfile = await profileRes.json();

    // 5. Redirecionar de volta com os dados do perfil para o frontend preencher
    const successParams = new URLSearchParams({
      instagram_connected: "1",
      ig_username: profile.username ?? "",
      ig_name: profile.name ?? profile.username ?? "",
      ig_bio: profile.biography ?? "",
      ig_picture: profile.profile_picture_url ?? "",
      ig_media_count: String(profile.media_count ?? 0),
      ig_website: profile.website ?? "",
      ig_account_type: profile.account_type ?? "",
    });

    return NextResponse.redirect(
      new URL(`${dashboardUrl}?${successParams.toString()}`, origin)
    );
  } catch (err) {
    console.error("Instagram OAuth callback error:", err);
    return NextResponse.redirect(
      new URL(`${dashboardUrl}?instagram_error=unexpected`, origin)
    );
  }
}
