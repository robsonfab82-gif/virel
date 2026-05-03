-- VIREL Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  instagram_handle text,
  avatar_url text,
  plan_id uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =============================================
-- PLANS TABLE
-- =============================================
create table if not exists public.plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  price_brl integer not null,
  price_id_stripe text,
  features jsonb default '[]'::jsonb,
  is_highlighted boolean default false,
  is_active boolean default true,
  created_at timestamptz default now() not null
);

alter table public.plans enable row level security;

create policy "Plans are viewable by everyone"
  on public.plans for select
  using (true);

create policy "Only admins can manage plans"
  on public.plans for all
  using (auth.jwt() ->> 'role' = 'admin');

-- Seed default plans
insert into public.plans (name, slug, price_brl, features, is_highlighted) values
  ('Start', 'start', 4700, '["Score de perfil","5 ideias/dia","50 hashtags/mês","10 legendas/mês","Suporte email"]', false),
  ('Pro', 'pro', 9700, '["Tudo do Start","Ideias ilimitadas","Hashtags ilimitadas","50 legendas/mês","Análise concorrentes (3)","Planejador","Suporte prioritário"]', true),
  ('Ultra', 'ultra', 19700, '["Tudo do Pro","Legendas ilimitadas","Análise ilimitada","API de integração","Relatórios avançados","Gerente dedicado","White-label disponível"]', false)
on conflict (slug) do nothing;

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_id uuid references public.plans(id) not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text default 'trialing' check (status in ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now() not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- =============================================
-- FEEDBACK TABLE
-- =============================================
create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  category text not null,
  message text not null,
  admin_reply text,
  created_at timestamptz default now() not null
);

alter table public.feedback enable row level security;

create policy "Users can view own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

create policy "Users can insert own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text not null,
  target_type text not null check (target_type in ('all', 'plan_start', 'plan_pro', 'plan_ultra', 'trialing')),
  target_value text,
  sent_at timestamptz default now() not null,
  created_by uuid references auth.users not null
);

create table if not exists public.user_notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  notification_id uuid references public.notifications(id) on delete cascade not null,
  read_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, notification_id)
);

alter table public.user_notifications enable row level security;

create policy "Users can view own notifications"
  on public.user_notifications for select
  using (auth.uid() = user_id);

create policy "Users can mark notifications as read"
  on public.user_notifications for update
  using (auth.uid() = user_id);

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- UPDATE updated_at TRIGGER
-- =============================================
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure update_updated_at();
