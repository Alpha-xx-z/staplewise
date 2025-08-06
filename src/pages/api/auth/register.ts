import { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '../../../lib/auth';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, phone, role, companyName, gst } = req.body;
    
    if (!email || !password || !name || !phone || !role) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const result = await AuthService.register({
      email,
      password,
      name,
      phone,
      role: role as Role,
      companyName,
      gst
    });
    
    res.status(201).json({
      success: true,
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Registration failed' 
    });
  }
}