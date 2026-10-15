export type Expression = 'neutral' | 'happy' | 'angry' | 'crying' | 'hmph' | 'flustered';

export type Dialogue = {
    expression: Expression;
    text: string;
}

const DIALOGUE: Record<string, Dialogue[]> = {
    sessionStart: [
        { expression: 'happy', text: 'Oh good! You’re here!' },
        { expression: 'neutral', text: 'Chop chop! Let’s get to work.' },
        { expression: 'flustered', text: 'I-I wasn’t waiting for you or anything!' },
        { expression: 'angry', text: 'Hmph! Took you long enough.' }
    ],
    commit: [
        {expression: 'happy', text: 'A commit? Look at you, being productive!'},
        {expression : 'hmph', text: 'Hmph. At least you remembered to commit.'},
        {expression: 'flustered', text: 'N-not bad! Keep it up!'}
    ]
};

const lastLine = new Map<string,number>();


//random lines for variety but i havent genreated all possible lines yet but this shd work
export function pick(event: string): Dialogue {
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
    return lines[index];
}   