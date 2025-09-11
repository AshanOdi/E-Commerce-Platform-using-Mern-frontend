import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import mediaUpload from "../utils/mediaUpload";

export default function TestPage() {
  const [image, setImage] = useState(null);

  // const url = "https://yqizeshpdzuerwuxsyul.supabase.co";
  // const key =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXplc2hwZHp1ZXJ3dXhzeXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDM0NzgsImV4cCI6MjA3MzE3OTQ3OH0.kCKEakunFS_Sc3imE2WfhqeRB8jNAYuGZDKIEtVwEJA";

  // const supabase = createClient(url, key);

  function buttonClick() {
    //meken supabase ekata yawannona image eka
    //dewal 2k dennona.danna one namai file ekai
    // supabase.storage.from("images").upload("test.jpn" ,  image)
    // supabase.storage
    //   .from("images")
    //   .upload(image.name, image, {
    //     upsert: false,
    //     cacheControl: "3600",
    //   })
    //   .then(() => {
    //     const publicUrl = supabase.storage
    //       .from("images")
    //       .getPublicUrl(image.name).data.publicUrl;
    //     console.log(publicUrl);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });

    mediaUpload(image)
      .then((res) => {
        console.log(res);
      })
      .catch((res) => {
        console.log(res);
      });
  }

  return (
    <div className="w-full h-screen  flex justify-center items-center flex-col">
      <input
        onChange={(e) => {
          setImage(e.target.files[0]);
          // console.log(e.target.files[0]);
        }}
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
      />
      <button
        onClick={buttonClick}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
      >
        Upload
      </button>
    </div>
  );
}
