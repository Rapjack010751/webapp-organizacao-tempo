import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.exchangeCodeForSession(code);

    // Verificar se usuário tem perfil
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Se tem perfil com nome, vai para dashboard, senão vai para onboarding
      if (profile && profile.name) {
        return NextResponse.redirect(new URL('/', requestUrl.origin));
      } else {
        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
      }
    }
  }

  // Fallback para onboarding
  return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
}
