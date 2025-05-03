import { NextResponse } from "next/server"

// In a real app, you would store users in a database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123",
  },
]

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const userExists = users.some((user) => user.email === email)
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    // In a real app, you would hash the password and store in a database
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password, // In a real app, this would be hashed
    }

    users.push(newUser)

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
