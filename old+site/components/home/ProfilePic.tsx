import Image from "next/image";
import profilepic from "../../public/assets/photos/pfp.jpeg";

const ProfilePic = () => {
  return (
    <div className="py-10 px-20 z-40">
      <Image
        src={profilepic}
        alt="Your selfie"
        className="rounded-full h-auto"
        width={240}
      />
    </div>
  );
};

export default ProfilePic;
