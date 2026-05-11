/* eslint-disable camelcase */
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";

export const POST = async (request: Request) => {
  // 1. استلام الـ Raw Body كـ Text (ده أهم تعديل عشان الـ Verification يشتغل)
  const payloadString = await request.text();

  // أضف await هنا
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log("-----------------------------------------");
  console.log("Clerk Webhook Headers:");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

  let evt: any;

  // 2. التحقق من التوقيع (Verification)
  try {
    evt = wh.verify(payloadString, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
    console.log("Verification successful!");
  } catch (err) {
    console.error("Verification error: ", err);
    return new Response("Error occurred during verification", { status: 400 });
  }

  const eventType = evt.type;
  console.log(`Event Type: ${eventType}`);

  // 3. معالجة الأحداث (Events)
  try {
    if (eventType === "organization.created") {
      const { id, name, slug, logo_url, image_url, created_by } = evt.data;
      console.log("⏳Creating Community in MongoDB...");

      await createCommunity(
        id,
        name,
        slug,
        logo_url || image_url,
        "org bio",
        created_by,
      );
      console.log("Community created successfully!");
      return NextResponse.json(
        { message: "Community created" },
        { status: 201 },
      );
    }

    if (eventType === "organizationMembership.created") {
      const { organization, public_user_data } = evt.data;
      console.log("⏳Adding Member to Community in MongoDB...");
      await addMemberToCommunity(organization.id, public_user_data.user_id);
      return NextResponse.json({ message: "Member added" }, { status: 201 });
    }

    if (eventType === "organizationMembership.deleted") {
      const { organization, public_user_data } = evt.data;
      await removeUserFromCommunity(public_user_data.user_id, organization.id);
      return NextResponse.json({ message: "Member removed" }, { status: 201 });
    }

    if (eventType === "organization.updated") {
      const { id, logo_url, name, slug } = evt.data;
      await updateCommunityInfo(id, name, slug, logo_url);
      return NextResponse.json(
        { message: "Community updated" },
        { status: 201 },
      );
    }

    if (eventType === "organization.deleted") {
      const { id } = evt.data;
      try {
        await deleteCommunity(id);
        return NextResponse.json({ message: "Deleted" }, { status: 201 });
      } catch (err) {
        return NextResponse.json(
          { message: "Already deleted or not found" },
          { status: 200 },
        );
      }
    }
  } catch (err: any) {
    console.error("Error occurred: ", err.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }

  return new Response("Event processed", { status: 200 });
};
