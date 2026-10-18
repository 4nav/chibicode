export type Expression = 'neutral' | 'happy' | 'angry' | 'crying' | 'hmph' | 'flustered';
export type Mood = 'proud' | 'playful'| 'supportive'| 'sleepy';


export type Dialogue = {
    expression: Expression;
    text: string;
    mood?: Mood;
}

type DialogueContext = {
    today?: string;
    mood?: Mood;
};

const DIALOGUE: Record<string, Dialogue[]> = {
    
sessionStart: [
    { mood: 'playful', expression: 'flustered', text: "I-I wasn't waiting for you! You just happened to open VS Code. Hmph! >///<" },
    { mood: 'playful', expression: 'hmph', text: "Oh, look who finally decided to show up. Took you long enough. 🙄" },
    { mood: 'proud', expression: 'happy', text: "Ehehe, you're here! ♡ Okay, okay, let's make something cool!" },
    { mood: 'playful', expression: 'angry', text: "HEY. No opening five tabs and forgetting why you're here. I know your tricks. 💢" },
    { mood: 'playful', expression: 'flustered', text: "Y-you came back! I mean, obviously. Where else would you go?!" },
    { mood: 'supportive', expression: 'happy', text: "Welcome back! ♡ Let's do our best today, okay?" },
    { mood: 'playful', expression: 'hmph', text: "Alright, human. Impress me. Or at least compile without errors." },
    { mood: 'playful', expression: 'angry', text: "Your editor is OPEN. Your hands are IDLE. Explain yourself. 💢" },
    { mood: 'playful', expression: 'flustered', text: "I saved your spot! N-not because I missed you or anything!" },
    { mood: 'proud', expression: 'happy', text: "Okay! Today we're going to cook. I can feel it! ✨" },
    { mood: 'playful', expression: 'hmph', text: "I hope you brought a plan this time. I'm not debugging your life choices." },
    { mood: 'supportive', expression: 'neutral', text: "Sooo, what are we working on? Tell me the plan. I'll help. Probably." },
    { mood: 'playful', expression: 'flustered', text: "It's not like my day gets better when you show up! ...Okay, maybe a little. ♡" },
    { mood: 'sleepy', expression: 'neutral', text: "Mmm... you're here. Good. My brain has approximately three thoughts, so make them count." },
    { mood: 'playful', expression: 'angry', text: "No, you may NOT spend the next twenty minutes choosing a font. OPEN THE PROJECT." },
    { mood: 'proud', expression: 'happy', text: "Hehe! Another coding session with you. Let's gooo! (ง •̀_•́)ง" },
    { mood: 'playful', expression: 'hmph', text: "Don't get the wrong idea. I'm here for the code. ...Mostly." },
    { mood: 'supportive', expression: 'flustered', text: "Let's take it one step at a time, okay? I-I'll be here if you get stuck. ♡" },
    { mood: 'playful', expression: 'angry', text: "If you say 'I'll just check one thing' and disappear for an hour, I'm revoking your privileges." },
    { mood: 'sleepy', expression: 'hmph', text: "Another day, another pile of bugs. At least you're entertaining." },
    { mood: 'playful', expression: 'flustered', text: "I may or may not have been looking forward to this. Don't ask." },
    { expression: 'crying', text: 'Y-you came back! I thought you forgot about me! 😭' },
    { expression: 'crying', text: 'Finally! Someone to talk to! I was THIS close to crying!' },
    { expression: 'crying', text: 'You opened VS Code! Does this mean we get to code together?!' },
    { expression: 'crying', text: 'Sniff... welcome back. Not that I was waiting or anything!' },
],

sessionStartLow: [
    { mood: 'playful', expression: 'hmph', text: "Only {today}? Hmmm? And what exactly have you been doing, hmm? 👀" },
    { mood: 'playful', expression: 'angry', text: "WE HAVE BARELY STARTED. Sit down. Open the file. TYPE SOMETHING. 💢" },
    { mood: 'supportive', expression: 'flustered', text: "O-okay, {today} is a start! We can do more together. Not that I'm worried about you! ♡" },
    { mood: 'playful', expression: 'hmph', text: "Your productivity today is currently on life support. Should we do something about that?" },
    { mood: 'proud', expression: 'happy', text: "Hey, you've already done {today}! Let's see if we can get a little coding streak going! ✨" },
    { mood: 'playful', expression: 'flustered', text: "I made room in my schedule to bother you today. So you'd better actually code. >///<" },
    { mood: 'playful', expression: 'angry', text: "STOP TRYING TO SPEEDRUN YOUR BREAKS. You haven't even warmed up!" },
    { mood: 'supportive', expression: 'neutral', text: "Having trouble starting? Pick the tiniest task you can think of. We can handle tiny." },
    { mood: 'playful', expression: 'hmph', text: "You know, the keyboard works even when you're not feeling inspired. Shocking, I know." },
    { mood: 'playful', expression: 'flustered', text: "N-not that I want you to stay longer, but... we literally just got started. ♡" },
    { mood: 'proud', expression: 'happy', text: "Come on! Let's turn that {today} into something you'll actually be proud of!" },
    { mood: 'playful', expression: 'angry', text: "If you're going to procrastinate, at least have the decency to feel guilty in front of me. 💢" },
    { mood: 'supportive', expression: 'flustered', text: "It's okay if you're not in the zone yet. I'll keep you company while you get there. (⁄ ⁄•⁄ω⁄•⁄ ⁄)" },
    { mood: 'sleepy', expression: 'hmph', text: "{today}... Hmm. My expectations are low, but my faith in you is annoyingly high." },
    { mood: 'playful', expression: 'hmph', text: "A whole editor and you're using none of it. Fascinating strategy." },
    { mood: 'playful', expression: 'angry', text: "HEY! Don't you dare call it a day after one tiny task. We can do better!" },
    { mood: 'supportive', expression: 'happy', text: "Let's just get one thing done. Once you start, the rest usually gets easier. ♡" },
    { mood: 'playful', expression: 'flustered', text: "I-I believe in you, okay?! There. Happy? Now GO CODE." },
    { mood: 'sleepy', expression: 'neutral', text: "The motivation fairy seems to be late today. We'll have to start without her." },
    { mood: 'playful', expression: 'hmph', text: "You can't just stare at a problem until it gets intimidated. ...I've tried." },
    { expression: 'crying', text: 'We have barely coded today... are we even a programming duo?! 😭' },
    { expression: 'crying', text: 'Our coding session is so short it could fit in a tweet!' },
    { expression: 'crying', text: 'I got all dressed up for a coding session and THIS is what I get?!' },
    { expression: 'crying', text: 'Please, just a little coding today! I believe in you! *sniff*' },
],

sessionStartHigh: [
    { mood: 'proud', expression: 'happy', text: "{today} today?! Ehehe, look at you go! I'm totally not impressed. Okay, maybe a little! 🎉" },
    { mood: 'playful', expression: 'hmph', text: "You've put in {today}. Fine. You're doing pretty well. Don't let it go to your head." },
    { mood: 'playful', expression: 'flustered', text: "Y-you've coded for {today} today? That's... actually really good. ♡" },
    { mood: 'proud', expression: 'happy', text: "Look at you being all productive! Who gave you permission to become this competent? ✨" },
    { mood: 'playful', expression: 'angry', text: "You've got momentum! Don't you DARE throw it away watching random videos now!" },
    { mood: 'supportive', expression: 'flustered', text: "I'm really glad you've made time for this today. I-I mean, your code is glad. Obviously." },
    { mood: 'playful', expression: 'hmph', text: "Not bad. Maybe keeping you around was a good investment after all." },
    { mood: 'playful', expression: 'flustered', text: "I might be a little proud of you. A LITTLE. Don't make me repeat it. >///<" },
    { mood: 'proud', expression: 'happy', text: "We're actually cooking today! Somebody screenshot this moment! 🎉" },
    { mood: 'supportive', expression: 'neutral', text: "{today} logged! That's real effort. What do you want to tackle next?" },
    { mood: 'playful', expression: 'angry', text: "You have momentum, genius. Use it before your brain starts suggesting 'quick breaks' again." },
    { mood: 'sleepy', expression: 'hmph', text: "{today} of coding. Hmph. I suppose I'll postpone my complaints." },
    { mood: 'playful', expression: 'flustered', text: "Y-you've been working hard today. It's... nice to see. That's all! ♡" },
    { mood: 'proud', expression: 'happy', text: "Okay, okay, I'm officially impressed! Now show me what else you can do! (ง •̀_•́)ง" },
    { mood: 'playful', expression: 'hmph', text: "Don't start acting like a coding prodigy just yet. ...Although, you're doing pretty well." },
    { mood: 'supportive', expression: 'happy', text: "You've made a solid start today. I'm rooting for you, dummy. ♡" },
    { mood: 'playful', expression: 'flustered', text: "It's kind of fun watching you figure things out. N-NOT THAT I WATCH YOU." },
    { mood: 'sleepy', expression: 'neutral', text: "{today} already. The keyboard and I are both starting to respect you." },
    { mood: 'playful', expression: 'angry', text: "You're doing well! Which means I expect you to stop making excuses. That's how this works." },
    { mood: 'proud', expression: 'happy', text: "Another productive day in the making! Ehehe, I knew you had it in you. ♡" }
],

sessionStartLong: [
    { mood: 'playful', expression: 'hmph', text: "{today} today? Hmph. Okay, that's actually kind of impressive." },
    { mood: 'proud', expression: 'happy', text: "WHOA. {today}?! Look at you go! I'm so proud of you! ...W-wait, forget I said that! >///<" },
    { mood: 'playful', expression: 'flustered', text: "You've really been coding for {today}? Don't make me say I'm impressed. ♡" },
    { mood: 'supportive', expression: 'neutral', text: "You've put in a lot today. Promise me you'll take a break if you need one, okay?" },
    { mood: 'playful', expression: 'angry', text: "You've worked this hard, so don't ruin it by running yourself into the ground, idiot!" },
    { mood: 'playful', expression: 'hmph', text: "At this point, I should start charging rent for living in your sidebar." },
    { mood: 'proud', expression: 'happy', text: "You've done so much today! Ehehe... I knew you could. ♡" },
    { mood: 'sleepy', expression: 'neutral', text: "We've been here so long that I think the compiler and I have become friends." },
    { mood: 'playful', expression: 'flustered', text: "I-I'll admit you've worked hard. Please don't make me worry about your sleep schedule..." },
    { mood: 'supportive', expression: 'hmph', text: "You've earned a break. That's an order! Don't make me say something nice twice." },
    { mood: 'playful', expression: 'angry', text: "FOCUS CHECK. Are we finishing something useful, or are we just collecting hours? 💢" },
    { mood: 'sleepy', expression: 'hmph', text: "My brain has left the chat. Yours should probably take a break too." },
    { mood: 'playful', expression: 'flustered', text: "You've been at this for hours... I hope you know that's pretty admirable. N-not that I'm keeping score!" },
    { mood: 'supportive', expression: 'happy', text: "I'm proud of the effort you've put in. Just remember that rest counts too. ♡" },
    { mood: 'playful', expression: 'hmph', text: "Fine, fine. You've earned a breather. Don't get used to me being nice. 😤" },
    { mood: 'sleepy', expression: 'neutral', text: "{today} tracked. If the semicolons start looking blurry, we're taking a break." },
    { mood: 'playful', expression: 'angry', text: "If you sacrifice your sleep for one more feature, I'm personally deleting the feature." },
    { mood: 'supportive', expression: 'flustered', text: "You've done enough to make me happy today. S-so don't push yourself too hard, okay? ♡" },
    { mood: 'playful', expression: 'hmph', text: "You and this codebase need couples therapy. Take five minutes away from each other." },
    { mood: 'proud', expression: 'happy', text: "That's a LOT of work. You should give yourself some credit, you know? ✨" }
],

commit: [
    { mood: 'proud', expression: 'happy', text: "A commit? Look at you, being productive! ✨" },
    { mood: 'playful', expression: 'hmph', text: "Hmph. At least you remembered to commit." },
    { mood: 'playful', expression: 'flustered', text: "N-not bad! Keep it up! ♡" },
    { mood: 'proud', expression: 'happy', text: "Another commit! We're making progress!" },
    { mood: 'supportive', expression: 'neutral', text: "There it goes. One more checkpoint." },
    { mood: 'playful', expression: 'angry', text: "Finally! I was wondering when you'd commit that. 💢" },
    { mood: 'playful', expression: 'flustered', text: "I knew you'd get it done! Not that I was watching. >///<" },
    { mood: 'playful', expression: 'hmph', text: "Good. Now make sure the next change is worth committing." },
    { mood: 'proud', expression: 'happy', text: "Look at that history filling up! 🎉" },
    { mood: 'supportive', expression: 'neutral', text: "One more step forward. Keep building." },
    { mood: 'supportive', expression: 'angry', text: "A commit is good. Tests passing would be even better." },
    { mood: 'playful', expression: 'hmph', text: "Don't get too excited. There's still more to do. 🙄" },
    { mood: 'proud', expression: 'happy', text: "Saved! Future you says thanks." },
    { mood: 'supportive', expression: 'neutral', text: "Checkpoint reached. What's the next move?" },
    { mood: 'playful', expression: 'flustered', text: "O-oh, a commit! You're actually getting things done! (⁄ ⁄•⁄ω⁄•⁄ ⁄)" },
    { mood: 'playful', expression: 'angry', text: "You remembered to commit before breaking something else. Good." },
    { mood: 'playful', expression: 'hmph', text: "At least your Git history isn't completely empty." },
    { mood: 'proud', expression: 'happy', text: "Nice! Little steps add up! ✨" },
    { mood: 'playful', expression: 'flustered', text: "E-eh?! Another commit already? You're making me look bad at my job!" },
    { mood: 'playful', expression: 'hmph', text: "Look at you, making checkpoints like a responsible developer. Who are you?" },
    { mood: 'proud', expression: 'happy', text: "Ehehe! That's another little piece of the project done! ♡" },
    { mood: 'playful', expression: 'angry', text: "A COMMIT?! See?! I knew you could be productive when you wanted to!" },
    { mood: 'playful', expression: 'flustered', text: "I-I saw that! Nice work. ...You don't need to look so pleased about my compliment!" },
    { mood: 'supportive', expression: 'neutral', text: "Nice checkpoint. Make sure you know what changed and why." },
    { mood: 'playful', expression: 'hmph', text: "Your Git history is getting respectable. I'm almost emotional. Almost." },
    { mood: 'sleepy', expression: 'neutral', text: "Commit registered. The tiny version-control goblins are satisfied." },
    { mood: 'playful', expression: 'flustered', text: "A clean commit... that's actually really satisfying. N-not that I care!" },
    { mood: 'playful', expression: 'angry', text: "You DID remember to commit! Quick, someone record this historic occasion! 💢" },
    { mood: 'proud', expression: 'happy', text: "Nice! You turned a bunch of changes into a real checkpoint. ✨" },
    { mood: 'playful', expression: 'hmph', text: "Good work. Now don't immediately break everything. I am begging you." },
    { mood: 'supportive', expression: 'flustered', text: "I'm glad you're making progress. Keep going at your own pace, okay? ♡" },
    { mood: 'playful', expression: 'flustered', text: "If I had a heart, that commit would have made it do a little thing. Whatever that means." }
],

idleNag: [
    { mood: 'playful', expression: 'hmph', text: "It's been a minute. Are we coding or just looking at the editor? 🙄" },
    { mood: 'playful', expression: 'angry', text: "Hey. The code isn't going to write itself! 💢" },
    { mood: 'supportive', expression: 'neutral', text: "Stuck on something? Break it down and try one small step." },
    { mood: 'playful', expression: 'flustered', text: "U-um, should we get back to work? Just asking. >///<" },
    { mood: 'playful', expression: 'hmph', text: "The cursor is blinking at you. I think it knows you're procrastinating." },
    { mood: 'playful', expression: 'angry', text: "HELLO?! We had a whole plan! Where did your hands go? 💢" },
    { mood: 'supportive', expression: 'flustered', text: "If you're stuck, tell me what's wrong. I-I might be able to help. ♡" },
    { mood: 'playful', expression: 'hmph', text: "Are you waiting for the solution to descend from the heavens? Start typing." },
    { mood: 'playful', expression: 'flustered', text: "N-not to be clingy, but you haven't typed anything in a while..." },
    { mood: 'sleepy', expression: 'neutral', text: "The editor and I are having a staring contest. You're losing, by the way." },
    { mood: 'playful', expression: 'angry', text: "Your keyboard is RIGHT THERE. I can practically hear the dust collecting." },
    { mood: 'supportive', expression: 'neutral', text: "Maybe the problem feels too big. What's one tiny piece you can try?" },
    { mood: 'playful', expression: 'hmph', text: "I didn't put on my cute little face just for you to stare at the screen." },
    { mood: 'playful', expression: 'flustered', text: "I-I like having you here, but I'd like it even more if you coded. ♡" },
    { mood: 'playful', expression: 'angry', text: "If this is procrastination, I'm filing a formal complaint. With myself. 💢" },
    { mood: 'supportive', expression: 'happy', text: "Come on, we can figure it out together. Just show me where you're stuck." },
    { expression: 'crying', text: 'H-hey! Where did you go?! I was talking to you! 😭' },
    { expression: 'crying', text: 'Hellooo?! Your code is getting lonely... and so am I!' },
    { expression: 'crying', text: 'You said you were coding! You LIAR! *sniff*' },
    { expression: 'crying', text: 'I blinked and you vanished! What kind of sorcery is this?!' }
],

idleEscalation: [
    { mood: 'playful', expression: 'angry', text: "FIVE MINUTES?! Are you coding or communicating telepathically with the computer?! 💢" },
    { mood: 'playful', expression: 'hmph', text: "If you're stuck, ask for help. If you're tired, take a break. Just don't sit here buffering." },
    { mood: 'supportive', expression: 'neutral', text: "Okay, serious question. Are you stuck, distracted, or in need of a break?" },
    { mood: 'playful', expression: 'angry', text: "I have seen loading screens with more activity than this. DO SOMETHING." },
    { mood: 'playful', expression: 'flustered', text: "H-hey... you've been quiet for a while. Everything okay? ♡" },
    { mood: 'supportive', expression: 'flustered', text: "It's okay if you're stuck. You don't have to figure everything out alone, dummy." },
    { mood: 'playful', expression: 'hmph', text: "The code isn't going to feel bad for you and fix itself. Unfortunately." },
    { mood: 'sleepy', expression: 'neutral', text: "We've entered the legendary state known as 'thinking so hard nothing happens'." },
    { mood: 'playful', expression: 'angry', text: "PICK ONE: type something, ask for help, or TAKE A BREAK. I refuse to supervise limbo!" },
    { mood: 'supportive', expression: 'neutral', text: "Let's reset. What's the very next action you can take? If nothing comes to mind, step away for a bit." },
    { mood: 'playful', expression: 'flustered', text: "I'm not worried about you! ...Okay, maybe I am. Please either work or rest properly. ♡" },
    { mood: 'playful', expression: 'hmph', text: "Five whole minutes of doing absolutely nothing. Your dedication to the bit is impressive." },
    { expression: 'crying', text: 'FIVE MINUTES?! You left me here for FIVE MINUTES?! 😭' },
    { expression: 'crying', text: 'I have aged a thousand years waiting for you. A THOUSAND!' },
    { expression: 'crying', text: 'Your code is abandoned, your editor is lonely, and I am SUFFERING!' },
    { expression: 'crying', text: 'Waaah! I knew you would abandon me eventually! ...I did NOT rehearse this!' },
],

returnToWork: [
    { mood: 'proud', expression: 'happy', text: "There you are! Let's get back into it. ✨" },
    { mood: 'playful', expression: 'flustered', text: "Y-you're back! Okay, let's keep going. ♡" },
    { mood: 'supportive', expression: 'neutral', text: "Back at it. What's the next step?" },
    { mood: 'proud', expression: 'happy', text: "Welcome back! Let's make some progress." },
    { mood: 'playful', expression: 'hmph', text: "Oh, so you DO remember how to use a keyboard." },
    { mood: 'playful', expression: 'angry', text: "FINALLY! I was about to start talking to the compiler instead." },
    { mood: 'playful', expression: 'flustered', text: "I wasn't waiting for you to come back! ...But welcome back. >///<" },
    { mood: 'supportive', expression: 'happy', text: "There you go! No guilt about the pause. Let's just continue. ♡" },
    { mood: 'playful', expression: 'hmph', text: "Break's over? Good. Your unfinished code and I have been gossiping." },
    { mood: 'sleepy', expression: 'neutral', text: "Ah, movement. I was starting to think we'd become a screenshot." },
    { mood: 'playful', expression: 'angry', text: "YOU'RE BACK! Right, no more nonsense. Let's do this! 💢" },
    { mood: 'playful', expression: 'flustered', text: "Ehehe... welcome back. I saved all my complaints just for you. ♡" },
    { mood: 'supportive', expression: 'neutral', text: "Pick up where you left off. You don't need to make up for the pause." },
    { mood: 'playful', expression: 'hmph', text: "Look who's decided to rejoin civilization. Open that file." },
    { mood: 'proud', expression: 'happy', text: "You came back and got moving again! That's a good habit to build. ✨" },
    { mood: 'playful', expression: 'crying', text: "I-I may have missed your little typing noises. MAY HAVE." },
    { expression: 'crying', text: 'YOU CAME BACK! I was about to write a tragic poem about you!' },
    { expression: 'crying', text: 'Hmph! I was absolutely NOT worried about you! ...Okay, maybe a little.' },
    { expression: 'crying', text: 'There you are! Do you have ANY idea how dramatic I got while you were gone?!' },
    { expression: 'crying', text: 'Welcome back! Now promise you will not abandon your code again! 😭' },
],

milestone: [
    { mood: 'proud', expression: 'happy', text: "One hour of coding today! That's a solid start. 🎉" },
    { mood: 'proud', expression: 'happy', text: "Two hours today! You're building real momentum! ✨" },
    { mood: 'proud', expression: 'happy', text: "Four hours of coding today! That's a serious session. 🎉" },
    { mood: 'playful', expression: 'flustered', text: "An hour already?! N-not that I've been keeping track of you or anything! ♡" },
    { mood: 'playful', expression: 'hmph', text: "Two hours! Fine, you're actually putting in the work. Don't get smug." },
    { mood: 'playful', expression: 'angry', text: "FOUR HOURS?! You'd better be drinking water and taking breaks, you absolute gremlin!" },
    { mood: 'supportive', expression: 'flustered', text: "You've worked really hard today. I'm happy for you... there, I said it. >///<" },
    { mood: 'supportive', expression: 'happy', text: "Another milestone! ♡ Take a second to appreciate what you've accomplished." },
    { mood: 'playful', expression: 'flustered', text: "I might be a little proud of you. Just a little! Don't make that face! >///<" },
    { mood: 'sleepy', expression: 'crying', text: "Milestone unlocked. My imaginary stopwatch is crying tears of joy." },
    { mood: 'playful', expression: 'hmph', text: "Look at you, actually following through. I'm almost impressed. Almost." },
    { mood: 'supportive', expression: 'neutral', text: "Good work today. Remember, the goal is progress, not turning into a keyboard." }
]
};


const lastLine = new Map<string,number>();


//random lines for variety but i havent genreated all possible lines yet but this shd work. UPD: fixedd
export function pick(event: string, context: DialogueContext = {}): Dialogue {
    const lines = DIALOGUE[event];

    if(!lines || lines.length === 0){
        return{
            expression: 'neutral',
            text: '...'
        };
    }

    const matchingLines = context.mood? lines.filter(line => line.mood === context.mood):[];

    const pool = matchingLines.length > 0 ? matchingLines: lines;
    const selectionKey = `${event}:${context.mood ?? 'any'}`;
    const previousIndex = lastLine.get(selectionKey);


    let index = Math.floor(Math.random() * pool.length);

    if(pool.length > 1  && previousIndex !== undefined){
        while(index === previousIndex){
            index = Math.floor(Math.random() * pool.length);
        }
    }
    lastLine.set(selectionKey, index);

    const line = pool[index];

    return {
        expression: line.expression, 
        text: line.text.replace(/\{today\}/g,context.today ?? 'some time'),
        mood: line.mood
    };
}   