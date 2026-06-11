import { NextRequest, NextResponse } from 'next/server';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'dummy_token');

export async function POST(req: NextRequest) {
  try {
    // In a real app we'd query db for telegram_ids of employees and send their payslips.
    const mockTelegramId = process.env.TELEGRAM_CHAT_ID; // Just for demo
    if (mockTelegramId && process.env.TELEGRAM_BOT_TOKEN) {
      await bot.telegram.sendMessage(mockTelegramId, `💰 <b>Payslip for June 2026</b>\n\nBase Salary: $500.00\nAdjustments: $0.00\n<b>Net Total: $500.00</b>\n\nThank you for your hard work!`, { parse_mode: 'HTML' });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payslip error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
