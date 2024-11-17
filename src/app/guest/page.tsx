// can see all that is public everyone not authenticated is guest by default
"use client";
import QueuesPage from "@/components/Pages/QueuesPage";
// import {RouteProvider} from "@/context/RouteContext";

// might not need this page
export default function GuestPage() {
  return (
    <>
      <QueuesPage />;
    </>
  );
}
