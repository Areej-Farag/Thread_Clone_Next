"use client";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ThreadCardProps {
  id: string | number | undefined;
  parentId?: string | null;
  content: string;
  author: { id: string | number; username: string; image: string };
  createdAt: Date;
  updatedAt?: Date;
  comments?: {
    author: { id: string | number; username: string; image: string };
    text: string;
    createdAt: Date;
  }[];
  community?: {
    id: string;
    name: string;
    image: string;
  } | null;
  currentUserId: string;
  isComment?: boolean;
}

export default function ThreadCard({
  id,
  parentId,
  content,
  author,
  createdAt,
  updatedAt,
  comments,
  community,
  currentUserId,
  isComment,
}: ThreadCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const handleShare = async ({
    title,
    text,
  }: {
    title: string;
    text: string;
  }) => {
    const shareUrl = `${window.location.origin}/thread/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: shareUrl,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.warn("Web Share API not supported in this browser.");
    }
  };

  return (
    <article
      className={`flex w-full flex-col gap-3 py-3  rounded-xl ${isComment ? "px-0 xs:px-7" : "px-7  bg-dark-2"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image || "/assets/user.svg"}
                alt={`${author.username}'s profile picture`}
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex -w-full flex-col ">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="text-base-semibold text-light-1 cursor-pointer">
                {author.username}
              </h4>
            </Link>
            <p className="text-small-regular text-light-2 mt-2">{content}</p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  title="like"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  title="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    title="comment"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>

                <Image
                  onClick={() => {
                    console.log("shareClicked");
                    handleShare({
                      title: `Check out this thread by ${author.username}`,
                      text: content,
                    });
                  }}
                  src="/assets/share.svg"
                  alt="share"
                  title="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              {isComment && comments && comments.length! > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="text-subtle-medium text-gray-1 mt-1">
                    View {comments?.length}{" "}
                    {comments?.length === 1 ? "comment" : "comments"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {
              isMounted
                ? `${formatDateString(createdAt.toString())} - ${community.name}`
                : "Loading date..." // أو سيبها فاضية "" لحد ما يحمل
            }
          </p>
          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
}
