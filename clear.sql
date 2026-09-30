BEGIN;

TRUNCATE TABLE
  public.portfolio_uploads,
  public.portfolio_chats,
  public.portfolio_sessions,
  public.portfolio_limits;

COMMIT;