# Facebook Pixel configuration

Tracking is disabled by default. Neither a script nor a noscript beacon is rendered when the enable flag is absent or false, or the ID is invalid. No environment files were changed during this implementation.

When advertising resumes, set these public build-time variables and rebuild/redeploy:

```dotenv
NEXT_PUBLIC_ENABLE_META_PIXEL=true
NEXT_PUBLIC_META_PIXEL_ID=1233482635537855
```

The existing Pixel ID is retained here for the account owner. It is a public integration identifier, not a secret. Only numeric IDs are accepted.

The browser integration also requires an explicit marketing preference. Connect the future consent UI to:

```js
localStorage.setItem("veilcode-marketing-consent", "granted");
window.dispatchEvent(new Event("veilcode:marketing-consent"));
```

Store `denied` and dispatch the same event to revoke consent. Storage failures fail closed. With no consent UI/preference, the Pixel remains inactive even when the deployment flag is true. The consent UI itself is not part of this performance change.

After permission is granted, Next.js schedules the Pixel after page load during browser idle time. Initial and pathname-navigation PageViews are queued once per URL transition. Query-only history changes without a pathname transition are not separately measured. Removing consent stops this application's events and sends Meta's revoke command; already-loaded third-party code cannot be unloaded, and existing cookies are not deleted by this component.

There is intentionally no noscript tracking beacon: without JavaScript this integration cannot verify the stored preference. No tracking or advertising configuration has been changed externally.

Before enabling campaigns, test permission changes, initial landing pages, client-side navigation, duplicate events, and the reporting requirements for the campaign. Use intercepted network requests or a dedicated test Pixel; do not generate synthetic events against the production Pixel.
