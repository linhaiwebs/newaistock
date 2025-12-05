import { supabaseAdmin } from '../db/supabaseAdmin.js';

export async function findSessionBySessionId(sessionId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_sessions')
    .select('id')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('Session lookup error:', error);
    throw error;
  }

  return data;
}

export interface SessionWithDetails {
  id: number;
  session_id: string;
  events: any[];
  diagnoses: any[];
}

export async function getSessionsWithRelatedData(sessionIds: number[]) {
  if (sessionIds.length === 0) {
    return {
      eventsBySession: new Map<number, any[]>(),
      diagnosesBySession: new Map<number, any[]>()
    };
  }

  const [eventsResult, diagnosesResult] = await Promise.all([
    supabaseAdmin
      .from('user_events')
      .select('*')
      .in('session_id', sessionIds)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('stock_diagnoses')
      .select('*')
      .in('session_id', sessionIds)
  ]);

  const eventsBySession = new Map<number, any[]>();
  const diagnosesBySession = new Map<number, any[]>();

  (eventsResult.data || []).forEach(event => {
    if (!eventsBySession.has(event.session_id)) {
      eventsBySession.set(event.session_id, []);
    }
    eventsBySession.get(event.session_id)!.push(event);
  });

  (diagnosesResult.data || []).forEach(diagnosis => {
    if (!diagnosesBySession.has(diagnosis.session_id)) {
      diagnosesBySession.set(diagnosis.session_id, []);
    }
    diagnosesBySession.get(diagnosis.session_id)!.push(diagnosis);
  });

  return { eventsBySession, diagnosesBySession };
}
