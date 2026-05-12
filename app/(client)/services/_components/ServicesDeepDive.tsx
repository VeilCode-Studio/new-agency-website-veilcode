"use client";
import { ServiceDeepDiveCard } from "./ServicesDeepDiveCard";
import type { InferSelectModel } from "drizzle-orm";
import { services } from "@/db/schema";

export function ServiceDeepDives({ serviceList }: { serviceList: InferSelectModel<typeof services>[] }) {
  return (
    <>
      {serviceList.map((d, i) => (
        <ServiceDeepDiveCard key={d.id} data={d} flipped={i % 2 !== 0} />
      ))}
    </>
  );
}