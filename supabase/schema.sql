-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for watchlists
create table watchlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  anime_id text not null, -- Storing the anime ID (from our CSV/API)
  status text check (status in ('plan_to_watch', 'watching', 'completed', 'dropped')) default 'plan_to_watch',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id, anime_id) -- Prevent duplicate entries for the same anime
);

-- Set up RLS for watchlists
alter table watchlists enable row level security;

create policy "Users can view their own watchlist."
  on watchlists for select
  using ( auth.uid() = user_id );

create policy "Users can insert into their own watchlist."
  on watchlists for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own watchlist."
  on watchlists for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own watchlist items."
  on watchlists for delete
  using ( auth.uid() = user_id );

-- Function to handle new user signup (automatically create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
