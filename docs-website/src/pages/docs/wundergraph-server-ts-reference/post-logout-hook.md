---
title: Post Logout Hook
pageTitle: WunderGraph - Post Logout Hook
description:
---

The `postLogout` hook gets called after the user has been logged out.
It can be used to clean up any resources that are associated with the user,
like sessions in a database or another service.

If you're using OpenID Connect as the authentication provider, we support the "End Session Endpoint" of the OpenID Connect specification out of the box.
However, not all OIDC Providers support this feature.
In such cases, you can use the `postLogout` hook to implement the logout yourself.

Similar to all other hooks,
the `postLogout` hook is called with the following parameters:

- `user`: The user object when the user is authenticated
- `clientRequest`: The original client request object, including Headers
- `log`: The logger object
- `internalClient`: The internal client object
- `response`: The response object (only for postResolve hooks)
- `input`: The input object (only for Operation hooks)

With the `internalClient`,
you're able to securely call into all defined Operations,
e.g. to talk to a database or another service to enrich a response or manipulate the inputs of an Operation.

```typescript
// wundergraph.server.ts
export default configureWunderGraphServer<HooksConfig, InternalClient>(() => ({
  hooks: {
    authentication: {
      postLogout: async (hook) => {
        console.log('postLogout', JSON.stringify(hook.user))
      },
    },
  },
}))
```

## How to logout users if there is no back channel API to the OIDC Provider

Some OpenID Connect Providers, like Auth0, do not support the "End Session Endpoint" of the OpenID Connect specification.
Unfortunately, Auth0 also doesn't provide a way to call a back channel API to log out the user.
In such cases, you have to use a front channel logout after logging the user out of your WunderGraph application.
If you omit this step, the user is still logged into the OIDC provider through a cookie.
