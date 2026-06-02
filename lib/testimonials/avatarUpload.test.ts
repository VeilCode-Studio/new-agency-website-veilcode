import test from "node:test";
import assert from "node:assert/strict";
import {
  TESTIMONIAL_AVATAR_FOLDER,
  createAvatarUploadFormData,
} from "./avatarUpload.ts";

test("createAvatarUploadFormData targets the avatars Cloudinary subfolder", () => {
  const file = new File(["avatar"], "avatar.png", { type: "image/png" });
  const formData = createAvatarUploadFormData(file);

  assert.equal(TESTIMONIAL_AVATAR_FOLDER, "avatars");
  assert.equal(formData.get("file"), file);
  assert.equal(formData.get("folder"), "avatars");
});
