export const TESTIMONIAL_AVATAR_FOLDER = "avatars";

export function createAvatarUploadFormData(file: File) {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", TESTIMONIAL_AVATAR_FOLDER);
  return body;
}
