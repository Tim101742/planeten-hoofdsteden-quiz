const prompt = require('prompt-sync')({sigint: true}); 
const fs = require("fs");
const json1 = "./planeten.json";
const json2 = "./hoofdsteden.json";
const jsonTekst1 = fs.readFileSync(json1, "utf8");
const jsonTekst2 = fs.readFileSync(json2, "utf8");
const planeten = JSON.parse(jsonTekst1);
const hoofdsteden = JSON.parse(jsonTekst2);
let quiz = planeten;
let keuze = prompt("planeten of hoofdsteden ");
if (keuze == "hoofdsteden") {
    quiz = hoofdsteden;
}
let stoppen = false; 
let score = 0;
let gamestate = "INTRO";
class  Question {
question: string;
time: number;
answers: string[];

constructor(question: string, time: number, answers: string[] = []) {
    this.question = question;
    this.time = time;
    this.answers = answers;
}
vraagMultiple() {
console.log(this.question + "antwoord moet een 0-3 nummer zijn");
console.log("je hebt " + this.time + " ms");
console.log(this.answers);
}
vraagOpen() {
console.log(this.question);
console.log("je hebt " + this.time + " ms");
}
Antwoord(answer: string) : boolean {
    return false;
}
}

class MultipleChoiceQuestion extends Question {
correctAnswer: string;

constructor(question: string, time: number, answers: string[], correctAnswer: string) {
    super(question, time, answers);
    this.correctAnswer = correctAnswer;
}
Antwoord(answer: string): boolean {
    return answer == this.correctAnswer;
}
}
class OpenQuestion extends Question {

    correctAnswer: string;

    constructor(question: string, time: number, correctAnswer: string) {
        super(question, time, []);
        this.correctAnswer = correctAnswer;
    }

    Antwoord(answer: string): boolean {
        return answer == this.correctAnswer;
    }
}

let vragen: Question[] = [];

for (let i = 0; i < quiz.questions.length; i++) {

    let vragenType = quiz.questions[i];

    if (vragenType.type == "MULTIPLECHOICE") {
        let vraag = new MultipleChoiceQuestion(
            vragenType.question,
            vragenType.time,
            vragenType.answers,
            vragenType.correctAnswer
        );
        vragen.push(vraag);
    }

    if (vragenType.type == "Open") {
        let vraag = new OpenQuestion(
            vragenType.question,
            vragenType.time,
            vragenType.answers[0]
        );
        vragen.push(vraag);
    }
}
function showIntro() {
    console.log(quiz.intro.title);
    console.log(quiz.intro.text);
    let start = prompt("voer iets in ");
    if (start == "") {
        stoppen = true;
    } else {
        gamestate = "QUESTION";
    }
}
function showQuestion() {

    for (let vraag of vragen) {
        const start = Date.now();
        if (vraag instanceof MultipleChoiceQuestion) {
        vraag.vraagMultiple();
        } else {
        vraag.vraagOpen();
        }
        let antwoord = prompt("Antwoord: ");
        const tijd = Date.now() - start;
        if (vraag.Antwoord(antwoord) && tijd <= vraag.time) {
            score++;
        }
    }
    gamestate = "END";
}
function showEnd() {
    console.log("je score is " + score);
    let opnieuw = prompt("voer ja in als je nog een keer wilt ");
    if (opnieuw == "ja") {
        score = 0;
        gamestate = "INTRO";
    } else {
        stoppen = true;
    }
}


while(!stoppen){  
  switch(gamestate){ 
    case "INTRO":
    showIntro();
    break;  
    case "QUESTION":
    showQuestion();
    break;  
    case "END":
    showEnd();
    break; 
  } 
} 

console.log("doei "); 