import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as jsxRuntime from "react/jsx-runtime";
import * as pricingData from "../components/pricing/pricing-data.ts";

function renderPricing(props = {}, enabled = true) {
  const exports = {};
  const dependencies = {
    "server-only": {},
    "react/jsx-runtime": jsxRuntime,
    "next/link": { __esModule: true, default: ({ prefetch, ...props }) => {
      assert.equal(prefetch, false);
      return React.createElement("a", props);
    } },
    "lucide-react": Object.fromEntries(["ArrowUpRight", "CircleCheck", "Star"].map(name => [name, () => React.createElement("svg", { "aria-hidden": true })])),
    "./pricing-data": { ...pricingData, WEBSITE_PRICING_ENABLED: enabled },
    "./website-pricing.module.css": { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) },
  };
  vm.runInNewContext(ts.transpileModule(readFileSync("components/pricing/WebsitePricing.tsx", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, { exports, require(name) {
    assert.ok(name in dependencies, `Unexpected dependency ${name}`);
    return dependencies[name];
  } });
  return renderToStaticMarkup(React.createElement(exports.WebsitePricing, props));
}

test("homepage and Uganda use the screenshot's exact package names, prices and inclusions", () => {
  const pricing = pricingData.getWebsitePricing();
  assert.equal(pricing.startingFrom, false);
  assert.deepEqual(pricing.plans.map(plan => plan.name), ["Starter", "Business", "Ecommerce"]);
  assert.deepEqual(pricing.plans.map(plan => plan.price), ["UGX 900,000", "UGX 1,800,000", "UGX 3,500,000"]);
  assert.deepEqual(pricing.plans.map(plan => plan.features.length), [13, 16, 17]);
  assert.deepEqual(pricing.plans.filter(plan => plan.featured).map(plan => plan.id), ["business"]);
  assert.ok(pricing.plans[0].features.includes("Up to 20 pages"));
  assert.ok(pricing.plans[1].features.includes("Online booking & appointment system"));
  assert.ok(pricing.plans[2].features.includes("MTN Mobile Money & Airtel Money"));
  assert.ok(pricing.plans[2].features.includes("Kampala delivery zones & fees"));
});

for (const [market, currency, amounts] of [
  ["united-states", "USD", [1500, 2900, 4500]],
  ["united-kingdom", "GBP", [1200, 2300, 3500]],
  ["canada", "CAD", [2000, 3900, 6000]],
  ["australia", "AUD", [2200, 4300, 6800]],
]) {
  test(`${market} uses the approved regional prices and ordering features`, () => {
    const pricing = pricingData.getWebsitePricing(market);
    assert.equal(pricing.currency, currency);
    assert.equal(pricing.startingFrom, true);
    assert.deepEqual(pricing.plans.map(plan => plan.amount), amounts);
    assert.ok(pricing.plans.every(plan => plan.price.startsWith(`${currency} `)));
    for (const plan of pricing.plans) {
      assert.equal(plan.amount, pricingData.REGIONAL_PACKAGE_PRICES[market][plan.id]);
    }
    const smsOrders = market === "united-states" || market === "canada";
    assert.equal(pricing.plans[2].features.includes("SMS and email order alerts"), smsOrders);
    assert.equal(pricing.plans[2].features.includes("WhatsApp ordering"), !smsOrders);
    assert.ok(pricing.plans[0].features.some(feature => feature.includes(pricing.customerLabel)));
    assert.ok(pricing.plans[2].features.includes("Shipping zones & delivery fees"));
    assert.doesNotMatch(pricing.plans.flatMap(plan => plan.features).join(" "), /Kampala|Ugandan|MTN|Airtel/);
    const html = renderPricing({ market });
    assert.equal((html.match(/>From</g) || []).length, 3);
    assert.doesNotMatch(html, /Approx\.|currency conversions|rounded conversions|exchange.rate|ExchangeRate-API|15%|benchmark/i);
    assert.match(html, /Final scope, price and billing currency/);
  });
}

test("the section is server-rendered, has one heading hierarchy and functional enquiry links", () => {
  const html = renderPricing({ homepage: true });
  assert.equal((html.match(/<section\b/g) || []).length, 1);
  assert.equal((html.match(/<h2\b/g) || []).length, 1);
  assert.equal((html.match(/<h3\b/g) || []).length, 3);
  assert.equal((html.match(/href="\/start"/g) || []).length, 3);
  assert.equal((html.match(/href="\/contact"/g) || []).length, 1);
  assert.match(html, /Most Popular/);
  assert.doesNotMatch(html, />From<|Approx\.|Rates by|<script|<img|<h1/);
});

test("one switch removes the entire section; unknown markets do not receive the wrong currency", () => {
  assert.equal(renderPricing({}, false), "");
  assert.equal(renderPricing({ market: "unknown" }), "");
  assert.equal(pricingData.getWebsitePricing("constructor"), null);
});
