import { verifyToken } from "~/utils/auth";

export const loader = async ({ request }) => {
  const token = request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];

  if (!token) {
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  }

  try {
    const user = verifyToken(token); // Custom function to verify the JWT
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  }
};
