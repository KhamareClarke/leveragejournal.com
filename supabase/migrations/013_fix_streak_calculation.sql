-- Fix streak calculation to only count if 3 consecutive days
-- Streak breaks if any day is missing, and only starts after 3 consecutive days

CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_has_entry BOOLEAN;
  v_consecutive_count INTEGER := 0;
BEGIN
  -- Check if today has an entry with content
  SELECT EXISTS(
    SELECT 1 FROM public.journal_entries 
    WHERE user_id = p_user_id 
    AND entry_date = v_current_date
    AND (
      gratitude IS NOT NULL AND gratitude != '' OR
      priority_1 IS NOT NULL AND priority_1 != '' OR
      priority_2 IS NOT NULL AND priority_2 != '' OR
      priority_3 IS NOT NULL AND priority_3 != '' OR
      reflection IS NOT NULL AND reflection != '' OR
      mood IS NOT NULL AND mood != '' OR
      (tasks IS NOT NULL AND jsonb_array_length(tasks) > 0)
    )
  ) INTO v_has_entry;
  
  -- If today doesn't have an entry, check yesterday
  IF NOT v_has_entry THEN
    v_current_date := v_current_date - INTERVAL '1 day';
    SELECT EXISTS(
      SELECT 1 FROM public.journal_entries 
      WHERE user_id = p_user_id 
      AND entry_date = v_current_date
      AND (
        gratitude IS NOT NULL AND gratitude != '' OR
        priority_1 IS NOT NULL AND priority_1 != '' OR
        priority_2 IS NOT NULL AND priority_2 != '' OR
        priority_3 IS NOT NULL AND priority_3 != '' OR
        reflection IS NOT NULL AND reflection != '' OR
        mood IS NOT NULL AND mood != '' OR
        (tasks IS NOT NULL AND jsonb_array_length(tasks) > 0)
      )
    ) INTO v_has_entry;
  END IF;
  
  -- Count consecutive days with entries going backwards
  -- Only count if we have at least 3 consecutive days
  WHILE v_consecutive_count < 90 LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.journal_entries 
      WHERE user_id = p_user_id 
      AND entry_date = v_current_date
      AND (
        gratitude IS NOT NULL AND gratitude != '' OR
        priority_1 IS NOT NULL AND priority_1 != '' OR
        priority_2 IS NOT NULL AND priority_2 != '' OR
        priority_3 IS NOT NULL AND priority_3 != '' OR
        reflection IS NOT NULL AND reflection != '' OR
        mood IS NOT NULL AND mood != '' OR
        (tasks IS NOT NULL AND jsonb_array_length(tasks) > 0)
      )
    ) INTO v_has_entry;
    
    IF NOT v_has_entry THEN
      -- If we found a gap, check if we had at least 3 consecutive days
      -- If yes, return the streak count; if no, return 0
      IF v_consecutive_count >= 3 THEN
        RETURN v_consecutive_count;
      ELSE
        RETURN 0;
      END IF;
    END IF;
    
    v_consecutive_count := v_consecutive_count + 1;
    v_current_date := v_current_date - INTERVAL '1 day';
  END LOOP;
  
  -- If we reached 90 days without gaps, return the count (if >= 3)
  IF v_consecutive_count >= 3 THEN
    RETURN v_consecutive_count;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql;

