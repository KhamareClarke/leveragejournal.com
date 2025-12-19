// THE LEVERAGE JOURNAL™ - MASTER EDITION GENERATOR
// Complete restructured version with proper chapters and organization

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    generateMasterJournal();
});

function generateMasterJournal() {
    const container = document.getElementById('journal-content');
    
    let html = '';
    
    // Generate all sections in order
    html += generateFrontMatter();
    html += generateChapter1Vision();
    html += generateChapter1VisionComplete();
    html += generateChapter2Plan();
    html += generateChapter3Do();
    html += generateChapter4Review();
    html += generateChapter5Legacy();
    html += generateBackMatter();
    
    container.innerHTML = html;
    
    // Initialize interactive elements
    initializeInteractiveElements();
}

// FRONT MATTER GENERATION
function generateFrontMatter() {
    return `
    <!-- PAGE 005: INTRODUCTION - WHAT IS THE LEVERAGE SYSTEM -->
    <div class="page">
        <div class="philosophy-section">
            <h1 class="philosophy-title">What Is The Leverage System?</h1>
            
            <div class="philosophy-essay">
                <p><span class="first-letter">L</span>everage is the art of achieving maximum results with minimum effort. It is the difference between working hard and working smart, between surviving and thriving, between dreaming and building empires.</p>
                
                <p>The Leverage System is a complete ecosystem that bridges the physical and digital worlds. This journal serves as your analog interface to digital intelligence, where every page connects to powerful app features that amplify your progress.</p>
                
                <div class="system-components" style="margin: 2rem 0;">
                    <div class="component">
                        <strong style="color: var(--gold);">📖 JOURNAL</strong> = Mind Discipline & Daily Practice
                    </div>
                    <div class="component">
                        <strong style="color: var(--gold);">📱 APP</strong> = Data Intelligence & Pattern Recognition
                    </div>
                    <div class="component">
                        <strong style="color: var(--gold);">🤖 COPILOT</strong> = AI Accountability & Optimization
                    </div>
                    <div class="component">
                        <strong style="color: var(--gold);">👥 GUILD</strong> = Community & Mastermind Network
                    </div>
                </div>
                
                <p>Together, these elements create a lifestyle operating system that makes success systematic and inevitable. You are not just filling pages—you are programming your future.</p>
                
                <div class="qr-enhanced">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="var(--black)">
                        <rect width="80" height="80" fill="var(--black)" rx="4"/>
                        <rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--gold)" stroke-width="2"/>
                        <text x="40" y="45" text-anchor="middle" fill="var(--gold)" font-size="8">QR_01</text>
                    </svg>
                    <div class="qr-caption">Download the Leverage App<br><code>leverage.app/download</code></div>
                </div>
            </div>
        </div>
        
        <div class="page-number">005</div>
        <div class="footer-wisdom">"Systems create freedom. Technology amplifies wisdom." — Khamare Clarke</div>
    </div>
    
    <!-- PAGE 006: PHILOSOPHY - WHY LEVERAGE CHANGES EVERYTHING -->
    <div class="page">
        <div class="philosophy-section">
            <h1 class="philosophy-title">Why Leverage Changes Everything</h1>
            
            <div class="philosophy-essay">
                <p><span class="first-letter">I</span>n 1665, Isaac Newton discovered that a small force applied at the right point could move the world. This principle of leverage extends far beyond physics. It is the fundamental law of all achievement.</p>
                
                <p>Consider the greatest empires in history. They were not built by those who worked the hardest, but by those who worked the smartest. Alexander the Great leveraged military strategy. The Medici family leveraged financial systems. Steve Jobs leveraged design principles. Each understood that extraordinary results come from finding the right leverage points.</p>
                
                <p>In your life, leverage appears in many forms:</p>
                
                <ul class="leverage-list">
                    <li><strong>Time Leverage:</strong> Systems that work while you sleep</li>
                    <li><strong>Knowledge Leverage:</strong> Skills that compound over decades</li>
                    <li><strong>Network Leverage:</strong> Relationships that open impossible doors</li>
                    <li><strong>Capital Leverage:</strong> Money that generates more money</li>
                    <li><strong>Technology Leverage:</strong> Tools that amplify your capabilities</li>
                </ul>
                
                <p>This journal teaches you to identify and create leverage in every area of your life. Each daily practice builds compound momentum. Each reflection deepens your strategic thinking. Each goal becomes a lever for the next level of achievement.</p>
                
                <div class="reflection-prompt">
                    <strong>Reflection:</strong> Where in your life could you apply more leverage to achieve 10x results with the same effort?
                </div>
            </div>
        </div>
        
        <div class="page-number">006</div>
        <div class="footer-wisdom">"Give me a lever long enough and a fulcrum on which to place it, and I shall move the world." — Archimedes</div>
    </div>`;
}

// Continue with other functions...
function generateChapter1Vision() {
    return `
    <!-- CHAPTER 1 DIVIDER -->
    <div class="page chapter-divider flex flex-col items-center justify-center">
        <div class="chapter-icon mb-8">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="var(--gold)" stroke-width="2"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.523 19 3.732 16.057 2.458 12Z" stroke="var(--gold)" stroke-width="2"/>
            </svg>
        </div>
        
        <h1 class="font-serif text-center gold-gradient mb-6" style="font-size: 4rem; line-height: 1;">
            CHAPTER 1
        </h1>
        
        <h2 class="text-center gold-gradient mb-8" style="font-size: 2.5rem; font-weight: 300;">
            VISION
        </h2>
        
        <div class="gold-line mb-8" style="width: 250px;"></div>
        
        <p class="text-center text-xl mb-8" style="color: var(--gray-light); line-height: 1.6; max-width: 500px;">
            Every empire begins with a vision.<br>
            Every vision begins with clarity.<br>
            <span class="gold-gradient font-semibold">Every clarity begins with focus.</span>
        </p>
        
        <div class="qr-enhanced">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="var(--black)">
                <rect width="80" height="80" fill="var(--black)" rx="4"/>
                <rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--gold)" stroke-width="2"/>
                <text x="40" y="45" text-anchor="middle" fill="var(--gold)" font-size="8">QR_02</text>
            </svg>
            <div class="qr-caption">Access Vision Board<br><code>leverage.app/vision</code></div>
        </div>
        
        <div class="page-number">008</div>
    </div>`;
}

// Continue Chapter 1 - VISION
function generateChapter1VisionComplete() {
    return `
    <!-- PAGE 009: THE LAW OF LEVERAGE -->
    <div class="page">
        <div class="philosophy-section">
            <h1 class="philosophy-title">The Law of Leverage</h1>
            
            <div class="philosophy-essay">
                <p><span class="first-letter">S</span>mall, consistent actions compound into legacy. This is the Law of Leverage—the understanding that extraordinary results are not born from extraordinary moments, but from ordinary moments executed extraordinarily well.</p>
                
                <p>Every empire was built one decision at a time. Every fortune was accumulated one dollar at a time. Every masterpiece was created one brushstroke at a time. The magic is not in the magnitude of the action, but in the consistency of its application.</p>
                
                <p>When you write in this journal each day, you are not merely recording thoughts—you are programming your subconscious mind for success. You are creating new neural pathways. You are becoming the person who achieves what you once only dreamed.</p>
                
                <div class="law-principle" style="background: var(--black-card); padding: 1.5rem; border-left: 4px solid var(--gold); margin: 2rem 0;">
                    <h4 style="color: var(--gold); margin-bottom: 1rem;">The Compound Effect Formula</h4>
                    <p style="color: var(--gray-light);">Small Smart Choices + Consistency + Time = Radical Difference</p>
                </div>
                
                <div class="reflection-prompt">
                    <strong>Reflection:</strong> What daily habit, if practiced consistently for 90 days, would most transform your life?
                </div>
            </div>
        </div>
        
        <div class="page-number">009</div>
        <div class="footer-wisdom">"Do it once properly, and it works for you forever." — Khamare Clarke</div>
    </div>
    
    <!-- PAGE 010: FREEDOM THROUGH FOCUS -->
    <div class="page">
        <div class="philosophy-section">
            <h1 class="philosophy-title">Freedom Through Focus</h1>
            
            <div class="philosophy-essay">
                <p><span class="first-letter">F</span>reedom is not the absence of constraints—it is the intelligent application of constraints to create unlimited possibilities. Steve Jobs understood this when he limited Apple's focus to just three priorities at any given time. This constraint created the freedom to achieve perfection.</p>
                
                <p>In a world of infinite distractions, focus becomes your competitive advantage. While others scatter their energy across a thousand possibilities, you concentrate your power on the few that matter most. This is not limitation—this is liberation.</p>
                
                <p>Each day in this journal, you will identify your three most important tasks. Not ten. Not five. Three. This constraint will free you from the tyranny of the urgent and elevate you to the realm of the important.</p>
                
                <div class="focus-framework" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0;">
                    <div class="focus-item" style="text-align: center; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                        <div style="color: var(--gold); font-size: 2rem; margin-bottom: 0.5rem;">🎯</div>
                        <h4 style="color: var(--gold-light);">Priority 1</h4>
                        <p style="color: var(--gray); font-size: 0.9rem;">Most Important</p>
                    </div>
                    <div class="focus-item" style="text-align: center; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                        <div style="color: var(--gold); font-size: 2rem; margin-bottom: 0.5rem;">⚡</div>
                        <h4 style="color: var(--gold-light);">Priority 2</h4>
                        <p style="color: var(--gray); font-size: 0.9rem;">High Impact</p>
                    </div>
                    <div class="focus-item" style="text-align: center; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                        <div style="color: var(--gold); font-size: 2rem; margin-bottom: 0.5rem;">🚀</div>
                        <h4 style="color: var(--gold-light);">Priority 3</h4>
                        <p style="color: var(--gray); font-size: 0.9rem;">Strategic Move</p>
                    </div>
                </div>
                
                <div class="reflection-prompt">
                    <strong>Reflection:</strong> What would you accomplish if you could maintain laser focus for the next 90 days?
                </div>
            </div>
        </div>
        
        <div class="page-number">010</div>
        <div class="footer-wisdom">"Focus is the art of knowing what to ignore." — Khamare Clarke</div>
    </div>`;
}

// CHAPTER 2 - PLAN
function generateChapter2Plan() {
    return `
    <!-- CHAPTER 2 DIVIDER -->
    <div class="page chapter-divider flex flex-col items-center justify-center">
        <div class="chapter-icon mb-8">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="var(--gold)" stroke-width="2"/>
            </svg>
        </div>
        
        <h1 class="font-serif text-center gold-gradient mb-6" style="font-size: 4rem; line-height: 1;">
            CHAPTER 2
        </h1>
        
        <h2 class="text-center gold-gradient mb-8" style="font-size: 2.5rem; font-weight: 300;">
            PLAN
        </h2>
        
        <div class="gold-line mb-8" style="width: 250px;"></div>
        
        <p class="text-center text-xl mb-8" style="color: var(--gray-light); line-height: 1.6; max-width: 500px;">
            Strategy is the foundation of victory.<br>
            Define your targets. Map your route.<br>
            <span class="gold-gradient font-semibold">Execute with precision.</span>
        </p>
        
        <div class="qr-enhanced">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="var(--black)">
                <rect width="80" height="80" fill="var(--black)" rx="4"/>
                <rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--gold)" stroke-width="2"/>
                <text x="40" y="45" text-anchor="middle" fill="var(--gold)" font-size="8">QR_03</text>
            </svg>
            <div class="qr-caption">Access Plan Dashboard<br><code>leverage.app/plan</code></div>
        </div>
        
        <div class="page-number">017</div>
    </div>
    
    <!-- PAGE 018: THE 12 LAWS OF LEVERAGE -->
    <div class="page">
        <div class="philosophy-section">
            <h1 class="philosophy-title">The 12 Laws of Leverage</h1>
            
            <div class="philosophy-essay">
                <p><span class="first-letter">T</span>hese twelve laws form the foundation of all strategic thinking. Master them, and you master the art of achieving maximum results with minimum effort.</p>
                
                <div class="laws-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin: 2rem 0;">
                    <div class="law-item" style="background: var(--black-card); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--gold);">
                        <h4 style="color: var(--gold); margin-bottom: 0.5rem;">1. Compound Focus</h4>
                        <p style="color: var(--gray-light); font-size: 0.9rem;">Small, consistent actions compound exponentially over time.</p>
                    </div>
                    
                    <div class="law-item" style="background: var(--black-card); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--gold);">
                        <h4 style="color: var(--gold); margin-bottom: 0.5rem;">2. Strategic Constraint</h4>
                        <p style="color: var(--gray-light); font-size: 0.9rem;">Intelligent limitations create unlimited possibilities.</p>
                    </div>
                    
                    <div class="law-item" style="background: var(--black-card); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--gold);">
                        <h4 style="color: var(--gold); margin-bottom: 0.5rem;">3. Momentum Multiplication</h4>
                        <p style="color: var(--gray-light); font-size: 0.9rem;">Success accelerates success through systematic momentum.</p>
                    </div>
                    
                    <div class="law-item" style="background: var(--black-card); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--gold);">
                        <h4 style="color: var(--gold); margin-bottom: 0.5rem;">4. System Supremacy</h4>
                        <p style="color: var(--gray-light); font-size: 0.9rem;">Systems beat goals. Process beats passion.</p>
                    </div>
                    
                    <div class="law-item" style="background: var(--black-card); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--gold);">
                        <h4 style="color: var(--gold); margin-bottom: 0.5rem;">5. Identity Transformation</h4>
                        <p style="color: var(--gray-light); font-size: 0.9rem;">Change who you are, not just what you do.</p>
                    </div>
                    
                    <div class="law-item" style="background: var(--black-card); padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--gold);">
                        <h4 style="color: var(--gold); margin-bottom: 0.5rem;">6. Environmental Design</h4>
                        <p style="color: var(--gray-light); font-size: 0.9rem;">Shape your environment to shape your behavior.</p>
                    </div>
                </div>
                
                <p style="text-align: center; color: var(--gold-light); font-style: italic;">The remaining six laws continue on the following pages...</p>
            </div>
        </div>
        
        <div class="page-number">018</div>
        <div class="footer-wisdom">"Principles are the territory. Practices are the map." — Khamare Clarke</div>
    </div>`;
}
// CHAPTER 3 - DO (90 Daily Pages)
function generateChapter3Do() {
    let html = `
    <!-- CHAPTER 3 DIVIDER -->
    <div class="page chapter-divider flex flex-col items-center justify-center">
        <div class="chapter-icon mb-8">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="var(--gold)" stroke-width="2" fill="var(--gold)" opacity="0.1"/>
            </svg>
        </div>
        
        <h1 class="font-serif text-center gold-gradient mb-6" style="font-size: 4rem; line-height: 1;">
            CHAPTER 3
        </h1>
        
        <h2 class="text-center gold-gradient mb-8" style="font-size: 2.5rem; font-weight: 300;">
            DO
        </h2>
        
        <div class="gold-line mb-8" style="width: 250px;"></div>
        
        <p class="text-center text-xl mb-8" style="color: var(--gray-light); line-height: 1.6; max-width: 500px;">
            Excellence is not an act, but a habit.<br>
            Execute with intention.<br>
            <span class="gold-gradient font-semibold">Transform through action.</span>
        </p>
        
        <div class="qr-enhanced">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="var(--black)">
                <rect width="80" height="80" fill="var(--black)" rx="4"/>
                <rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--gold)" stroke-width="2"/>
                <text x="40" y="45" text-anchor="middle" fill="var(--gold)" font-size="8">QR_04</text>
            </svg>
            <div class="qr-caption">Sync with AI CoPilot<br><code>leverage.app/copilot</code></div>
        </div>
        
        <div class="page-number">022</div>
    </div>`;
    
    // Generate 90 unique daily pages
    const uniqueQuotes = [
        { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", lesson: "Action beats intention every time.", reflection: "What is one action you've been postponing that could change everything?" },
        { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", lesson: "Persistence is the ultimate leverage.", reflection: "How can you turn today's challenges into tomorrow's advantages?" },
        { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", lesson: "Starting is half the victory.", reflection: "What journey are you ready to begin today?" },
        { quote: "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.", author: "Aristotle", lesson: "Excellence is a system, not an event.", reflection: "How will you systematize excellence in your daily practice?" },
        { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", lesson: "Belief is the foundation of achievement.", reflection: "What dream deserves your unwavering belief today?" },
        { quote: "Discipline is the bridge between goals and accomplishment.", author: "Khamare Clarke", lesson: "Discipline transforms dreams into reality.", reflection: "Where do you need more discipline to bridge the gap to your goals?" },
        { quote: "Focus is not about doing more things right, but doing the right things.", author: "Khamare Clarke", lesson: "Clarity precedes mastery.", reflection: "What is the one right thing you must focus on today?" },
        { quote: "Momentum is built one decision at a time.", author: "Khamare Clarke", lesson: "Small choices compound into massive results.", reflection: "What decision will you make today to build unstoppable momentum?" }
    ];
    
    // Generate first 8 daily pages as examples
    for (let day = 1; day <= 8; day++) {
        const quote = uniqueQuotes[day - 1];
        const pageNumber = 22 + day;
        
        html += generateDailyPage(day, quote, pageNumber);
        
        // Add weekly review every 7th day
        if (day % 7 === 0) {
            html += generateWeeklyReview(Math.ceil(day / 7), pageNumber + 1);
        }
    }
    
    // Add placeholder for remaining days
    html += `
    <!-- REMAINING DAILY PAGES (Days 9-90) -->
    <div class="page placeholder-page flex flex-col items-center justify-center">
        <div class="section-icon mb-8">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="var(--gold)" stroke-width="2"/>
            </svg>
        </div>
        
        <h2 class="gold-gradient text-center mb-6" style="font-size: 2.5rem;">Days 9-90</h2>
        <div class="gold-line mb-6" style="width: 200px;"></div>
        
        <p class="text-center mb-8" style="color: var(--gray-light); max-width: 400px;">
            The remaining 82 daily pages follow the same structure with unique quotes, lessons, and reflections for each day.
        </p>
        
        <div class="structure-preview" style="background: var(--black-card); padding: 2rem; border-radius: 10px; max-width: 500px;">
            <h4 style="color: var(--gold); margin-bottom: 1rem;">Each Daily Page Includes:</h4>
            <ul style="color: var(--gray-light); line-height: 1.8;">
                <li>• Unique motivational quote with commentary</li>
                <li>• Reflection question for deep thinking</li>
                <li>• 3 Priority Tasks (Focus Framework)</li>
                <li>• Gratitude & Energy tracking</li>
                <li>• Daily review and next-day planning</li>
                <li>• QR sync with AI CoPilot</li>
            </ul>
        </div>
        
        <div class="page-number">031+</div>
    </div>`;
    
    return html;
}

function generateDailyPage(day, quote, pageNumber) {
    return `
    <!-- DAY ${day} -->
    <div class="page daily-page">
        <div class="daily-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div class="day-number" style="background: var(--gold); color: var(--black); padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold;">
                DAY ${day}
            </div>
            <div class="date-field" style="color: var(--gray); border-bottom: 1px solid var(--gray-dark); padding: 0.5rem; min-width: 200px;">
                Date: _______________
            </div>
        </div>
        
        <div class="quote-section" style="background: var(--black-card); padding: 1.5rem; border-radius: 10px; border-left: 4px solid var(--gold); margin-bottom: 2rem;">
            <blockquote style="color: var(--gold-light); font-size: 1.1rem; font-style: italic; margin-bottom: 1rem;">
                "${quote.quote}"
            </blockquote>
            <cite style="color: var(--gray); font-size: 0.9rem;">— ${quote.author}</cite>
            
            <div class="lesson" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-dark);">
                <strong style="color: var(--gold);">Today's Lesson:</strong> 
                <span style="color: var(--gray-light);">${quote.lesson}</span>
            </div>
        </div>
        
        <div class="reflection-box" style="background: var(--black-soft); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
            <h4 style="color: var(--gold); margin-bottom: 1rem;">🤔 Reflection</h4>
            <p style="color: var(--gray-light); margin-bottom: 1rem;">${quote.reflection}</p>
            <div class="writing-lines">
                <div class="writing-line"></div>
                <div class="writing-line"></div>
            </div>
        </div>
        
        <div class="priorities-section" style="margin-bottom: 2rem;">
            <h4 style="color: var(--gold); margin-bottom: 1rem;">🎯 Today's 3 Priorities</h4>
            <div class="priority-list">
                <div class="priority-item" style="display: flex; align-items: center; margin-bottom: 1rem; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                    <span style="color: var(--gold); margin-right: 1rem; font-weight: bold;">1.</span>
                    <div class="writing-line" style="flex: 1;"></div>
                </div>
                <div class="priority-item" style="display: flex; align-items: center; margin-bottom: 1rem; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                    <span style="color: var(--gold); margin-right: 1rem; font-weight: bold;">2.</span>
                    <div class="writing-line" style="flex: 1;"></div>
                </div>
                <div class="priority-item" style="display: flex; align-items: center; margin-bottom: 1rem; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                    <span style="color: var(--gold); margin-right: 1rem; font-weight: bold;">3.</span>
                    <div class="writing-line" style="flex: 1;"></div>
                </div>
            </div>
        </div>
        
        <div class="tracking-section" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
            <div class="tracker" style="text-align: center; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                <h5 style="color: var(--gold); margin-bottom: 0.5rem;">Energy</h5>
                <div style="color: var(--gray);">1 2 3 4 5</div>
            </div>
            <div class="tracker" style="text-align: center; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                <h5 style="color: var(--gold); margin-bottom: 0.5rem;">Mood</h5>
                <div style="color: var(--gray);">😞 😐 🙂 😊 🤩</div>
            </div>
            <div class="tracker" style="text-align: center; padding: 1rem; background: var(--black-card); border-radius: 8px;">
                <h5 style="color: var(--gold); margin-bottom: 0.5rem;">Focus</h5>
                <div style="color: var(--gray);">1 2 3 4 5</div>
            </div>
        </div>
        
        <div class="qr-sync" style="text-align: center; margin-bottom: 2rem;">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="var(--black)">
                <rect width="60" height="60" fill="var(--black)" rx="4"/>
                <rect x="8" y="8" width="44" height="44" fill="none" stroke="var(--gold)" stroke-width="2"/>
                <text x="30" y="35" text-anchor="middle" fill="var(--gold)" font-size="6">SYNC</text>
            </svg>
            <div style="color: var(--gray); font-size: 0.8rem; margin-top: 0.5rem;">Scan to sync with CoPilot</div>
        </div>
        
        <div class="page-number">${pageNumber}</div>
        <div class="footer-wisdom">"Progress, not perfection." — Khamare Clarke</div>
    </div>`;
}

function generateWeeklyReview(week, pageNumber) {
    return `
    <!-- WEEK ${week} REVIEW -->
    <div class="page weekly-review">
        <div class="section-icon mb-6">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17ZM17 21V11H13V7H7V19H17Z" stroke="var(--gold)" stroke-width="2"/>
            </svg>
        </div>
        
        <h1 class="text-center gold-gradient mb-6" style="font-size: 2.5rem;">WEEK ${week} REVIEW</h1>
        <div class="gold-line"></div>
        
        <div class="review-sections">
            <div class="review-section" style="margin-bottom: 2rem;">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">🏆 This Week's Biggest Wins</h3>
                <div class="writing-line"></div>
                <div class="writing-line"></div>
                <div class="writing-line"></div>
            </div>
            
            <div class="review-section" style="margin-bottom: 2rem;">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">📚 Key Lessons Learned</h3>
                <div class="writing-line"></div>
                <div class="writing-line"></div>
                <div class="writing-line"></div>
            </div>
            
            <div class="review-section">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">🎯 Next Week's Focus</h3>
                <div class="writing-line"></div>
                <div class="writing-line"></div>
                <div class="writing-line"></div>
            </div>
        </div>
        
        <div class="page-number">${pageNumber}</div>
        <div class="footer-wisdom">"Reflection turns experience into wisdom." — Khamare Clarke</div>
    </div>`;
}
// CHAPTER 4 - REVIEW
function generateChapter4Review() {
    return `
    <!-- CHAPTER 4 DIVIDER -->
    <div class="page chapter-divider flex flex-col items-center justify-center">
        <div class="chapter-icon mb-8">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="var(--gold)" stroke-width="2"/>
            </svg>
        </div>
        
        <h1 class="font-serif text-center gold-gradient mb-6" style="font-size: 4rem; line-height: 1;">
            CHAPTER 4
        </h1>
        
        <h2 class="text-center gold-gradient mb-8" style="font-size: 2.5rem; font-weight: 300;">
            REVIEW
        </h2>
        
        <div class="gold-line mb-8" style="width: 250px;"></div>
        
        <p class="text-center text-xl mb-8" style="color: var(--gray-light); line-height: 1.6; max-width: 500px;">
            Reflection turns experience into wisdom.<br>
            Measure what matters.<br>
            <span class="gold-gradient font-semibold">Optimize for excellence.</span>
        </p>
        
        <div class="qr-enhanced">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="var(--black)">
                <rect width="80" height="80" fill="var(--black)" rx="4"/>
                <rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--gold)" stroke-width="2"/>
                <text x="40" y="45" text-anchor="middle" fill="var(--gold)" font-size="8">QR_05</text>
            </svg>
            <div class="qr-caption">Access Progress Analytics<br><code>leverage.app/progress</code></div>
        </div>
        
        <div class="page-number">202</div>
    </div>
    
    <!-- PAGE 203: 90-DAY HABIT TRACKER -->
    <div class="page">
        <h1 class="text-center gold-gradient mb-6" style="font-size: 2.5rem;">90-DAY HABIT TRACKER</h1>
        <div class="gold-line"></div>
        
        <div class="habit-categories" style="margin: 2rem 0;">
            <div class="category-section" style="margin-bottom: 3rem;">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">💪 HEALTH & DISCIPLINE</h3>
                <div class="habit-grid" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; margin-bottom: 1rem;">
                    ${Array.from({length: 30}, (_, i) => `
                        <div class="habit-day" style="width: 25px; height: 25px; border: 1px solid var(--gold-dark); background: var(--black-card); display: flex; align-items: center; justify-content: center; font-size: 8px; color: var(--gray);">
                            ${i + 1}
                        </div>
                    `).join('')}
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.9rem; color: var(--gray-light);">
                    <div>□ Exercise</div>
                    <div>□ Meditation</div>
                    <div>□ Nutrition</div>
                </div>
            </div>
            
            <div class="category-section" style="margin-bottom: 3rem;">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">💰 WEALTH & BUSINESS</h3>
                <div class="habit-grid" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; margin-bottom: 1rem;">
                    ${Array.from({length: 30}, (_, i) => `
                        <div class="habit-day" style="width: 25px; height: 25px; border: 1px solid var(--gold-dark); background: var(--black-card); display: flex; align-items: center; justify-content: center; font-size: 8px; color: var(--gray);">
                            ${i + 31}
                        </div>
                    `).join('')}
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.9rem; color: var(--gray-light);">
                    <div>□ Revenue Work</div>
                    <div>□ Skill Building</div>
                    <div>□ Networking</div>
                </div>
            </div>
            
            <div class="category-section">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">🎯 FOCUS & LEARNING</h3>
                <div class="habit-grid" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; margin-bottom: 1rem;">
                    ${Array.from({length: 30}, (_, i) => `
                        <div class="habit-day" style="width: 25px; height: 25px; border: 1px solid var(--gold-dark); background: var(--black-card); display: flex; align-items: center; justify-content: center; font-size: 8px; color: var(--gray);">
                            ${i + 61}
                        </div>
                    `).join('')}
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.9rem; color: var(--gray-light);">
                    <div>□ Deep Work</div>
                    <div>□ Reading</div>
                    <div>□ Reflection</div>
                </div>
            </div>
        </div>
        
        <div class="page-number">203</div>
        <div class="footer-wisdom">"Consistency is the mother of mastery." — Khamare Clarke</div>
    </div>
    
    <!-- PAGE 204: PROGRESS ANALYTICS -->
    <div class="page">
        <h1 class="text-center gold-gradient mb-6" style="font-size: 2.5rem;">PROGRESS ANALYTICS</h1>
        <div class="gold-line"></div>
        
        <div class="analytics-sections">
            <div class="metric-section" style="background: var(--black-card); padding: 2rem; border-radius: 10px; margin-bottom: 2rem;">
                <h3 style="color: var(--gold); margin-bottom: 1.5rem;">📊 Transformation Metrics</h3>
                
                <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;">
                    <div class="metric">
                        <h4 style="color: var(--gold-light); margin-bottom: 0.5rem;">Health Score</h4>
                        <div style="color: var(--gray);">Start: ___/10 → End: ___/10</div>
                    </div>
                    <div class="metric">
                        <h4 style="color: var(--gold-light); margin-bottom: 0.5rem;">Wealth Progress</h4>
                        <div style="color: var(--gray);">Start: $_____ → End: $_____</div>
                    </div>
                    <div class="metric">
                        <h4 style="color: var(--gold-light); margin-bottom: 0.5rem;">Focus Level</h4>
                        <div style="color: var(--gray);">Start: ___/10 → End: ___/10</div>
                    </div>
                </div>
            </div>
            
            <div class="reflection-section" style="margin-bottom: 2rem;">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">🎯 90-Day Transformation Summary</h3>
                
                <div class="summary-item" style="margin-bottom: 2rem;">
                    <h4 style="color: var(--gold-light); margin-bottom: 1rem;">My Greatest Achievements:</h4>
                    <div class="writing-line"></div>
                    <div class="writing-line"></div>
                    <div class="writing-line"></div>
                </div>
                
                <div class="summary-item" style="margin-bottom: 2rem;">
                    <h4 style="color: var(--gold-light); margin-bottom: 1rem;">Key Lessons Learned:</h4>
                    <div class="writing-line"></div>
                    <div class="writing-line"></div>
                    <div class="writing-line"></div>
                </div>
                
                <div class="summary-item">
                    <h4 style="color: var(--gold-light); margin-bottom: 1rem;">What Needs Refinement:</h4>
                    <div class="writing-line"></div>
                    <div class="writing-line"></div>
                    <div class="writing-line"></div>
                </div>
            </div>
        </div>
        
        <div class="qr-enhanced" style="text-align: center;">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="var(--black)">
                <rect width="80" height="80" fill="var(--black)" rx="4"/>
                <rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--gold)" stroke-width="2"/>
                <text x="40" y="45" text-anchor="middle" fill="var(--gold)" font-size="8">QR_06</text>
            </svg>
            <div class="qr-caption">Upload to Legacy Capsule<br><code>leverage.app/legacy</code></div>
        </div>
        
        <div class="page-number">204</div>
        <div class="footer-wisdom">"What gets measured gets mastered." — Khamare Clarke</div>
    </div>`;
}

// CHAPTER 5 - LEGACY
function generateChapter5Legacy() {
    return `
    <!-- CHAPTER 5 DIVIDER -->
    <div class="page chapter-divider flex flex-col items-center justify-center">
        <div class="chapter-icon mb-8">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="var(--gold)" stroke-width="2" fill="var(--gold)" opacity="0.1"/>
            </svg>
        </div>
        
        <h1 class="font-serif text-center gold-gradient mb-6" style="font-size: 4rem; line-height: 1;">
            CHAPTER 5
        </h1>
        
        <h2 class="text-center gold-gradient mb-8" style="font-size: 2.5rem; font-weight: 300;">
            LEGACY
        </h2>
        
        <div class="gold-line mb-8" style="width: 250px;"></div>
        
        <p class="text-center text-xl mb-8" style="color: var(--gray-light); line-height: 1.6; max-width: 500px;">
            Your transformation is complete.<br>
            Your legacy begins now.<br>
            <span class="gold-gradient font-semibold">Build your empire.</span>
        </p>
        
        <div class="qr-enhanced">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="var(--black)">
                <rect width="80" height="80" fill="var(--black)" rx="4"/>
                <rect x="10" y="10" width="60" height="60" fill="none" stroke="var(--gold)" stroke-width="2"/>
                <text x="40" y="45" text-anchor="middle" fill="var(--gold)" font-size="8">QR_07</text>
            </svg>
            <div class="qr-caption">Join Builder's Guild<br><code>leverage.app/guild</code></div>
        </div>
        
        <div class="page-number">208</div>
    </div>
    
    <!-- PAGE 209: THE DIGITAL ALCHEMIST -->
    <div class="page">
        <div class="philosophy-section">
            <h1 class="philosophy-title">The Digital Alchemist</h1>
            <h2 style="color: var(--gold-light); text-align: center; margin-bottom: 2rem; font-style: italic;">Turning Action Into Freedom</h2>
            
            <div class="philosophy-essay">
                <p><span class="first-letter">Y</span>ou have completed something extraordinary. In a world where 92% of people abandon their goals, you have systematically transformed your life over 90 days. You are no longer the person who started this journal—you are the person who finishes what they start.</p>
                
                <p>The ancient alchemists sought to turn base metals into gold. You have achieved something far more valuable: you have turned daily actions into lasting transformation. Every page you filled, every reflection you wrote, every priority you completed has compounded into the person you are today.</p>
                
                <p>But this is not the end—it is the beginning. You now possess the most valuable asset in the modern world: a proven system for continuous improvement. You have become a Digital Alchemist, someone who can systematically transform any area of life through the marriage of ancient wisdom and modern technology.</p>
                
                <div class="transformation-summary" style="background: var(--black-card); padding: 2rem; border-radius: 10px; border-left: 4px solid var(--gold); margin: 2rem 0;">
                    <h4 style="color: var(--gold); margin-bottom: 1rem;">Your Alchemical Formula</h4>
                    <div style="color: var(--gray-light); line-height: 1.8;">
                        <p><strong style="color: var(--gold);">Vision</strong> + <strong style="color: var(--gold);">System</strong> + <strong style="color: var(--gold);">Consistency</strong> = <strong style="color: var(--gold);">Transformation</strong></p>
                        <p><strong style="color: var(--gold);">Analog Discipline</strong> + <strong style="color: var(--gold);">Digital Intelligence</strong> = <strong style="color: var(--gold);">Leverage</strong></p>
                        <p><strong style="color: var(--gold);">Individual Excellence</strong> + <strong style="color: var(--gold);">Community Power</strong> = <strong style="color: var(--gold);">Empire</strong></p>
                    </div>
                </div>
                
                <p>The world needs more Digital Alchemists—people who refuse to accept mediocrity, who understand that technology amplifies wisdom, and who build systems that create freedom. Your next 90 days await.</p>
                
                <div class="reflection-prompt">
                    <strong>Final Reflection:</strong> How will you use your newfound alchemical powers to transform not just your life, but the lives of others?
                </div>
            </div>
        </div>
        
        <div class="page-number">209</div>
        <div class="footer-wisdom">"The master has failed more times than the beginner has even tried." — Stephen McCranie</div>
    </div>
    
    <!-- PAGE 210: CERTIFICATE OF COMPLETION -->
    <div class="page certificate-page flex flex-col items-center justify-center">
        <div class="certificate-border" style="border: 3px solid var(--gold); padding: 3rem; border-radius: 15px; text-align: center; max-width: 500px;">
            <div class="crown-icon mb-6">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <path d="M5 16L3 7L8.5 10L12 4L15.5 10L21 7L19 16H5Z" stroke="var(--gold)" stroke-width="2" fill="var(--gold)" opacity="0.2"/>
                </svg>
            </div>
            
            <h1 style="color: var(--gold); font-size: 2rem; margin-bottom: 1rem; font-family: 'Cormorant Garamond', serif;">
                CERTIFICATE OF COMPLETION
            </h1>
            
            <div class="gold-line mb-4" style="width: 200px; margin: 0 auto;"></div>
            
            <p style="color: var(--gray-light); margin-bottom: 2rem; line-height: 1.6;">
                This certifies that
            </p>
            
            <div style="border-bottom: 2px solid var(--gold); padding: 1rem; margin-bottom: 2rem; min-width: 300px;">
                <span style="color: var(--gold); font-size: 1.2rem; font-weight: bold;">
                    [Your Name]
                </span>
            </div>
            
            <p style="color: var(--gray-light); margin-bottom: 2rem; line-height: 1.6;">
                has successfully completed<br>
                <strong style="color: var(--gold);">The Leverage Journal™</strong><br>
                90-Day Transformation System
            </p>
            
            <div style="margin-bottom: 2rem;">
                <p style="color: var(--gray); font-size: 0.9rem;">Completion Date:</p>
                <div style="border-bottom: 1px solid var(--gold-dark); padding: 0.5rem; margin: 0.5rem 0; min-width: 200px;">
                    _______________
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-top: 2rem;">
                <div>
                    <div style="border-bottom: 1px solid var(--gold-dark); padding: 0.5rem; margin-bottom: 0.5rem;"></div>
                    <p style="color: var(--gray); font-size: 0.8rem;">Your Signature</p>
                </div>
                <div>
                    <div style="border-bottom: 1px solid var(--gold-dark); padding: 0.5rem; margin-bottom: 0.5rem;"></div>
                    <p style="color: var(--gray); font-size: 0.8rem;">Accountability Partner</p>
                </div>
            </div>
        </div>
        
        <p style="color: var(--gold); margin-top: 2rem; font-style: italic;">
            "You are now a certified Digital Alchemist."
        </p>
        
        <div class="page-number">210</div>
    </div>
    
    <!-- PAGE 211: BUILDER'S GUILD INVITATION -->
    <div class="page flex flex-col items-center justify-center">
        <div class="guild-invitation" style="text-align: center; max-width: 500px;">
            <div class="guild-icon mb-8">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="var(--gold)" stroke-width="2"/>
                </svg>
            </div>
            
            <h1 class="gold-gradient mb-6" style="font-size: 3rem; font-family: 'Cormorant Garamond', serif;">
                Builder's Guild
            </h1>
            
            <div class="gold-line mb-6" style="width: 200px;"></div>
            
            <p style="color: var(--gray-light); font-size: 1.2rem; margin-bottom: 2rem; line-height: 1.6;">
                You have proven yourself worthy.<br>
                Join the elite community of empire builders.
            </p>
            
            <div class="guild-benefits" style="background: var(--black-card); padding: 2rem; border-radius: 10px; margin-bottom: 2rem;">
                <h3 style="color: var(--gold); margin-bottom: 1.5rem;">Exclusive Access To:</h3>
                <ul style="color: var(--gray-light); line-height: 2; text-align: left;">
                    <li>• Monthly mastermind sessions with Khamare Clarke</li>
                    <li>• Advanced AI CoPilot features and voice coaching</li>
                    <li>• Private community of verified high-achievers</li>
                    <li>• Exclusive challenges and growth competitions</li>
                    <li>• Early access to new Leverage System tools</li>
                    <li>• Accountability partner matching system</li>
                </ul>
            </div>
            
            <div class="application-qr" style="margin-bottom: 2rem;">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="var(--black)">
                    <rect width="100" height="100" fill="var(--black)" rx="8"/>
                    <rect x="15" y="15" width="70" height="70" fill="none" stroke="var(--gold)" stroke-width="3"/>
                    <text x="50" y="55" text-anchor="middle" fill="var(--gold)" font-size="10" font-weight="bold">APPLY</text>
                </svg>
                <div style="color: var(--gray); margin-top: 1rem;">
                    Scan to apply for membership<br>
                    <code style="color: var(--gold);">leverage.app/guild/apply</code>
                </div>
            </div>
            
            <p style="color: var(--gold); font-size: 1.1rem; font-weight: 600;">
                Application Required • Limited Membership
            </p>
        </div>
        
        <div class="page-number">211</div>
        <div class="footer-wisdom">"Excellence attracts excellence." — Khamare Clarke</div>
    </div>`;
}
// BACK MATTER
function generateBackMatter() {
    return `
    <!-- PAGE 212: INDEX -->
    <div class="page">
        <h1 class="text-center gold-gradient mb-6" style="font-size: 2.5rem;">INDEX</h1>
        <div class="gold-line"></div>
        
        <div class="index-content" style="columns: 2; column-gap: 2rem; margin-top: 2rem;">
            <div class="index-section">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">A</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Accountability Partner, 016</div>
                    <div>AI CoPilot, 022+</div>
                    <div>Alchemical Formula, 209</div>
                    <div>Analytics, 204</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">B</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Builder's Guild, 211</div>
                    <div>Business Habits, 203</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">C</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Certificate, 210</div>
                    <div>Chapter System, 008+</div>
                    <div>Compound Focus, 018</div>
                    <div>Consistency, 009</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">D</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Daily Pages, 022-201</div>
                    <div>Digital Alchemist, 209</div>
                    <div>Discipline, 203</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">E</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Energy Tracking, 022+</div>
                    <div>Excellence, 022</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">F</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Focus Framework, 010</div>
                    <div>Freedom Through Focus, 010</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">G-H</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Goals, 015</div>
                    <div>Habit Tracker, 203</div>
                    <div>Health Habits, 203</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">L</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Law of Leverage, 009</div>
                    <div>Laws (12), 018-020</div>
                    <div>Legacy, 208-211</div>
                    <div>Leverage System, 005</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">M</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Momentum Theory, 011</div>
                    <div>Mood Tracking, 022+</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">P-Q</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Philosophy, 006-011</div>
                    <div>Priorities (3), 022+</div>
                    <div>Progress Analytics, 204</div>
                    <div>QR Codes, 005+</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">R-S</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Reflection, 022+</div>
                    <div>Review Pages, 202-204</div>
                    <div>Strategic Constraint, 018</div>
                    <div>System Supremacy, 018</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">T-V</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Transformation, 202-211</div>
                    <div>Vision, 008-016</div>
                </div>
                
                <h3 style="color: var(--gold); margin: 1.5rem 0 1rem 0;">W</h3>
                <div class="index-items" style="color: var(--gray-light); line-height: 1.8; font-size: 0.9rem;">
                    <div>Weekly Reviews, Every 7th</div>
                    <div>Wealth Habits, 203</div>
                </div>
            </div>
        </div>
        
        <div class="page-number">212</div>
    </div>
    
    <!-- PAGE 213: GLOSSARY -->
    <div class="page">
        <h1 class="text-center gold-gradient mb-6" style="font-size: 2.5rem;">GLOSSARY</h1>
        <div class="gold-line"></div>
        
        <div class="glossary-content" style="margin-top: 2rem;">
            <div class="glossary-item" style="margin-bottom: 2rem;">
                <h4 style="color: var(--gold); margin-bottom: 0.5rem;">Digital Alchemist</h4>
                <p style="color: var(--gray-light); line-height: 1.6;">Someone who systematically transforms any area of life through the marriage of ancient wisdom and modern technology.</p>
            </div>
            
            <div class="glossary-item" style="margin-bottom: 2rem;">
                <h4 style="color: var(--gold); margin-bottom: 0.5rem;">Focus Framework</h4>
                <p style="color: var(--gray-light); line-height: 1.6;">The practice of limiting daily priorities to three most important tasks to maximize impact and minimize distraction.</p>
            </div>
            
            <div class="glossary-item" style="margin-bottom: 2rem;">
                <h4 style="color: var(--gold); margin-bottom: 0.5rem;">Leverage</h4>
                <p style="color: var(--gray-light); line-height: 1.6;">The art of achieving maximum results with minimum effort through intelligent application of systems, tools, and principles.</p>
            </div>
            
            <div class="glossary-item" style="margin-bottom: 2rem;">
                <h4 style="color: var(--gold); margin-bottom: 0.5rem;">Momentum Theory</h4>
                <p style="color: var(--gray-light); line-height: 1.6;">The principle that consistent small actions compound over time, creating unstoppable forward progress toward goals.</p>
            </div>
            
            <div class="glossary-item" style="margin-bottom: 2rem;">
                <h4 style="color: var(--gold); margin-bottom: 0.5rem;">Strategic Constraint</h4>
                <p style="color: var(--gray-light); line-height: 1.6;">Intelligent limitations that create unlimited possibilities by forcing focus on what matters most.</p>
            </div>
            
            <div class="glossary-item" style="margin-bottom: 2rem;">
                <h4 style="color: var(--gold); margin-bottom: 0.5rem;">System Supremacy</h4>
                <p style="color: var(--gray-light); line-height: 1.6;">The principle that well-designed systems consistently outperform individual motivation or willpower.</p>
            </div>
            
            <div class="glossary-item" style="margin-bottom: 2rem;">
                <h4 style="color: var(--gold); margin-bottom: 0.5rem;">Builder's Guild</h4>
                <p style="color: var(--gray-light); line-height: 1.6;">Elite community of verified high-achievers who have completed The Leverage Journal™ and committed to continuous empire building.</p>
            </div>
        </div>
        
        <div class="page-number">213</div>
    </div>
    
    <!-- PAGE 214: CREDITS & CONTACT -->
    <div class="page">
        <h1 class="text-center gold-gradient mb-6" style="font-size: 2.5rem;">CREDITS & CONTACT</h1>
        <div class="gold-line"></div>
        
        <div class="credits-content" style="margin-top: 2rem;">
            <div class="author-section" style="text-align: center; margin-bottom: 3rem;">
                <div class="author-icon mb-4">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="var(--gold)" stroke-width="2"/>
                    </svg>
                </div>
                <h3 style="color: var(--gold); margin-bottom: 1rem;">KHAMARE CLARKE</h3>
                <p style="color: var(--gray-light); line-height: 1.6; max-width: 400px; margin: 0 auto;">
                    Founder of Leverage Technologies and creator of The Leverage System. Khamare has helped thousands of entrepreneurs and executives build systematic approaches to success through the marriage of ancient wisdom and modern technology.
                </p>
            </div>
            
            <div class="contact-section" style="background: var(--black-card); padding: 2rem; border-radius: 10px; margin-bottom: 2rem;">
                <h3 style="color: var(--gold); margin-bottom: 1.5rem; text-align: center;">CONNECT WITH THE LEVERAGE ECOSYSTEM</h3>
                
                <div class="contact-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;">
                    <div class="contact-item">
                        <h4 style="color: var(--gold-light); margin-bottom: 0.5rem;">📧 Email</h4>
                        <p style="color: var(--gray); font-size: 0.9rem;">contact@leveragetechnologies.com</p>
                    </div>
                    
                    <div class="contact-item">
                        <h4 style="color: var(--gold-light); margin-bottom: 0.5rem;">🌐 Website</h4>
                        <p style="color: var(--gray); font-size: 0.9rem;">leverage.app</p>
                    </div>
                    
                    <div class="contact-item">
                        <h4 style="color: var(--gold-light); margin-bottom: 0.5rem;">👥 Community</h4>
                        <p style="color: var(--gray); font-size: 0.9rem;">leverage.app/guild</p>
                    </div>
                    
                    <div class="contact-item">
                        <h4 style="color: var(--gold-light); margin-bottom: 0.5rem;">🤖 AI CoPilot</h4>
                        <p style="color: var(--gray); font-size: 0.9rem;">leverage.app/copilot</p>
                    </div>
                </div>
            </div>
            
            <div class="acknowledgments" style="margin-bottom: 2rem;">
                <h3 style="color: var(--gold); margin-bottom: 1rem;">ACKNOWLEDGMENTS</h3>
                <p style="color: var(--gray-light); line-height: 1.6;">
                    Special thanks to the thousands of beta users who tested early versions of this system, the philosophers and thinkers whose wisdom forms the foundation of these principles, and the technology teams who made the digital ecosystem possible.
                </p>
            </div>
            
            <div class="final-qr" style="text-align: center;">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="var(--black)">
                    <rect width="100" height="100" fill="var(--black)" rx="8"/>
                    <rect x="15" y="15" width="70" height="70" fill="none" stroke="var(--gold)" stroke-width="3"/>
                    <text x="50" y="55" text-anchor="middle" fill="var(--gold)" font-size="8" font-weight="bold">LEVERAGE</text>
                </svg>
                <div style="color: var(--gray); margin-top: 1rem;">
                    Start your next 90 days<br>
                    <code style="color: var(--gold);">leverage.app/continue</code>
                </div>
            </div>
        </div>
        
        <div class="page-number">214</div>
        <div class="footer-wisdom">"Leverage is not what you have—it's what you do with it." — Khamare Clarke</div>
    </div>`;
}

function initializeInteractiveElements() {
    // Initialize any interactive components
    console.log('Master journal initialized');
}
