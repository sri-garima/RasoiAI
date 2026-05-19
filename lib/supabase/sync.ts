import { createClient } from "./client";
import { loadProfile, saveProfile } from "@/lib/profile/storage";
import { loadPantry, savePantry } from "@/lib/pantry/storage";
import { loadLastDailyPlan, loadLastWeeklyPlan, saveLastDailyPlan, saveLastWeeklyPlan } from "@/lib/plan/storage";

export async function syncDataWithCloud() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return; // Not logged in
  
  const userId = session.user.id;

  try {
    // 1. Sync Profile
    const { data: cloudProfile } = await supabase
      .from('profiles')
      .select('data')
      .eq('user_id', userId)
      .single();

    const localProfile = loadProfile();

    if (cloudProfile?.data) {
      // Cloud wins
      saveProfile(cloudProfile.data);
    } else {
      // Push local to cloud
      if (localProfile.name) {
        await supabase.from('profiles').upsert({ user_id: userId, data: localProfile });
      }
    }

    // 2. Sync Pantry
    const { data: cloudPantry } = await supabase
      .from('pantries')
      .select('data')
      .eq('user_id', userId)
      .single();
      
    const localPantry = loadPantry();

    if (cloudPantry?.data && cloudPantry.data.length > 0) {
      savePantry(cloudPantry.data);
    } else if (localPantry.length > 0) {
      await supabase.from('pantries').upsert({ user_id: userId, data: localPantry });
    }

    // 3. Sync Daily Plan
    const { data: cloudDaily } = await supabase
      .from('daily_plans')
      .select('data')
      .eq('user_id', userId)
      .single();
      
    const localDaily = loadLastDailyPlan();

    if (cloudDaily?.data) {
      saveLastDailyPlan(cloudDaily.data);
    } else if (localDaily) {
      await supabase.from('daily_plans').upsert({ user_id: userId, data: localDaily });
    }

    // 4. Sync Weekly Plan
    const { data: cloudWeekly } = await supabase
      .from('weekly_plans')
      .select('data')
      .eq('user_id', userId)
      .single();
      
    const localWeekly = loadLastWeeklyPlan();

    if (cloudWeekly?.data) {
      saveLastWeeklyPlan(cloudWeekly.data);
    } else if (localWeekly) {
      await supabase.from('weekly_plans').upsert({ user_id: userId, data: localWeekly });
    }
  } catch (err) {
    console.error("Error syncing data with cloud:", err);
  }
}

export async function pushProfileToCloud(data: any) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;
  await supabase.from('profiles').upsert({ user_id: session.user.id, data });
}

export async function pushPantryToCloud(data: any) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;
  await supabase.from('pantries').upsert({ user_id: session.user.id, data });
}

export async function pushDailyPlanToCloud(data: any) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;
  await supabase.from('daily_plans').upsert({ user_id: session.user.id, data });
}

export async function pushWeeklyPlanToCloud(data: any) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;
  await supabase.from('weekly_plans').upsert({ user_id: session.user.id, data });
}
