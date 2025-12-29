-- Tabela user_profiles dla profili użytkowników z wizją idealnego życia
-- Uruchom ten SQL w Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT DEFAULT '',
  about_me TEXT DEFAULT '',
  ideal_life_10y TEXT DEFAULT '',
  ideal_life_20y TEXT DEFAULT '',
  ideal_life_30y TEXT DEFAULT '',
  long_term_goal TEXT DEFAULT '',
  important_things TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Włącz RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Polityka: użytkownicy mogą widzieć tylko swój profil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Polityka: użytkownicy mogą tworzyć swój profil
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Polityka: użytkownicy mogą aktualizować swój profil
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Indeks na user_id dla szybszego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
