import { createClient } from "@supabase/supabase-js";

const url = "https://yqizeshpdzuerwuxsyul.supabase.co";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXplc2hwZHp1ZXJ3dXhzeXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDM0NzgsImV4cCI6MjA3MzE3OTQ3OH0.kCKEakunFS_Sc3imE2WfhqeRB8jNAYuGZDKIEtVwEJA";

const supabase = createClient(url, key);

export default function mediaUpload(file) {
  const mediaUploadPromise = new Promise((resolve, reject) => {
    if (file == null) {
      reject("No file detected");
      return;
    }

    const timestamp = new Date().getTime();
    const newName = timestamp + file.name;

    supabase.storage
      .from("images")
      .upload(newName, file, {
        upsert: false,
        cacheControl: "3600",
      })
      .then(() => {
        const publicUrl = supabase.storage.from("images").getPublicUrl(newName)
          .data.publicUrl;
        console.log(publicUrl);
        resolve(publicUrl);
      })
      .catch((e) => {
        console.log(e);
        reject("error occured in supabase side");
      });
  });

  return mediaUploadPromise;
}
