"use client";
import GoogleMyBusinessDashboard from "@/components/reports/GoogleMyBusinessDashboard";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <GoogleMyBusinessDashboard />
    </Suspense>
  );
};

export default page;
