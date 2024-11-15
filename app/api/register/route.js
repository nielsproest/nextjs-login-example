import { NextResponse } from 'next/server'
import bcrypt from "bcrypt";

// Use a database in production
// Note that this wont work, intentionally
const users = {}; 

export default async function handler(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const data = await req.json()
  const { username, password } = data;

  if (!username || !password) {
    return NextResponse.json({ error: "Empty username or password" }, { status: 405 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = hashedPassword;
  return NextResponse.json({ message: "User registered", data: hashedPassword }, { status: 405 });
}
