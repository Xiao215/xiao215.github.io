import type { NextPage } from "next";
import Image from "next/image";
import profilepic from "../../public/assets/photos/pfp.jpeg";

const ProfilePic: NextPage = () => {
  return (
    <div className="py-10 px-20 z-40">
      <Image
        src={profilepic}
        alt="Your selfie"
        className="rounded-full"
        width={240}
        height={240}
      />
    </div>
  );
};

export default ProfilePic;
