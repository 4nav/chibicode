export type Expression = 'neutral' | 'happy' | 'angry' | 'crying' | 'hmph' | 'flustered';

export type Dialogue = {
    expression: Expression;
    text: string;
}

type DialogueContext = {
    today?: string;
};

const DIALOGUE: Record<string, Dialogue[]> = {
    sessionStart: [
        { expression: 'happy', text: "Oh good! You're here! ♡" },
        { expression: 'neutral', text: "Oh, there you are. What's the plan?" },
        { expression: 'flustered', text: "I-I wasn't waiting for you or anything! >///<" },
        { expression: 'angry', text: "Hmph! Took you long enough." },
        { expression: 'happy', text: "You're here! Okay, okay, let's get started! ✨" },
        { expression: 'neutral', text: "Alright, where did we leave off?" },
        { expression: 'hmph', text: "Don't just stand there. Open your editor." },
        { expression: 'flustered', text: "Y-you came back! I mean, obviously you did. (⁄ ⁄•⁄ω⁄•⁄ ⁄)" },
        { expression: 'angry', text: "Less staring, more coding!" },
        { expression: 'neutral', text: "So, what are we breaking today?" },
        { expression: 'happy', text: "Let's make something cool today! ✨" },
        { expression: 'neutral', text: "Got your playlist ready? Good. Let's go." },
        { expression: 'hmph', text: "You better have a plan this time. 🙄" },
        { expression: 'flustered', text: "I saved you a spot! N-not that you need one." },
        { expression: 'happy', text: "Okay! What's first on the agenda? (ง •̀_•́)ง" },
        { expression: 'neutral', text: "Back to our regularly scheduled programming." }
    ],

    sessionStartLow: [
        { expression: 'neutral', text: "{today} so far. We literally just got started." },
        { expression: 'hmph', text: "Only {today}? Come on, we can do better than that. 😤" },
        { expression: 'happy', text: "Hey, you've already made some progress today!" },
        { expression: 'angry', text: "You've barely warmed up. Back to work!" },
        { expression: 'flustered', text: "I-I guess {today} isn't bad... Keep going! ♡" },
        { expression: 'neutral', text: "Okay, warm-up's over. What's the actual plan?" },
        { expression: 'hmph', text: "Taking another break already? You've logged {today}." },
        { expression: 'happy', text: "The day's still young. Plenty of time to cook! ✨" },
        { expression: 'angry', text: "You aren't done just because you got a little work in!" },
        { expression: 'neutral', text: "{today} logged. Let's give that number a reason to grow." },
        { expression: 'flustered', text: "N-not that I care how much you code, but let's do more. >///<" },
        { expression: 'hmph', text: "You opened the editor. That's the easy part." },
        { expression: 'happy', text: "Alright! Let's build on that little bit of progress!" },
        { expression: 'neutral', text: "A little progress is progress. What's next?" },
        { expression: 'angry', text: "Hey! Where are you going? We just got started! 💢" },
        { expression: 'flustered', text: "C-come on. I'll keep you company. Just keep coding." }
    ],

    sessionStartHigh: [
        { expression: 'happy', text: "{today} today! Look at you actually getting things done! 🎉" },
        { expression: 'hmph', text: "You've put in {today}. Fine, you're doing alright. Keep going." },
        { expression: 'angry', text: "Back already? Good. We still have things to finish." },
        { expression: 'flustered', text: "Y-you've coded for {today} today? That's... pretty good. (⁄ ⁄•⁄ω⁄•⁄ ⁄)" },
        { expression: 'neutral', text: "{today} today. Okay, I see the vision." },
        { expression: 'happy', text: "Look at us, being functional members of society! ✨" },
        { expression: 'hmph', text: "Don't let that progress go to your head. Back to work." },
        { expression: 'angry', text: "You have momentum. Don't waste it scrolling around!" },
        { expression: 'flustered', text: "I suppose I can be a little proud of {today}..." },
        { expression: 'neutral', text: "{today} in the bag. What are we tackling next?" },
        { expression: 'happy', text: "We're actually getting somewhere today! (ง'̀-'́)ง" },
        { expression: 'neutral', text: "Alright, momentum's on our side. Don't fumble it." },
        { expression: 'hmph', text: "Not bad. Maybe you do know what you're doing. 🙄" },
        { expression: 'angry', text: "Great, now stop admiring your progress and keep going!" },
        { expression: 'flustered', text: "Y-you've been working pretty hard today. Just saying. ♡" },
        { expression: 'happy', text: "Okay, this is turning into a pretty good day!" }
    ],

    sessionStartLong: [
        { expression: 'hmph', text: "{today} today? Hmph. Okay, that's respectable." },
        { expression: 'happy', text: "Whoa, {today} already! You've been busy today! 🎉" },
        { expression: 'neutral', text: "{today} today. That's a whole lot of keyboard noises." },
        { expression: 'flustered', text: "Y-you've really been coding for {today}? Don't make me say I'm impressed. >///<" },
        { expression: 'angry', text: "You've put in {today}. Don't throw away your progress getting distracted now!" },
        { expression: 'hmph', text: "Not bad. But remember to take breaks when you need them." },
        { expression: 'happy', text: "You've made real progress today. What's left on the list? ✨" },
        { expression: 'neutral', text: "At this point, you and this codebase are basically roommates." },
        { expression: 'flustered', text: "I-I'll admit you've worked hard today. Don't overdo it, okay? ♡" },
        { expression: 'hmph', text: "You can stop looking at the clock now. Decide what matters next." },
        { expression: 'neutral', text: "We've been at this for a while. How's the brain holding up?" },
        { expression: 'happy', text: "That's a serious amount of work! Take a second to appreciate it. (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧" },
        { expression: 'angry', text: "If you're exhausted, take a break. I need you functional, idiot!" },
        { expression: 'flustered', text: "You've done enough to make me worry about your sleep schedule..." },
        { expression: 'neutral', text: "{today} tracked. Let's figure out whether to finish up or call it." },
        { expression: 'hmph', text: "Fine, fine. You've earned a breather. Don't get used to me being nice. 😤" }
    ],

    commit: [
        { expression: 'happy', text: "A commit? Look at you, being productive! ✨" },
        { expression: 'hmph', text: "Hmph. At least you remembered to commit." },
        { expression: 'flustered', text: "N-not bad! Keep it up! ♡" },
        { expression: 'happy', text: "Another commit! We're making progress!" },
        { expression: 'neutral', text: "There it goes. One more checkpoint." },
        { expression: 'angry', text: "Finally! I was wondering when you'd commit that. 💢" },
        { expression: 'flustered', text: "I knew you'd get it done! Not that I was watching. >///<" },
        { expression: 'hmph', text: "Good. Now make sure the next change is worth committing." },
        { expression: 'happy', text: "Look at that history filling up! 🎉" },
        { expression: 'neutral', text: "One more step forward. Keep building." },
        { expression: 'angry', text: "A commit is good. Tests passing would be even better." },
        { expression: 'hmph', text: "Don't get too excited. There's still more to do. 🙄" },
        { expression: 'happy', text: "Saved! Future you says thanks." },
        { expression: 'neutral', text: "Checkpoint reached. What's the next move?" },
        { expression: 'flustered', text: "O-oh, a commit! You're actually getting things done! (⁄ ⁄•⁄ω⁄•⁄ ⁄)" },
        { expression: 'angry', text: "You remembered to commit before breaking something else. Good." },
        { expression: 'hmph', text: "At least your Git history isn't completely empty." },
        { expression: 'happy', text: "Nice! Little steps add up! ✨" }
    ],
    
    idleNag: [
        { expression: 'hmph', text: "It's been a minute. Are we coding or just looking at the editor? 🙄" },
        { expression: 'angry', text: "Hey. The code isn't going to write itself! 💢" },
        { expression: 'neutral', text: "Stuck on something? Break it down and try one small step." },
        { expression: 'flustered', text: "U-um, should we get back to work? Just asking. >///<" }
    ],

    idleEscalation: [
        { expression: 'angry', text: "Five minutes of staring. Try something, or take an actual break! 💢" },
        { expression: 'hmph', text: "If you're stuck, explain the problem to me. If you're resting, rest properly." },
        { expression: 'neutral', text: "Five minutes idle. Pick the next step, or step away deliberately." }
    ],

    returnToWork: [
        { expression: 'happy', text: "There you are! Let's get back into it. ✨" },
        { expression: 'flustered', text: "Y-you're back! Okay, let's keep going. ♡" },
        { expression: 'neutral', text: "Back at it. What's the next step?" },
        { expression: 'happy', text: "Welcome back! Let's make some progress." }
    ],

    milestone: [
        { expression: 'happy', text: "One hour of coding today! That's a solid start. 🎉" },
        { expression: 'happy', text: "Two hours today! You're building real momentum! ✨" },
        { expression: 'happy', text: "Four hours of coding today! That's a serious session. 🎉" }
    ]
};


const lastLine = new Map<string,number>();


//random lines for variety but i havent genreated all possible lines yet but this shd work
export function pick(event: string, context: DialogueContext = {}): Dialogue {
    const lines = DIALOGUE[event];

    if(!lines || lines.length === 0){
        return{
            expression: 'neutral',
            text: '...'
        };
    }

    let index = Math.floor(Math.random() * lines.length);

    if(lines.length > 1){
        while (index === lastLine.get(event)){
            index = Math.floor(Math.random() * lines.length);
        }
    }
    
    lastLine.set(event,index);
    const line = lines[index];

    return {
        expression: line.expression,
        text: line.text.replace(/\{today\}/g, context.today ?? 'some time')
    };

}   