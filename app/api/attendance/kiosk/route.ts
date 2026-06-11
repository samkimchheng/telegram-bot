import { NextRequest, NextResponse } from 'next/server';

// Temporary server-side state for the demo to track alternating IN/OUT states.
// In a real application, this would query the database for the most recent attendance record.
const lastActions: Record<string, 'in' | 'out'> = {};

export async function POST(req: NextRequest) {
  try {
    const { employeeCode, name } = await req.json();
    
    if (!employeeCode) {
      return NextResponse.json({ error: 'Missing employee information' }, { status: 400 });
    }

    // Identify Auto Mode Action: Toggle from the last record
    const last = lastActions[employeeCode] || 'out';
    const nextAction = last === 'out' ? 'in' : 'out';
    
    // Save new state
    lastActions[employeeCode] = nextAction;

    const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Phnom_Penh' });
    
    // In a real application: 
    // db.attendance.insert({ employeeCode, action: nextAction, timestamp: new Date() })
    
    // Optional: Send telegram notification if token is available
    // (mocking the notification setup without importing telegraf instance just to return)

    return NextResponse.json({ 
      success: true, 
      action: nextAction, 
      time,
      message: `Successfully checked ${nextAction}`
    });
  } catch (error) {
    console.error('Kiosk API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
