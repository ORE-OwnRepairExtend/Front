type ProfileImageProps = {
  imageUrl?: string;
  alt?: string;
  size?: number;
};

export default function ProfileImage({
  imageUrl,
  alt = "profile",
  size = 100,
}: ProfileImageProps) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden bg-[#D0D0D0]"
      style={{
        width: size,
        height: size,
        borderRadius: 30,
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
      ) : (
        // 기본
        <span className="text-gray-500 text-sm">ORE</span>
      )}
    </div>
  );
}
