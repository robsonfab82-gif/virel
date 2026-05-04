import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Create user with service role (bypasses email confirmation)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    return NextResponse.json({ user: userData.user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
