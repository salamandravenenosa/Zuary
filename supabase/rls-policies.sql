-- ==========================================
-- RLS (Row Level Security) — Supabase
-- Isolamento multi-tenant completo
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Clinic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OAuthToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Integration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MetricSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Goal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "APIUsageLog" ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLÍTICAS POR TABELA
-- ==========================================

-- USER: Usuários só veem seus próprios dados
CREATE POLICY "users_select_own" ON "User"
  FOR SELECT USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "users_update_own" ON "User"
  FOR UPDATE USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

-- SESSION: Sessões do próprio usuário
CREATE POLICY "sessions_select_own" ON "Session"
  FOR SELECT USING (userId = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "sessions_delete_own" ON "Session"
  FOR DELETE USING (userId = current_setting('request.jwt.claims', true)::json->>'sub');

-- CLINIC: Usuários veem sua própria clínica
CREATE POLICY "clinics_select_own" ON "Clinic"
  FOR SELECT USING (
    id IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "clinics_update_own" ON "Clinic"
  FOR UPDATE USING (
    id IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- OAUTH TOKEN: Tokens da própria clínica
CREATE POLICY "oauth_tokens_select_own" ON "OAuthToken"
  FOR SELECT USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "oauth_tokens_insert_own" ON "OAuthToken"
  FOR INSERT WITH CHECK (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "oauth_tokens_update_own" ON "OAuthToken"
  FOR UPDATE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "oauth_tokens_delete_own" ON "OAuthToken"
  FOR DELETE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- INTEGRAÇÃO: Integrações da própria clínica
CREATE POLICY "integrations_select_own" ON "Integration"
  FOR SELECT USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "integrations_insert_own" ON "Integration"
  FOR INSERT WITH CHECK (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "integrations_update_own" ON "Integration"
  FOR UPDATE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "integrations_delete_own" ON "Integration"
  FOR DELETE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- METRIC SNAPSHOT: Métricas da própria clínica
CREATE POLICY "metrics_select_own" ON "MetricSnapshot"
  FOR SELECT USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "metrics_insert_own" ON "MetricSnapshot"
  FOR INSERT WITH CHECK (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "metrics_update_own" ON "MetricSnapshot"
  FOR UPDATE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- GOAL: Metas da própria clínica
CREATE POLICY "goals_select_own" ON "Goal"
  FOR SELECT USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "goals_insert_own" ON "Goal"
  FOR INSERT WITH CHECK (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "goals_update_own" ON "Goal"
  FOR UPDATE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "goals_delete_own" ON "Goal"
  FOR DELETE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- NOTIFICATION: Notificações da própria clínica
CREATE POLICY "notifications_select_own" ON "Notification"
  FOR SELECT USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "notifications_insert_own" ON "Notification"
  FOR INSERT WITH CHECK (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "notifications_update_own" ON "Notification"
  FOR UPDATE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "notifications_delete_own" ON "Notification"
  FOR DELETE USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- REPORT: Relatórios da própria clínica
CREATE POLICY "reports_select_own" ON "Report"
  FOR SELECT USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "reports_insert_own" ON "Report"
  FOR INSERT WITH CHECK (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- AUDIT LOG: Logs da própria clínica (somente leitura)
CREATE POLICY "audit_select_own" ON "AuditLog"
  FOR SELECT USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- API USAGE LOG: Logs da própria clínica
CREATE POLICY "api_usage_select_own" ON "APIUsageLog"
  FOR SELECT USING (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "api_usage_insert_own" ON "APIUsageLog"
  FOR INSERT WITH CHECK (
    "clinicId" IN (
      SELECT "clinicId" FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- ==========================================
-- POLÍTICA ADMIN: Admins veem TUDO
-- ==========================================
CREATE POLICY "admin_full_access_user" ON "User"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_clinic" ON "Clinic"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_integration" ON "Integration"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_oauth" ON "OAuthToken"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_metrics" ON "MetricSnapshot"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_goals" ON "Goal"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_notifications" ON "Notification"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_reports" ON "Report"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_audit" ON "AuditLog"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_api_usage" ON "APIUsageLog"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );

CREATE POLICY "admin_full_access_session" ON "Session"
  FOR ALL USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' AND role = 'ADMIN')
  );
