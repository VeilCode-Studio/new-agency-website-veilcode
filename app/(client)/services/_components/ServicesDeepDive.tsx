"use client";
import { ServiceDeepDiveCard } from "./ServicesDeepDiveCard";
import type { Service } from "@/db/schema";

export function ServiceDeepDives({ serviceList }: { serviceList: Service[] }) {
  return (
    <>
      {serviceList.map((d, i) => (
        <ServiceDeepDiveCard key={d.id} data={d} flipped={i % 2 !== 0} />
      ))}
    </>
  );
}
