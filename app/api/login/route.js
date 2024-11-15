import { NextResponse } from 'next/server'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// Load the private key
const privateKey = fs.readFileSync("private/private.pem", "utf8");

// In-memory user store (use a database in production)
const users = {
  "user": "hash"
};

export async function POST(req) {
	const data = await req.json()
	const { username, password } = data;

	const hashedPassword = users[username];
	console.log(data, hashedPassword);
	if (!hashedPassword) {
		return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
	}

	const isPasswordValid = await bcrypt.compare(password, hashedPassword);
	if (isPasswordValid) {
		const token = jwt.sign({ username }, privateKey, { algorithm: "RS512", expiresIn: "12h" });
		const res = NextResponse.json({ message: "OK" }, { status: 200 });

		res.cookies.set('auth-token', token, {
			httpOnly: true,
			secure: true,
			path: '/',
			maxAge: 60 * 60,
			domain: ".example.com",
			sameSite: "none",
		});

		// TODO: Redirect maybe

		return res;
	} else {
		return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
	}
}
