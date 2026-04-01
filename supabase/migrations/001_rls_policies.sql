-- ============================================================
-- Fase 8: Row Level Security (RLS) — SynqoTap
-- Aplicar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- Helper: is_admin()
-- Comprueba si el usuario autenticado es el administrador.
-- SECURITY DEFINER para que pueda leer auth.email() de forma segura.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.email() = 'synqotap@gmail.com';
$$;


-- ============================================================
-- TABLA: customers
-- ============================================================
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Un usuario solo ve su propio registro; el admin ve todos.
CREATE POLICY "customers_select"
  ON public.customers FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- Un usuario solo edita su propio registro; el admin edita todos.
CREATE POLICY "customers_update"
  ON public.customers FOR UPDATE
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- INSERT y DELETE solo desde service_role (webhook de Stripe).
-- No se crean políticas para estas operaciones → bloqueadas para anon/authenticated.
-- El service_role key bypasses RLS por diseño.


-- ============================================================
-- TABLA: profiles
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: perfil propio, perfiles publicados (público), o admin.
CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  USING (
    is_published = true
    OR customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- UPDATE: solo el dueño o el admin.
CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE
  USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- INSERT y DELETE solo desde service_role (webhook de Stripe).


-- ============================================================
-- TABLA: profile_buttons
-- ============================================================
ALTER TABLE public.profile_buttons ENABLE ROW LEVEL SECURITY;

-- SELECT: botones propios, botones de perfiles publicados, o admin.
CREATE POLICY "profile_buttons_select"
  ON public.profile_buttons FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE is_published = true
    )
    OR profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- INSERT: solo el dueño del perfil o el admin.
CREATE POLICY "profile_buttons_insert"
  ON public.profile_buttons FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- UPDATE: solo el dueño del perfil o el admin.
CREATE POLICY "profile_buttons_update"
  ON public.profile_buttons FOR UPDATE
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- DELETE: solo el dueño del perfil o el admin.
CREATE POLICY "profile_buttons_delete"
  ON public.profile_buttons FOR DELETE
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );


-- ============================================================
-- TABLA: orders
-- ============================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- SELECT: pedidos propios o admin.
CREATE POLICY "orders_select"
  ON public.orders FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- UPDATE: solo el admin (cambios de estado, gestión interna).
CREATE POLICY "orders_update"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- INSERT y DELETE solo desde service_role (webhook de Stripe).


-- ============================================================
-- TABLA: cards
-- ============================================================
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- SELECT: tarjetas vinculadas al perfil propio o admin.
CREATE POLICY "cards_select"
  ON public.cards FOR SELECT
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- UPDATE: solo el admin (programación NFC, estado físico).
CREATE POLICY "cards_update"
  ON public.cards FOR UPDATE
  USING (public.is_admin());

-- INSERT y DELETE solo desde service_role (webhook de Stripe).


-- ============================================================
-- TABLA: shipments
-- ============================================================
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- SELECT: envíos de pedidos propios o admin.
CREATE POLICY "shipments_select"
  ON public.shipments FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM public.orders o
      JOIN public.customers c ON c.id = o.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- INSERT: solo el admin (crea tracking desde el panel).
CREATE POLICY "shipments_insert"
  ON public.shipments FOR INSERT
  WITH CHECK (public.is_admin());

-- UPDATE: solo el admin.
CREATE POLICY "shipments_update"
  ON public.shipments FOR UPDATE
  USING (public.is_admin());

-- DELETE: solo desde service_role.


-- ============================================================
-- FUNCIÓN: increment_view
-- Incrementa view_count en profiles para perfiles publicados.
-- Ya usa SECURITY DEFINER, lo que le permite actualizar aunque RLS
-- bloquee el UPDATE directo para anon.
-- Nos aseguramos de que anon pueda ejecutarla vía RPC.
-- ============================================================
GRANT EXECUTE ON FUNCTION public.increment_view(text) TO anon, authenticated;
