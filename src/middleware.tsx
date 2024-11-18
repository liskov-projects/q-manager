import {clerkMiddleware} from "@clerk/nextjs/server";

export default clerkMiddleware();
// where is the session? should give info about the user
//   can't get to /user unless logged | redirect to /guest?
// use the session to make the decision what to show on a page
// draggable = user === admin ? true : false
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
