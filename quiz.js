const path = require("node:path");
const readline = require("node:readline/promises");

const VOCABULARY = [
  // William Linney, Getting Started with Ancient Greek.
  ["αἰγιαλός", "beach"],
  ["αἴλουρος", "cat"],
  ["ἀγοράζω", "I buy"],
  ["ἀγρός", "field"],
  ["ἄγω", "I lead"],
  ["ἀδελφός", "brother"],
  ["ἀναγιγνώσκω", "I read"],
  ["ἀπό", "from"],
  ["ἄργυρος", "silver"],
  ["ἄρτος", "bread"],
  ["βαδίζω", "I walk"],
  ["βοῦς", "cow"],
  ["βούτῡρος", "butter"],
  ["γεωργός", "farmer"],
  ["γράφω", "I write"],
  ["δρῡμός", "woods"],
  ["διδάσκαλος", "teacher"],
  ["διδάσκω", "I teach"],
  ["διώκω", "I chase"],
  ["δίδωμι", "I give"],
  ["ἐγώ", "I"],
  ["εἶ", "you are"],
  ["εἶς", "into"],
  ["εἰσί(ν)", "they are"],
  ["εἰμί", "I am"],
  ["ἐκ/ἐξ", "out of"],
  ["ἔμπορος", "merchant"],
  ["ἐν", "in"],
  ["ἐσθίω", "I eat"],
  ["ἐστέ", "y'all are"],
  ["ἐστί(ν)", "he/she/it is", "he is", "she is", "it is"],
  ["ἐσμέν", "we are"],
  ["ἔχω", "I have"],
  ["ἡμεῖς", "we"],
  ["θεῖος", "uncle"],
  ["ῑ̓ᾱτρός", "doctor"],
  ["ἵππος", "horse"],
  ["καί", "and"],
  ["καθ’ ἡμέρᾱν", "every day", "daily"],
  ["καθεύδω", "I sleep"],
  ["κάλαμος", "pen", "reed", "reed-pen"],
  ["μάγειρος", "cook", "chef"],
  ["νῦν", "now"],
  ["οἶκος", "house"],
  ["ὅτι", "because"],
  ["οὐ", "not"],
  ["οὐκ/οὐχ", "not"],
  ["οὔποτε", "never"],
  ["πολλάκις", "often"],
  ["πάντοτε", "always"],
  ["ποταμός", "river"],
  ["πρός", "to/towards", "to", "towards"],
  ["σπανίως", "seldom"],
  ["στρατός", "army"],
  ["στρατηγός", "general", "army-leader"],
  ["σύ", "you"],
  ["τρέχω", "I run"],
  ["τῡρός", "cheese"],
  ["υἱός", "son"],
  ["ὑμεῖς", "y'all"],
  ["φιλόσοφος", "philosopher"],
  ["χοῖρος", "pig"],
  ["χόρτος", "fodder"],
  ["χρῡσός", "gold"],

  // C. W. E. Peckett and A. R. Munday, Thrasymachus.
  // I
  ["ἀκούω", "I hear"],
  ["ἀλλά", "but"],
  ["ἄνθρωπος", "man", "human"],
  ["ἄρα", "?"],
  ["ἀστραπή", "lightning"],
  ["βλέπω", "I see", "I look at", "I watch"],
  ["βροντὴ", "thunder"],
  ["γάρ", "for"],
  ["δέ", "but"],
  ["δεῦρο", "hither", "here"],
  ["διά", "because of"],
  ["διὰ τί", "why?"],
  ["διότι", "because"],
  ["ἐνδύω", "I put on"],
  ["ἥκω", "I have come"],
  ["ἱμάτιον", "cloak", "garment"],
  ["καταβαίνω", "I go down"],
  ["κελεύω", "I order"],
  ["κομίζω", "I take", "I escort"],
  ["λέγω", "I say", "I speak", "I tell"],
  ["μή", "don't"],
  ["νεκρός", "corpse"],
  ["οἰκία", "house"],
  ["οἴμοι", "oh dear!", "oh dear me!", "oh no!"],
  ["οὖν", "therefore"],
  ["παιδίον", "child"],
  ["παρέχω", "I give", "I provide"],
  ["περί", "about", "concerning"],
  ["τίς/τί", "who?"],
  ["φωνή", "voice"],
  ["χαίρω", "I rejoice"],
];
const ENDINGS = [
  // First declension
  ["φωνή", "nominative singular", "nom sing"],
  ["φωνήν", "accusative singular", "acc sing"],
  ["φωνῆς", "genitive singular", "gen sing"],
  ["φωνῇ", "dative singular", "dat sing"],
  ["φωναί", "nominative plural", "nom plu"],
  ["φωνάς", "accusative plural", "acc plu"],
  ["φωνῶν", "genitive plural", "gen plu"],
  ["φωναῖς", "dative plural", "dat plu"],

  // Second declension masculine
  ["θεός", "nominative singular", "nom sing"],
  ["θεόν", "accusative singular", "acc sing"],
  ["θεοῦ", "genitive singular", "gen sing"],
  ["θεῷ", "dative singular", "dat sing"],
  ["θεοί", "nominative plural", "nom plu"],
  ["θεούς", "accusative plural", "acc plu"],
  ["θεῶν", "genitive plural", "gen plu"],
  ["θεοῖς", "dative plural", "dat plu"],
];
const MIN_QUESTIONS = 20;


function shuffle(array) {
  for(let i = 0; i < array.length - 1; i++) {
    const j = i + Math.floor((array.length - i) * Math.random());
    if(i === j) { continue; }

    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }

  return array;
}

async function quiz(source, questions) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let n = 0;

  for(let list = shuffle(source.slice()).slice(0, questions); list.length !== 0; ) {
    const next = [];

    for(const entry of list) {
      const [question, ...answers] = entry;
      console.log("%s. %s", (++n).toString().padStart(3), question);

      const test = await rl.question("   > ");
      if(answers.includes(test)) {
        console.log("   \033[1;32m✓\033[0m\n");
      }
      else {
        console.log("   \033[1;31m✗\033[0m %s\n", answers[0]);
        next.push(entry);
      }
    }

    list = shuffle(next);
  }

  if(n === questions) {
    console.log("\033[1;32mPerfect!\033[0m");
  }
  else {
    console.log("\033[1;31mYou made mistakes. Keep trying!\033[0m");
  }

  rl.close();
}


let source;
switch(path.basename(process.argv[1], ".js")) {
  case "vocabulary": source = VOCABULARY; break;
  case "endings": source = ENDINGS; break;
  default: throw new Error("Run as vocabulary.js or endings.js");
}

quiz(source, Math.max(source.length >> 2, MIN_QUESTIONS));
