-- =====================================================
-- KWARTAL APP - SETUP BAZY DANYCH SUPABASE
-- Uruchom ten SQL w: Supabase Dashboard -> SQL Editor
-- =====================================================

-- 1. TABELA: user_profiles (profile użytkowników)
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

-- RLS dla user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);


-- 2. TABELA: quarterly_plans (plany kwartalne)
CREATE TABLE IF NOT EXISTS quarterly_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  year INTEGER NOT NULL,
  plan_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Jeden plan na kwartał na użytkownika
  UNIQUE(user_id, quarter, year)
);

-- RLS dla quarterly_plans
ALTER TABLE quarterly_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans" ON quarterly_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON quarterly_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON quarterly_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON quarterly_plans
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_quarterly_plans_user_id ON quarterly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_quarterly_plans_quarter_year ON quarterly_plans(quarter, year);


-- =====================================================
-- GOTOWE! Tabele i polityki RLS zostały utworzone.
-- =====================================================
