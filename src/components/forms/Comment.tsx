"use client";
import { CommentValidation } from "@/lib/validations/thread";
import { Input } from "../ui/input";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Field, FieldError } from "../ui/field";
import * as z from "zod";
import { Button } from "../ui/button";
import { addCommentToThread } from "@/lib/actions/thread.actions";
type CommentProps = {
  threadId: string;
  userImage: string;
  currentUserId: string;
};
export default function Comment({
  threadId,
  userImage,
  currentUserId,
}: CommentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
      accountId: currentUserId,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof CommentValidation>,
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      await addCommentToThread({
        threadId: JSON.parse(threadId),
        commentText: values.thread,
        userId: JSON.parse(currentUserId),
        path: pathname,
      });
      form.reset();
    } catch (error) {
      console.error("Error posting thread:", error);
    }
  };

  return (
    <div>
      <h3 className="text-heading4-medium text-light-1"> Add Comment</h3>
      <form
        id="form-rhf-demo-comment"
        onSubmit={form.handleSubmit(onSubmit)}
        className="comment-form "
      >
        <Image
          src={userImage}
          alt="profile"
          height={48}
          width={48}
          className="rounded-full object-contain"
        />
        <Controller
          name="thread"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="border-none bg-transparent">
              <Input
                className="no-focus border border-dark-4 bg-dark-3 outline-none text-light-1 p-4"
                id="form-rhf-demo-comment"
                aria-invalid={fieldState.invalid}
                placeholder="What's on your mind?"
                autoComplete="off"
                {...field}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </div>
  );
}
