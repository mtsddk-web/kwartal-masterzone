import type { QuarterlyPlan } from '@/types/plan';

export interface DbQuarterlyPlan {
  id: string;
  user_id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  plan_data: QuarterlyPlan;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      quarterly_plans: {
        Row: DbQuarterlyPlan;
        Insert: Omit<DbQuarterlyPlan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbQuarterlyPlan, 'id' | 'user_id'>>;
      };
    };
  };
}
