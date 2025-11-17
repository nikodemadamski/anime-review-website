import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Subscriber {
  email: string;
  subscribedAt: string;
  ip?: string;
}

interface NewsletterData {
  subscribers: Subscriber[];
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'newsletter-subscribers.json');

// Rate limiting map (in-memory for MVP)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3;

async function loadSubscribers(): Promise<NewsletterData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return { subscribers: [] };
  }
}

async function saveSubscribers(data: NewsletterData): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(identifier) || 0;
  
  if (requests >= MAX_REQUESTS) {
    return false;
  }
  
  rateLimitMap.set(identifier, requests + 1);
  
  // Clean up old entries
  setTimeout(() => {
    rateLimitMap.delete(identifier);
  }, RATE_LIMIT_WINDOW);
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Load existing subscribers
    const data = await loadSubscribers();

    // Check for duplicates
    const existingSubscriber = data.subscribers.find(
      (sub) => sub.email.toLowerCase() === email.toLowerCase()
    );

    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed! 🎉' },
        { status: 400 }
      );
    }

    // Add new subscriber
    const newSubscriber: Subscriber = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      ip: ip !== 'unknown' ? ip : undefined,
    };

    data.subscribers.push(newSubscriber);

    // Save to file
    await saveSubscribers(data);

    return NextResponse.json({
      success: true,
      message: "You're in! 🎉 We'll email you when amazing anime drops",
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
