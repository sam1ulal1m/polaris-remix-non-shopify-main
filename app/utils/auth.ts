import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "936a185caaa266bb9cbe981e9e05cb78cd732b0b3280eb944412bb6f8f8f07af";

export function verifyToken(token: string) {
  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // Returns the payload (user info) if the token is valid
  } catch (error) {
    console.error("Invalid token:", error);
    throw new Error("Invalid or expired token");
  }
}

export function generateToken(payload, expiresIn = "1h") {
  // Generate a token with the given payload and expiration time
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
