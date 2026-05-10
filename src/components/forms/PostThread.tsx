"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
export default function PostThread({ userId }: { userId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  const onSubmit = async (
    values: z.infer<typeof ThreadValidation>,
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    try {
      const thread = await createThread({
        text: values.thread,
        author: values.accountId,
        communityId: null,
        path: pathname,
      });

      router.push(`/`);
    } catch (error) {
      console.error("Error posting thread:", error);
    }
  };
  return (
    <>
      <form
        id="form-rhf-demo-thread-create"
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-light-1 flex flex-col gap-10 justify-start"
      >
        <Controller
          name="thread"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex items-center gap-4 w-full"
            >
              <FieldLabel
                htmlFor="form-rhf-demo-postContent"
                className="text-base-semibold text-light-2"
              >
                Thread Content
              </FieldLabel>

              <Textarea
                rows={10}
                className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                id="form-rhf-demo-thread"
                aria-invalid={fieldState.invalid}
                placeholder="What's on your mind?"
                autoComplete="off"
                {...field}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 py-1"
        >
          Post Thread
        </Button>
      </form>
    </>
  );
}
