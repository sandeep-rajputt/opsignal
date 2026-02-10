"use client";

import dynamic from "next/dynamic";

const HydrateNuqs = dynamic(
  () => import("@/app/(dashboard)/dashboard/[dashboardid]/HydrateNuqs"),
  {
    ssr: false,
  },
);

export default HydrateNuqs;
