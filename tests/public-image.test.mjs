import test from "node:test";
import assert from "node:assert/strict";
import { publicImageSource } from "../lib/public-image.ts";

test("public image delivery bounds versioned Cloudinary originals without modifying the asset", () => {
  const source =
    "https://res.cloudinary.com/studio/image/upload/v123/projects/dashboard.png";
  assert.equal(
    publicImageSource(source),
    "https://res.cloudinary.com/studio/image/upload/f_auto,q_auto:good,c_limit,w_2400/v123/projects/dashboard.png",
  );
  assert.equal(
    publicImageSource(publicImageSource(source)),
    publicImageSource(source),
  );
});

test("local, other-host, signed, already transformed and malformed image sources pass through", () => {
  for (const source of [
    "/images/project.webp",
    "https://example.com/image/upload/v123/photo.jpg",
    "https://res.cloudinary.com/studio/image/upload/s--signature--/v123/photo.jpg",
    "https://res.cloudinary.com/studio/image/upload/c_fill,w_500/v123/photo.jpg",
    "https://res.cloudinary.com/studio/image/upload/v123/photo.jpg?signature=preserve",
    "http://res.cloudinary.com/studio/image/upload/v123/photo.jpg",
    "not-a-url",
  ])
    assert.equal(publicImageSource(source), source);
});
