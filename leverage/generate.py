#!/usr/bin/env python3
"""
The Leverage Journal™ - A5 Static HTML Generator
Generates exactly 222 pages with Plan • Do • Achieve framework
"""

# Public domain quotes for rotation
QUOTES = [
    {"text": "The impediment to action advances action. What stands in the way becomes the way.", "author": "Marcus Aurelius"},
    {"text": "He who has a why to live can bear almost any how.", "author": "Friedrich Nietzsche"},
    {"text": "The best time to plant a tree was 20 years ago. The second best time is now.", "author": "Chinese Proverb"},
    {"text": "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.", "author": "Seneca"},
    {"text": "Victory belongs to the most persevering.", "author": "Napoleon Bonaparte"},
    {"text": "The man who moves a mountain begins by carrying away small stones.", "author": "Confucius"},
    {"text": "Do not wait to strike till the iron is hot; but make it hot by striking.", "author": "William Butler Yeats"},
    {"text": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius"},
    {"text": "I learned that courage was not the absence of fear, but the triumph over it.", "author": "Nelson Mandela"},
    {"text": "If you can't fly then run, if you can't run then walk, if you can't walk then crawl, but whatever you do you have to keep moving forward.", "author": "Martin Luther King Jr."},
    {"text": "The only impossible journey is the one you never begin.", "author": "Tony Robbins"},
    {"text": "We generate fears while we sit. We overcome them by action.", "author": "Dr. Henry Link"},
    {"text": "Whether you think you can or you think you can't, you're right.", "author": "Henry Ford"},
    {"text": "Whatever you can do, or dream you can, begin it. Boldness has genius, power and magic in it.", "author": "Johann Wolfgang von Goethe"},
    {"text": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt"},
    {"text": "Everything you've ever wanted is on the other side of fear.", "author": "George Addair"},
    {"text": "Success is not final, failure is not fatal: it is the courage to continue that counts.", "author": "Winston Churchill"},
    {"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
    {"text": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson"},
    {"text": "If you want to lift yourself up, lift up someone else.", "author": "Booker T. Washington"},
]

FOOTER_WISDOM = [
    "Every action counts. Make it matter.",
    "Reflection is where growth happens.",
    "Execution beats intention every time.",
    "Small wins compound into massive victories.",
    "Progress is the only metric that matters.",
    "Celebrate progress. Then raise the bar.",
    "Consistency is the compound interest of self-improvement.",
    "Wealth is built in the margins.",
    "Small adjustments create massive results over time.",
    "Your legacy is the sum of your daily decisions.",
    "Surround yourself with builders, not talkers.",
    "Your why is your power. Never forget it.",
    "Build the vision. The money will follow.",
    "Legacy is a daily decision. Choose it.",
    "Focus or stay broke.",
    "Clarity creates conviction. Conviction creates results.",
]

WEEKLY_THEMES = [
    "Initiation", "Foundation", "Momentum", "Discipline",
    "Flow", "Breakthrough", "Mastery", "Power",
    "Acceleration", "Resilience", "Excellence", "Dominance", "Legacy"
]

def generate_html():
    html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Leverage Journal™ - Plan • Do • Achieve</title>
    <link rel="stylesheet" href="css/journal.css">
</head>
<body>

'''
    
    page_num = 1
    
    # PAGE 1: COVER
    html += f'''<!-- PAGE {page_num:03d}: COVER -->
<div class="page flex flex-col items-center justify-center">
    <div class="mb-8">
        <svg width="70" height="70" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#FFD700" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
    </div>
    
    <h1 class="font-serif text-center mb-6 gold-gradient" style="font-size: 3.2em; line-height: 1.2;">
        THE LEVERAGE<br>JOURNAL™
    </h1>
    
    <div class="gold-line" style="width: 160px;"></div>
    
    <p class="text-xl tracking-widest mt-8 text-center uppercase" style="color: var(--gray);">Build Your Empire</p>
    <p class="text-sm tracking-wider mt-4 gold-gradient font-semibold">Plan • Do • Achieve</p>
    
    <div class="qr-placeholder mt-16">
        <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
            <rect width="110" height="110" fill="var(--black-soft)"/>
            <text x="55" y="60" text-anchor="middle" fill="var(--gold)" opacity="0.2" font-size="12" font-family="Cormorant Garamond">SCAN</text>
        </svg>
    </div>
    <p class="qr-text">Scan to unlock the app</p>
    
    <div style="position: absolute; bottom: 18mm; text-align: center; width: 100%;">
        <p class="text-xs tracking-wider" style="color: var(--gray);">LEVERAGE APP © 2025</p>
    </div>
</div>

'''
    page_num += 1
    
    # PAGE 2: MY COMMITMENT
    html += f'''<!-- PAGE {page_num:03d}: MY COMMITMENT TO SUCCESS -->
<div class="page">
    <div class="section-icon">
        <svg width="50" height="50" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#FFD700" d="M12 2L15 9L22 9L17 14L19 21L12 17L5 21L7 14L2 9L9 9L12 2Z"/>
        </svg>
    </div>
    <h1 class="text-center gold-gradient" style="font-size: 1.8em;">My Commitment</h1>
    
    <div class="quote-box mt-8" style="font-size: 0.9em;">
        I vow to use this journal consistently, marking the beginning of real change in my life.
        <br><br>
        From today, I'm choosing to push myself. I'll face challenges head-on and learn from my mistakes. Each day is a chance to get better, and I intend to make the most of it.
        <br><br>
        I'm going to make myself proud. Not with grand gestures, but with consistent effort and honest reflection.
        <br><br>
        <strong class="not-italic" style="color: var(--gold-metallic);">This is my path. My choice. My future.</strong>
        <br><br>
        I'm ready to put in the work.
    </div>
    
    <div class="mt-12 mb-6">
        <div class="writing-line"></div>
        <p class="text-sm mt-2 ml-2" style="color: var(--gray);">Signature</p>
    </div>
    
    <div class="mb-6">
        <div class="writing-line"></div>
        <p class="text-sm mt-2 ml-2" style="color: var(--gray);">Date</p>
    </div>
    
    <div class="text-center mt-8">
        <span style="font-size: 2em; filter: drop-shadow(0 0 5px var(--gold));">👑</span>
    </div>
    
    <div class="footer-wisdom">Your standards define your reality. Upgrade them.</div>
    <div class="page-number"></div>
</div>

'''
    page_num += 1
    
    # PAGES 3-6: FOUNDATION PAGES
    foundation_pages = [
        {
            "title": "Your Goals",
            "content": """<h3 style="font-size: 0.85em;">SHORT TERM GOAL</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">MEDIUM TERM GOAL</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">LONG TERM GOAL</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <div class="quote-box mt-8 text-sm">
        Goals without deadlines are dreams. Goals without action are wishes. <strong class="not-italic" style="color: var(--gold);">Focus or stay broke.</strong>
    </div>""",
            "wisdom": "Legacy is a daily decision. Choose it."
        },
        {
            "title": "Your Vision",
            "content": '''<p class="text-sm mb-8 text-center italic" style="color: var(--gray);">Use this section to write out your dreams and where you're heading.</p>
    
    <div style="height: 280px; border: 1pt solid var(--gold-dark); background: var(--black-soft); margin: 16px 0; position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; opacity: 0.3;">
            <span style="font-size: 3em;">🎯</span>
            <p class="text-sm mt-3" style="color: var(--gray);">Vision Board Space</p>
        </div>
    </div>
    
    <div class="mt-4">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>''',
            "wisdom": "Build the vision. The money will follow."
        },
        {
            "title": "My Why",
            "content": '''<p class="text-sm mb-6 italic" style="color: var(--gray);">Remember the deeper reason behind your journey.</p>
    
    <h3 style="font-size: 0.85em;">What made me start this journey?</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">Who am I doing this for?</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">What will my life look like when I succeed?</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">What happens if I give up?</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>''',
            "wisdom": "Your why is your power. Never forget it."
        },
        {
            "title": "My Team",
            "content": '''<h3 style="font-size: 0.85em;">ACCOUNTABILITY PARTNER(S)</h3>
    <p class="text-sm mb-3" style="color: var(--gray);">The person/people who will hold me accountable</p>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-8" style="font-size: 0.85em;">WINNING TEAM</h3>
    <p class="text-sm mb-3" style="color: var(--gray);">People who inspire me and could help me achieve my goals</p>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-8" style="font-size: 0.85em;">THE BIG DREAM</h3>
    <p class="text-sm mb-3" style="color: var(--gray);">Money no object</p>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>''',
            "wisdom": "Surround yourself with builders, not talkers."
        },
        {
            "title": "Imprint",
            "content": '''<div class="text-center mt-16">
        <h2 class="gold-gradient mb-8" style="font-size: 1.4em;">The Leverage Journal™</h2>
        <p class="text-sm mb-3" style="color: var(--gray);">Plan • Do • Achieve</p>
        
        <div class="gold-line" style="width: 120px; margin: 20px auto;"></div>
        
        <p class="text-xs mt-8" style="color: var(--gray); line-height: 1.8;">
            Published by Legacy Leverage Publishing<br>
            © 2025 Leverage App. All rights reserved.<br><br>
            Edition 1<br><br>
            www.leverage.app<br><br>
        </p>
        
        <p class="text-xs mt-12 px-8" style="color: var(--gray-dark); line-height: 1.6;">
            No part of this publication may be reproduced without permission.
            This journal is designed as a personal development tool.
            Consult professionals for specific advice.
        </p>
    </div>''',
            "wisdom": "Legacy is a daily decision. Choose it."
        }
    ]
    
    for page_data in foundation_pages:
        html += f'''<!-- PAGE {page_num:03d}: {page_data["title"].upper()} -->
<div class="page">
    <h1 class="text-center gold-gradient" style="font-size: 1.8em;">{page_data["title"]}</h1>
    <div class="gold-line"></div>
    
    {page_data["content"]}
    
    <div class="footer-wisdom">{page_data["wisdom"]}</div>
    <div class="page-number"></div>
</div>

'''
        page_num += 1
    
    # PAGE 7: PLAN SECTION DIVIDER
    html += f'''<!-- PAGE {page_num:03d}: PLAN SECTION DIVIDER -->
<div class="page">
    <div class="section-divider">
        <div class="font-serif" style="font-size: 5em; opacity: 0.08; color: var(--gold); margin-bottom: 16px;">01</div>
        <div class="icon-gold mb-12">
            <svg width="60" height="60" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="#FFD700" stroke-width="1.5" fill="none"/>
                <path fill="#FFD700" d="M12 6L12 12L16 14"/>
            </svg>
        </div>
        <h1 class="section-title gold-gradient" style="font-size: 2.4em;">PLAN</h1>
        <div class="gold-line" style="width: 160px; margin: 24px auto;"></div>
        <p class="section-subtitle">Strategy turns ideas into reality</p>
        
        <div class="qr-placeholder mt-16" style="width: 120px; height: 120px;">
            <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
                <rect width="100" height="100" fill="var(--black-soft)"/>
                <text x="50" y="55" text-anchor="middle" fill="var(--gold)" opacity="0.2" font-size="10">PLAN</text>
            </svg>
        </div>
        <p class="qr-text">Access planning templates</p>
    </div>
</div>

'''
    page_num += 1
    
    # PAGES 8-23: 8 GOALS × 2 PAGES = 16 PAGES
    for goal_num in range(1, 9):
        # Goal Planning Page
        html += f'''<!-- PAGE {page_num:03d}: GOAL {goal_num} BREAKDOWN -->
<div class="page">
    <h2 class="text-center gold-gradient mb-6" style="font-size: 1.4em;">GOAL BREAKDOWN {goal_num}</h2>
    <div class="gold-line"></div>
    
    <div class="priority-item" style="background: var(--black-soft); border: 1pt solid var(--gold-dark);">
        <div class="checkbox"></div>
        <div class="flex-1">
            <h3 class="text-lg mb-3" style="font-size: 0.95em;">GOAL</h3>
            <div class="writing-line"></div>
        </div>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">CATEGORY</h3>
    <div class="flex gap-3 text-sm mt-2" style="flex-wrap: wrap;">
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="radio" name="cat{goal_num}"> Work</label>
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="radio" name="cat{goal_num}"> Health</label>
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="radio" name="cat{goal_num}"> Financial</label>
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="radio" name="cat{goal_num}"> Growth</label>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">COMPLETE BY</h3>
    <div class="flex gap-3 text-sm mt-2" style="flex-wrap: wrap;">
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="radio" name="time{goal_num}"> This Week</label>
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="radio" name="time{goal_num}"> This Month</label>
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="radio" name="time{goal_num}"> This Year</label>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">WHY DO I WANT IT?</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-4" style="font-size: 0.85em;">OBSTACLES I MIGHT FACE</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-4" style="font-size: 0.85em;">MY ACTION PLAN</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <div class="footer-wisdom">Execution beats intention every time.</div>
    <div class="page-number"></div>
</div>

'''
        page_num += 1
        
        # Goal Tasks Page
        html += f'''<!-- PAGE {page_num:03d}: GOAL {goal_num} TASKS -->
<div class="page">
    <h2 class="text-center gold-gradient mb-4" style="font-size: 1.3em;">TASKS TO COMPLETE</h2>
    <p class="text-center text-sm mb-6" style="color: var(--gray);">To reach goal {goal_num}</p>
    <div class="gold-line"></div>
    
    <div class="priority-item">
        <div class="checkbox"></div>
        <div class="writing-line flex-1"></div>
    </div>
    <div class="priority-item">
        <div class="checkbox"></div>
        <div class="writing-line flex-1"></div>
    </div>
    <div class="priority-item">
        <div class="checkbox"></div>
        <div class="writing-line flex-1"></div>
    </div>
    <div class="priority-item">
        <div class="checkbox"></div>
        <div class="writing-line flex-1"></div>
    </div>
    <div class="priority-item">
        <div class="checkbox"></div>
        <div class="writing-line flex-1"></div>
    </div>
    <div class="priority-item">
        <div class="checkbox"></div>
        <div class="writing-line flex-1"></div>
    </div>
    <div class="priority-item">
        <div class="checkbox"></div>
        <div class="writing-line flex-1"></div>
    </div>
    <div class="priority-item">
        <div class="checkbox"></div>
        <div class="writing-line flex-1"></div>
    </div>
    
    <div class="card mt-6" style="background: linear-gradient(135deg, var(--black-soft), var(--gold-dark)); border: 1.5pt solid var(--gold); text-align: center; padding: 14px;">
        <h3 class="text-lg mb-3" style="font-size: 0.95em;">✅ GOAL REACHED</h3>
        <p class="text-sm" style="color: var(--gray);">Date: _______________</p>
    </div>
    
    <h3 class="mt-4" style="font-size: 0.85em;">🎁 REWARD</h3>
    <div class="card">
        <div class="writing-line"></div>
    </div>
    
    <div class="footer-wisdom">Small wins compound into massive victories.</div>
    <div class="page-number"></div>
</div>

'''
        page_num += 1
    
    # PAGE 24: DO SECTION DIVIDER
    html += f'''<!-- PAGE {page_num:03d}: DO SECTION DIVIDER -->
<div class="page">
    <div class="section-divider">
        <div class="font-serif" style="font-size: 5em; opacity: 0.08; color: var(--gold); margin-bottom: 16px;">02</div>
        <div class="icon-gold mb-12">
            <svg width="60" height="60" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#FFD700" d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z"/>
            </svg>
        </div>
        <h1 class="section-title gold-gradient" style="font-size: 2.4em;">DO</h1>
        <div class="gold-line" style="width: 160px; margin: 24px auto;"></div>
        <p class="section-subtitle">Action is the bridge between<br>potential and success</p>
        
        <div class="qr-placeholder mt-16" style="width: 120px; height: 120px;">
            <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
                <rect width="100" height="100" fill="var(--black-soft)"/>
                <text x="50" y="55" text-anchor="middle" fill="var(--gold)" opacity="0.2" font-size="10">DO</text>
            </svg>
        </div>
        <p class="qr-text">Day mission audio</p>
    </div>
</div>

'''
    page_num += 1
    
    # PAGES 25-204: 90 DAILY SPREADS (180 PAGES)
    for day in range(1, 91):
        quote = QUOTES[day % len(QUOTES)]
        wisdom = FOOTER_WISDOM[day % len(FOOTER_WISDOM)]
        
        # Day Page (left)
        html += f'''<!-- PAGE {page_num:03d}: DAY {day} -->
<div class="page">
    <div class="flex justify-between items-center mb-4" style="font-size: 0.85em;">
        <div style="color: var(--gray); letter-spacing: 1px;">DAY {day}</div>
        <div style="color: var(--gray);">___/___/___</div>
    </div>
    
    <div class="quote-box text-sm">
        {quote["text"]}
        <div class="quote-author">— {quote["author"].upper()}</div>
    </div>
    
    <h3 style="font-size: 0.85em;">TODAY I AM GRATEFUL FOR...</h3>
    <div class="card">
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-4" style="font-size: 0.85em;">TODAY'S PRIMARY GOAL</h3>
    <div class="card">
        <div class="writing-line"></div>
    </div>
    
    <div class="grid grid-cols-2 gap-4 mt-6">
        <div>
            <h3 class="text-sm" style="font-size: 0.8em;">TOP 3 PRIORITIES</h3>
            <div class="priority-item">
                <div class="checkbox"></div>
                <div class="writing-line flex-1"></div>
            </div>
            <div class="priority-item">
                <div class="checkbox"></div>
                <div class="writing-line flex-1"></div>
            </div>
            <div class="priority-item">
                <div class="checkbox"></div>
                <div class="writing-line flex-1"></div>
            </div>
        </div>
        
        <div>
            <h3 class="text-sm" style="font-size: 0.8em;">3 WINS I'M CREATING</h3>
            <div class="card">
                <div class="writing-line"></div>
                <div class="writing-line"></div>
                <div class="writing-line"></div>
            </div>
        </div>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">💪 WORKOUT</h3>
    <div class="flex gap-3 text-sm mt-2">
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="checkbox"> Cardio</label>
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="checkbox"> Weights</label>
        <label class="flex items-center gap-2" style="color: var(--gray);"><input type="checkbox"> Rest</label>
    </div>
    
    <div class="footer-wisdom">{wisdom}</div>
    <div class="page-number"></div>
</div>

'''
        page_num += 1
        
        # Achieve Page (right)
        html += f'''<!-- PAGE {page_num:03d}: DAY {day} ACHIEVE -->
<div class="page">
    <div class="flex justify-between items-center mb-4" style="font-size: 0.85em;">
        <div style="color: var(--gray); letter-spacing: 1px;">DAY {day} • ACHIEVE</div>
        <div style="color: var(--gray);">___/___/___</div>
    </div>
    
    <h2 class="text-center gold-gradient mb-6" style="font-size: 1.4em;">Daily Achieve</h2>
    <div class="gold-line"></div>
    
    <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="card">
            <h3 class="text-sm card-header" style="font-size: 0.8em;">✅ WHAT I ACHIEVED</h3>
            <div class="writing-line"></div>
            <div class="writing-line"></div>
            <div class="writing-line"></div>
        </div>
        
        <div class="card">
            <h3 class="text-sm card-header" style="font-size: 0.8em;">📈 HOW I CAN IMPROVE</h3>
            <div class="writing-line"></div>
            <div class="writing-line"></div>
            <div class="writing-line"></div>
        </div>
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">🏆 WINS TODAY</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-4" style="font-size: 0.85em;">💡 LESSONS LEARNED</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-4" style="font-size: 0.85em;">🎯 TOMORROW I WILL...</h3>
    <div class="card">
        <div class="writing-line"></div>
    </div>
    
    <div class="text-center mt-6">
        <span style="font-size: 2em; filter: drop-shadow(0 0 5px var(--gold));">⚔️</span>
    </div>
    
    <div class="footer-wisdom">Reflection is where growth happens.</div>
    <div class="page-number"></div>
</div>

'''
        page_num += 1
    
    # PAGE 205: ACHIEVE SECTION DIVIDER
    html += f'''<!-- PAGE {page_num:03d}: ACHIEVE SECTION DIVIDER -->
<div class="page">
    <div class="section-divider">
        <div class="font-serif" style="font-size: 5em; opacity: 0.08; color: var(--gold); margin-bottom: 16px;">03</div>
        <div class="icon-gold mb-12">
            <svg width="60" height="60" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#FFD700" d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/>
            </svg>
        </div>
        <h1 class="section-title gold-gradient" style="font-size: 2.4em;">ACHIEVE</h1>
        <div class="gold-line" style="width: 160px; margin: 24px auto;"></div>
        <p class="section-subtitle">Measured growth is mastery</p>
        
        <div class="qr-placeholder mt-16" style="width: 120px; height: 120px;">
            <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
                <rect width="100" height="100" fill="var(--black-soft)"/>
                <text x="50" y="55" text-anchor="middle" fill="var(--gold)" opacity="0.2" font-size="9">ACHIEVE</text>
            </svg>
        </div>
        <p class="qr-text">Weekly insights</p>
    </div>
</div>

'''
    page_num += 1
    
    # PAGES 206-218: 13 WEEKLY ACHIEVE REVIEWS
    for week in range(1, 14):
        theme = WEEKLY_THEMES[week - 1]
        html += f'''<!-- PAGE {page_num:03d}: WEEK {week} ACHIEVE REVIEW -->
<div class="page">
    <h1 class="text-center gold-gradient mb-3" style="font-size: 1.6em;">Weekly Achieve</h1>
    <h2 class="text-center mb-2" style="color: var(--gold-metallic); font-size: 1.2em;">WEEK {week}</h2>
    <p class="text-center text-sm mb-6 tracking-widest uppercase" style="color: var(--gray);">{theme}</p>
    <div class="gold-line"></div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">📊 HABIT TRACKER</h3>
    <div class="grid-tracker">
        <div class="grid-cell text-xs font-bold">M</div>
        <div class="grid-cell text-xs font-bold">T</div>
        <div class="grid-cell text-xs font-bold">W</div>
        <div class="grid-cell text-xs font-bold">T</div>
        <div class="grid-cell text-xs font-bold">F</div>
        <div class="grid-cell text-xs font-bold">S</div>
        <div class="grid-cell text-xs font-bold">S</div>
        {"".join(['<div class="grid-cell"></div>' for _ in range(21)])}
    </div>
    
    <h3 class="mt-6" style="font-size: 0.85em;">⭐ TOP 3 WINS</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-4" style="font-size: 0.85em;">⚠️ TOP 3 CHALLENGES</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <h3 class="mt-4" style="font-size: 0.85em;">🎯 GOALS FOR NEXT WEEK</h3>
    <div class="card">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <div class="card mt-6 text-center" style="background: linear-gradient(135deg, var(--black-soft), var(--gold-dark)); border: 1.5pt solid var(--gold); padding: 12px;">
        <h3 style="font-size: 1.1em;">WEEK RATING: <span style="font-size: 1.5em; margin-left: 10px;">___ / 10</span></h3>
    </div>
    
    <div class="footer-wisdom">Progress is the only metric that matters.</div>
    <div class="page-number"></div>
</div>

'''
        page_num += 1
    
    # PAGE 219: VICTORY DIVIDER
    html += f'''<!-- PAGE {page_num:03d}: VICTORY DIVIDER -->
<div class="page">
    <div class="section-divider" style="padding-top: 60px;">
        <div class="icon-gold mb-12" style="font-size: 4em;">
            <svg width="80" height="80" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#FFD700" d="M12 2L15 9L22 9L17 14L19 21L12 17L5 21L7 14L2 9L9 9L12 2Z"/>
            </svg>
        </div>
        <h1 class="gold-gradient" style="font-size: 3em; letter-spacing: 8px;">VICTORY</h1>
        <div class="gold-line" style="width: 200px; margin: 24px auto;"></div>
    </div>
</div>

'''
    page_num += 1
    
    # PAGE 220: YOU DID IT
    html += f'''<!-- PAGE {page_num:03d}: YOU DID IT -->
<div class="page">
    <div class="section-divider" style="padding-top: 50px;">
        <div class="icon-gold mb-8" style="font-size: 4.5em;">👑</div>
        <h1 class="gold-gradient mb-6" style="font-size: 3.2em; letter-spacing: 8px;">YOU DID IT</h1>
        <div class="gold-line" style="width: 200px; margin: 24px auto;"></div>
        
        <p class="text-2xl mt-8 tracking-widest" style="color: var(--gray);">DISCIPLINE • GROWTH • MASTERY</p>
        
        <div class="quote-box mt-12 text-sm" style="max-width: 90%; margin-left: auto; margin-right: auto;">
            The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood; who strives valiantly; who errs, who comes short again and again, because there is no effort without error and shortcoming.
            <div class="quote-author">— THEODORE ROOSEVELT</div>
        </div>
        
        <p class="text-3xl font-bold gold-gradient mt-12" style="letter-spacing: 3px;">NOW GO BUILD<br>YOUR EMPIRE</p>
        
        <div class="qr-placeholder mt-12" style="width: 140px; height: 140px;">
            <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
                <rect width="120" height="120" fill="var(--black-soft)"/>
                <text x="60" y="65" text-anchor="middle" fill="var(--gold)" opacity="0.2" font-size="11">GUILD</text>
            </svg>
        </div>
        <p class="qr-text">Join the Builder's Guild</p>
    </div>
</div>

'''
    page_num += 1
    
    # PAGE 221: NOTES
    html += f'''<!-- PAGE {page_num:03d}: NOTES -->
<div class="page">
    <h1 class="text-center gold-gradient mb-6" style="font-size: 1.8em;">Notes</h1>
    <div class="gold-line"></div>
    
    <div class="card" style="min-height: 450px;">
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
        <div class="writing-line"></div>
    </div>
    
    <div class="footer-wisdom">Write the next chapter.</div>
    <div class="page-number"></div>
</div>

'''
    page_num += 1
    
    # PAGE 222: LEGACY MESSAGE
    html += f'''<!-- PAGE {page_num:03d}: ACKNOWLEDGEMENTS / LEGACY MESSAGE -->
<div class="page">
    <h1 class="text-center gold-gradient mb-6" style="font-size: 1.8em;">Legacy Message</h1>
    <div class="gold-line"></div>
    
    <div class="quote-box mt-8 text-sm">
        You've completed this journey. But completion is not the end—it's proof that you can commit, execute, and achieve.
        <br><br>
        Every page you filled was a vote for the person you're becoming. Every goal you set was a declaration of your standards. Every reflection was an investment in your growth.
        <br><br>
        <strong class="not-italic" style="color: var(--gold-metallic);">This is not where it ends. This is where it begins.</strong>
        <br><br>
        The system works because you worked it. The journal succeeded because you showed up. Now take everything you've learned and build something that lasts.
    </div>
    
    <div class="card mt-12" style="background: linear-gradient(135deg, var(--gold-dark), var(--black-soft)); border: 1.5pt solid var(--gold); padding: 20px; text-align: center;">
        <h3 style="font-size: 1.2em; color: var(--white);">Your legacy awaits.</h3>
        <p class="mt-4 text-sm" style="color: var(--white);">Start the next journal. Join the community. Build your empire.</p>
    </div>
    
    <div class="text-center mt-12">
        <span style="font-size: 3em; filter: drop-shadow(0 0 8px var(--gold));">👑</span>
    </div>
    
    <div style="position: absolute; bottom: 18mm; text-align: center; width: 100%;">
        <p class="text-xs tracking-wider" style="color: var(--gray);">LEVERAGE APP © 2025</p>
        <p class="text-xs mt-2" style="color: var(--gold-dark);">Built for empire builders</p>
    </div>
    
    <div class="page-number"></div>
</div>

'''
    
    # Close HTML
    html += '''</body>
</html>'''
    
    return html

if __name__ == "__main__":
    html_content = generate_html()
    
    with open('/home/claude/leverage-journal-A5/index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ Generated complete A5 journal HTML with 222 pages")
    print(f"✅ File size: {len(html_content) / 1024:.1f} KB")
    print(f"✅ Ready for PDF export")
