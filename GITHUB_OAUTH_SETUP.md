# GitHub OAuth Setup with Supabase

Follow these steps to properly configure GitHub OAuth via Supabase for your application, following [GitHub's official documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps).

## 1. Register a GitHub OAuth App

1. Go to GitHub.com → Settings → Developer settings → OAuth Apps → New OAuth App
2. Fill in the following details:

   - Application name: Git Trends
   - Homepage URL: http://localhost:3000
   - Application description: (Optional) A tool to track GitHub trends
   - Authorization callback URL: http://localhost:3000/auth/callback

3. Click "Register application"
4. After registration, you'll see your Client ID
5. Generate a new Client Secret by clicking "Generate a new client secret"
6. Copy both the Client ID and Client Secret

## 2. Configure Supabase Authentication

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (with URL: https://hitnnfpsnmfnsdfbujxy.supabase.co)
3. Navigate to Authentication → Providers → GitHub
4. Toggle to enable GitHub auth
5. Enter the GitHub Client ID and Client Secret you obtained in step 1
6. Set the Redirect URL to: http://localhost:3000/auth/callback
7. Click "Save"

## 3. Update Your .env.local File

Make sure your .env.local file has the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Understanding the Supabase GitHub OAuth Flow

The GitHub OAuth flow when using Supabase follows these steps:

1. **Initiate OAuth Request**:

   - Call `supabase.auth.signInWithOAuth()` with GitHub as the provider
   - Supabase automatically redirects to GitHub's authorization page

2. **User Authorization**:

   - GitHub asks the user to authorize your application
   - Upon authorization, GitHub redirects back to your callback URL with a code

3. **Code Exchange**:

   - Your callback handler receives the code
   - Use `supabaseServerClient.auth.exchangeCodeForSession()` to exchange the code for a session

4. **Session Management**:
   - Supabase automatically handles session creation and management
   - The user's identity is available through the Supabase client

Our implementation leverages Supabase's built-in authentication system while adding custom handling in the API callback.

## 5. Implementation Details

The implementation consists of several key components:

1. **GitHub Login Button** (`src/components/github-login-button/index.tsx`):

   - Uses Supabase's `signInWithOAuth` method
   - Adds state parameter for CSRF protection

2. **API Callback** (`pages/api/auth/callback.ts`):

   - Uses `createServerSupabaseClient` for server-side authentication
   - Verifies state parameter to prevent CSRF attacks
   - Updates user data in the database after successful authentication

3. **Supabase Client** (`src/lib/supabase.ts`):
   - Configured with proper settings for OAuth authentication
   - Uses PKCE flow for enhanced security

## 6. Testing the Authentication Flow

1. Restart your Next.js application: `yarn dev`
2. Try to log in with GitHub
3. You should be redirected to GitHub, then back to your application
4. Verify that the user data is properly stored in your Supabase database

## 7. Troubleshooting

If you encounter authentication issues:

1. Check Supabase project settings to ensure GitHub OAuth is enabled
2. Verify that the callback URL is correctly set both in GitHub and Supabase
3. Check browser console for any JavaScript errors
4. Look at the Supabase logs for authentication errors
5. Ensure all environment variables are correctly set
6. Verify your network connectivity and firewall settings
7. Check that the Supabase client is properly initialized
