import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Test Supabase database connectivity
    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('count')
      .limit(1);

    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('count')
      .limit(1);

    if (sessionsError || messagesError) {
      throw new Error(`Database connection failed: ${sessionsError?.message || messagesError?.message}`);
    }

    // Test creating a sample chat session
    const { data: newSession, error: insertError } = await supabase
      .from('chat_sessions')
      .insert({ title: 'Test Session' })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    // Clean up test data
    await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', newSession.id);

    const data = {
      message: "Supabase database connection successful",
      timestamp: new Date().toISOString(),
      database: {
        chat_sessions_accessible: !sessionsError,
        chat_messages_accessible: !messagesError,
        crud_operations: !insertError
      },
      tables: {
        chat_sessions: "✅ Connected",
        chat_messages: "✅ Connected"
      }
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Database connection test failed:", error);
    return NextResponse.json(
      { 
        error: "Database connection failed", 
        details: String(error),
        message: "Failed to connect to Supabase database"
      },
      { status: 500 }
    );
  }
}
