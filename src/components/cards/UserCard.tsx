"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Props = {
  name: string;
  username: string;
  image: string;
  id: string;
  personType: "User" | "Community";
};
export default function UserCard({
  name,
  username,
  image,
  id,
  personType,
}: Props) {
  const router = useRouter();
  const handleButtonClick = () => {
    if (personType === "User") {
      router.push(`/profile/${id}`);
    } else {
      router.push(`/communities/${id}`);
    }
  };
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={image}
          alt={`${name}'s avatar`}
          width={48}
          height={48}
          className="rounded-full "
        />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <Button className="user-card_btn p-2" onClick={handleButtonClick}>
        View
      </Button>
    </article>
  );
}
