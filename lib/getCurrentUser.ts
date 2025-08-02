import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './mongoose';
import Users from '@/model/Users';

export async function getCurrentUser() {
  const cookieStore = await cookies(); // ← App Router version
  const token = cookieStore.get('token')?.value;

  console.log('getCurrentUser - Cookie token:', token ? 'Token exists' : 'No token found');
  
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    console.log('getCurrentUser - JWT decoded successfully, userId:', decoded.id);
    await connectToDatabase();
    const user = await Users.findById(decoded.id).select('-password');
    console.log('getCurrentUser - User found:', user ? user.email : 'User not found');
    return user;
  } catch (err) {
    console.error("JWT decode failed:", err);
    return null;
  }
}
