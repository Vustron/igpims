import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { env } from "@/config/env"
import { catchError } from "@/utils/catch-error"
import { getUploadAuthParams } from "@imagekit/next/server"
import { NextRequest, NextResponse } from "next/server"

export async function imageKitUploadAuth(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) {
      return rateLimitCheck
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
      // token: "random-token", // Optional, a unique token for request
    })

    return NextResponse.json(
      {
        token,
        expire,
        signature,
        publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
