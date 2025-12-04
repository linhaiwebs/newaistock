# Supabase Configuration Issue Found

## Problem

The `.env` file contains mismatched Supabase credentials:

- `VITE_SUPABASE_URL` points to project: `obzkrqksufcnkpypqxxp`
- `SUPABASE_SERVICE_ROLE_KEY` is for project: `yfudpfzfhraalczufhbb` ❌

This mismatch causes the admin login to fail because the server cannot access the correct database.

## What Was Done

✅ Database migrations applied successfully
✅ Analytics config table with nullable `updated_by` field created
✅ Admin user `asdsadmin` created with password `Mm123567..`
✅ RLS policies verified and correctly configured
✅ Project built successfully
✅ Password hash verified working

## What Needs to Be Fixed

You need to update the `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file with the correct service role key for project `obzkrqksufcnkpypqxxp`.

### How to Get the Correct Service Role Key

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `obzkrqksufcnkpypqxxp`
3. Go to Project Settings > API
4. Under "Project API keys", find the `service_role` key (keep this secret!)
5. Copy the `service_role` key

### Update .env File

Replace line 9 in `.env`:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmdWRwZnpmaHJhYWxjenVmaGJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDc0NzM5MiwiZXhwIjoyMDgwMzIzMzkyfQ.Moz-1s3diSeBgAQIA8988_jZ502btiU2__fJOhi6UMM
```

With:

```
SUPABASE_SERVICE_ROLE_KEY=<your-correct-service-role-key-here>
```

## After Fixing

Once the correct key is in place, the following will work:

1. Admin login at `/admin/login` with:
   - Username: `asdsadmin`
   - Password: `Mm123567..`

2. Google Analytics configuration can be saved in the Analytics page

3. All admin features will function properly

## Testing

After updating the `.env` file, you can test with:

```bash
npm run build
npm start

# In another terminal:
node test-analytics-login.js
```

This will verify that login and analytics config save are working correctly.
