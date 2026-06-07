import { useEffect, useState } from "react";
import logoImage from "../../../public/photos/logo.png";

type ProfileImageProps = {
  imageUrl?: string;
  alt?: string;
  size?: number;
};

const normalizeProfileImageUrl = (url?: string) => {
  if (!url) return logoImage;

  const googleUrlIndex = url.indexOf("https%3A//lh3.googleusercontent.com");

  if (googleUrlIndex !== -1) {
    return decodeURIComponent(url.slice(googleUrlIndex));
  }

  return url;
};

export default function ProfileImage({
  imageUrl,
  alt = "profile",
  size = 100,
}: ProfileImageProps) {
  const [src, setSrc] = useState(normalizeProfileImageUrl(imageUrl));

  useEffect(() => {
    setSrc(normalizeProfileImageUrl(imageUrl));
  }, [imageUrl]);

  return (
    <div
      className="flex items-center justify-center overflow-hidden bg-[#D0D0D0]"
      style={{
        width: size,
        height: size,
        borderRadius: 30,
      }}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => {
          setSrc(logoImage);
        }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
