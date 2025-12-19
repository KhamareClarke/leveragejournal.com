# Daily Journal Setup Guide

## Overview
The daily journal feature allows users to track their 90-day transformation journey with:
- **Gratitude** entries
- **Top 3 Priorities**
- **Tasks** (with completion tracking)
- **Reflections**
- **Mood** tracking
- **Streak** calculation
- **Completion** flags

## Database Setup

### Step 1: Run the Migration

1. Go to **Supabase Dashboard**:
   - https://supabase.com/dashboard/project/jmlfvqoholffkegwfsyu
   - Click **SQL Editor** in the left sidebar

2. **Run the migration**:
   - Open `supabase/migrations/004_create_journal_entries_table.sql`
   - Copy the entire SQL content
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

3. **Verify the table was created**:
   ```sql
   SELECT * FROM journal_entries LIMIT 1;
   ```

### Step 2: Verify RLS Policies

The migration automatically creates Row Level Security (RLS) policies that ensure:
- Users can only view their own journal entries
- Users can only create/update/delete their own entries

## Features

### Auto-Save
- Journal entries automatically save after 2 seconds of inactivity
- Manual save button also available
- Last saved timestamp displayed

### Date Navigation
- Users can navigate to any date using the date picker
- Each date has its own unique entry
- Day number automatically calculated (1-90)

### Streak Tracking
- Automatically calculates consecutive days with completed entries
- Displayed prominently in the header
- Updates when an entry is marked as complete

### Task Management
- Add unlimited tasks
- Mark tasks as complete/incomplete
- Remove tasks
- Tasks stored as JSONB array

## API Endpoints

### GET `/api/journal/entries?date=YYYY-MM-DD`
Retrieves a journal entry for a specific date.

**Response:**
```json
{
  "entry": {
    "id": "uuid",
    "entry_date": "2025-01-10",
    "day_number": 5,
    "gratitude": "...",
    "priority_1": "...",
    "priority_2": "...",
    "priority_3": "...",
    "tasks": [...],
    "reflection": "...",
    "mood": "😊 Happy",
    "completed": true,
    "streak": 5
  }
}
```

### POST `/api/journal/entries`
Creates or updates a journal entry.

**Request Body:**
```json
{
  "entry_date": "2025-01-10",
  "day_number": 5,
  "gratitude": "...",
  "priority_1": "...",
  "priority_2": "...",
  "priority_3": "...",
  "tasks": [
    {"id": "1", "text": "Task 1", "completed": false}
  ],
  "reflection": "...",
  "mood": "😊 Happy",
  "completed": true
}
```

## Access

- **URL**: `/dashboard/daily`
- **From Dashboard**: Click "Daily Flow" tab → "Open Daily Journal" button
- **Direct Link**: Available in dashboard navigation

## Database Schema

```sql
journal_entries
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── entry_date (DATE, Unique with user_id)
├── day_number (INTEGER, 1-90)
├── gratitude (TEXT)
├── priority_1 (TEXT)
├── priority_2 (TEXT)
├── priority_3 (TEXT)
├── tasks (JSONB)
├── reflection (TEXT)
├── mood (VARCHAR)
├── streak (INTEGER)
├── completed (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Indexes

- `journal_entries_user_id_idx` - Fast user lookups
- `journal_entries_entry_date_idx` - Fast date lookups
- `journal_entries_user_date_idx` - Composite index for user+date queries
- `journal_entries_day_number_idx` - Fast day number queries

## Functions

### `calculate_user_streak(p_user_id UUID)`
Calculates the current streak for a user by counting consecutive days with completed entries.

## Notes

- Each user can have one entry per date (enforced by UNIQUE constraint)
- Entries are automatically linked to the authenticated user via RLS
- Streak is recalculated on each save
- Day number is calculated based on days since account creation (adjustable)





