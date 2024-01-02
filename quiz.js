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
  ["οἴμοι", "oh dear!", "oh dear me!", "oh my!", "oh no!"],
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
  ["φωνή", "nominative singular", "nom sin", "nom sing", "ns"],
  ["φωνήν", "accusative singular", "acc sin", "acc sing", "as"],
  ["φωνῆς", "genitive singular", "gen sin", "gen sing", "gs"],
  ["φωνῇ", "dative singular", "dat sin", "dat sing", "ds"],
  ["φωναί", "nominative plural", "nom plu", "np"],
  ["φωνάς", "accusative plural", "acc plu", "ap"],
  ["φωνῶν", "genitive plural", "gen plu", "gp"],
  ["φωναῖς", "dative plural", "dat plu", "dp"],

  // Second declension masculine
  ["θεός", "nominative singular", "nom sing", "nom sin", "ns"],
  ["θεόν", "accusative singular", "acc sing", "acc sin", "as"],
  ["θεοῦ", "genitive singular", "gen sing", "gen sin", "gs"],
  ["θεῷ", "dative singular", "dat sing", "dat sin", "ds"],
  ["θεοί", "nominative plural", "nom plu", "np"],
  ["θεούς", "accusative plural", "acc plu", "ap"],
  ["θεῶν", "genitive plural", "gen plu", "gp"],
  ["θεοῖς", "dative plural", "dat plu", "dp"],

  // Second declension neuter
  ["παιδίον", "nominative/accusative singular", "nominative singular", "nom sing", "nom sin", "ns", "accusative singular", "acc sing", "acc sin", "as"],
  ["παιδίου", "genitive singular", "gen sing", "gen sin", "gs"],
  ["παιδίῷ", "dative singular", "dat sing", "dat sin", "ds"],
  ["παιδία", "nominative/accusative plural", "nominative plural", "nom plu", "np", "accusative plural", "acc plu", "ap"],
  ["παιδίων", "genitive plural", "gen plu", "gp"],
  ["παιδίοις", "dative plural", "dat plu", "dp"],
];
const MIN_QUESTIONS = 25;


async function quiz(list, length) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Build a list of N random questions.
  const questions = new Array(length);
  for(let i = 0; i < length; i++) {
    questions[i] = list[Math.floor(list.length * Math.random())];
  }

  const start = process.hrtime();
  let mistakes = 0;

  for(let i = 0; i < length; ) {
    const [question, ...answers] = questions[i];
    console.log("%s. %s", (i + mistakes + 1).toString().padStart(3), question);

    const test = await rl.question("   > ");

    if(answers.includes(test)) {
      console.log("   \033[1;32m✓\033[0m\n");

      i++;
    }

    else {
      console.log("   \033[1;31m✗\033[0m %s\n", answers[0]);

      // Don't swap on the last question, because j=length and we'll swap in an
      // undefined.
      if(i + 1 !== length) {
        const j = (i + 1) + Math.floor((length - (i + 1)) * Math.random());
        const t = questions[i];
        questions[i] = questions[j];
        questions[j] = t;
      }

      mistakes++;
    }
  }

  const [time_s, time_ns] = process.hrtime(start);
  const s_per_q = (time_s + time_ns / 1e9) / (length + mistakes);
  if(mistakes === 0) {
    console.log("\033[1;32mPerfect!\033[0m (%s s/q)", s_per_q.toFixed(1));
  }
  else {
    console.log("\033[1;31mYou made mistakes. Keep trying!\033[0m (%d s/q)", s_per_q.toFixed(1));
  }

  rl.close();
}


let source;
switch(path.basename(process.argv[1], ".js")) {
  case "vocabulary": source = VOCABULARY; break;
  case "endings": source = ENDINGS; break;
}
for(let i = 2; i < process.argv.length; i++) {
  switch(process.argv[i]) {
    case "-v": case "--vocabulary": source = VOCABULARY; break;
    case "-e": case "--endings": source = ENDINGS; break;
  }
}
if(source === undefined) {
  throw new Error("Please select the quiz type (--vocabulary or --endings)");
}

quiz(source, Math.max(source.length >> 2, MIN_QUESTIONS));
