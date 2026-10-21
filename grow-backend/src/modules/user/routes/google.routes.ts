import express from "express";
import passport from "passport";
import { generateTokens } from "@/utils/jwt";
import { User } from "@/modules/user/model/user.model";
import { resolveGoogleCallbackUrl, resolveFrontendUrl } from "@/config/env";
import { getRedirectUriVerdict } from "@/utils/googleRedirectCheck";

const router = express.Router();

/**
 * Google OAuth login route
 *
 * The callback URL is resolved per request so that the `redirect_uri` sent to
 * Google is always one that is registered in the Google Cloud Console for
 * the environment the request came from (production vs local dev).
 *
 * If the startup probe already proved that the URI we are about to send is
 * NOT registered, the browser is sent straight back to the frontend with an
 * actionable message instead of being handed to Google, which would only
 * show a generic "Access blocked / redirect_uri_mismatch" page.
 */
router.get(
  "/google",
  (req: any, res: any, next: any) => {
    const callbackUrl = resolveGoogleCallbackUrl(req.get("host"));
    const verdict = getRedirectUriVerdict(callbackUrl);

    if (verdict === "REJECTED") {
      return res.redirect(
        `${resolveFrontendUrl(req)}/login?error=google_not_configured` +
          `&redirect_uri=${encodeURIComponent(callbackUrl)}`
      );
    }

    return passport.authenticate(
      "google",
      {
        scope: ["profile", "email"],
        session: false,
        // `callbackURL` is honoured by passport-oauth2 at runtime
        // (`options.callbackURL || this._callbackURL`) but is missing from
        // the @types definitions for this strategy.
        callbackURL: callbackUrl,
      } as passport.AuthenticateOptions
    )(req, res, next);
  }
);

/**
 * Google OAuth callback route
 *
 * A custom passport callback is used instead of `failureRedirect` because that
 * option only accepts a static string - a relative "/login" would send the
 * browser to the BACKEND's /login (404) instead of the frontend's login page.
 */
router.get(
  "/google/callback",
  (req: any, res: any, next: any) =>
    passport.authenticate(
      "google",
      { session: false },
      (err: any, user: any, _info: any) => {
        if (err || !user) {
          return res.redirect(
            `${resolveFrontendUrl(req)}/login?error=google_auth_failed`
          );
        }
        req.user = user;
        next();
      }
    )(req, res, next),
  async (req: any, res) => {
    try {
      const user = req.user as any;
      // Redirect back to the frontend the request originated from. Resolved
      // from the configured allow-list, never from a raw header value.
      const frontendUrl = resolveFrontendUrl(req);

      // Safety check
      if (!user || !user._id) {
        res.redirect(`${frontendUrl}/login?error=authentication_failed`);
        return;
      }

      // A blocked account must not be able to sign in through Google either.
      if (user.isBlocked) {
        res.redirect(`${frontendUrl}/login?error=account_blocked`);
        return;
      }

      // Check if this is a new user
      const isNewUser = user.isNewGoogleUser === true;

      // If new user, redirect to role selection instead of generating tokens
      if (isNewUser) {
        // SECURITY: a token is issued for the new account BEFORE role
        // selection so that the role-selection endpoint can be authenticated.
        // Previously the new user was redirected with only a user id, and the
        // endpoint that accepted it had no auth at all - anyone could rewrite
        // any account's role by passing its id.
        const { accessToken, refreshToken } = generateTokens(
          user._id.toString(),
          user.role || "student"
        );

        await User.findByIdAndUpdate(user._id, { refreshToken });

        const redirectUrl =
          `${frontendUrl}/select-role` +
          `?accessToken=${encodeURIComponent(accessToken)}` +
          `&refreshToken=${encodeURIComponent(refreshToken)}` +
          `&role=${encodeURIComponent(user.role || "student")}`;

        res.redirect(redirectUrl);
        return;
      }

      // Generate tokens for existing users
      const { accessToken, refreshToken } = generateTokens(
        user._id.toString(),
        user.role
      );

      // Save refresh token
      await User.findByIdAndUpdate(user._id, {
        refreshToken,
      });

      // Redirect to frontend with tokens
      const roleRedirects: Record<string, string> = {
        student: "/student",
        instructor: "/instructor",
        guardian: "/guardian",
        admin: "/admin",
      };

      const redirectPath = roleRedirects[user.role] || "/student";
      const redirectUrl = `${frontendUrl}/auth-callback?accessToken=${accessToken}&refreshToken=${refreshToken}&role=${user.role}&redirect=${redirectPath}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(`${resolveFrontendUrl(req)}/login?error=authentication_failed`);
    }
  }
);

export default router;
