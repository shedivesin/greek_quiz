const readline = require("node:readline/promises");


const QUESTIONS = 20;


function shuffle(array) {
  for(let i = 0; i < array.length; i++) {
    // NB: It is OK (and, in fact, necessary) that i and j can be equal.
    const j = i + Math.floor((array.length - i) * Math.random());
    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }

  return array;
}

const VOCABULARY = shuffle([
  // William Linney, Getting Started with Ancient Greek.
  // [["αἰγιαλός", "beach"]],
  [["αἴλουρος", "cat"]],
  [["ἀγοράζω", "I buy"]],
  // [["ἀγρός", "field"]],
  [["ἄγω", "I lead"]],
  [["ἀδελφός", "brother"]],
  [["ἀναγιγνώσκω", "I read"]],
  // [["ἀπό", "from"]],
  [["ἄργυρος", "silver"]],
  [["ἄρτος", "bread"]],
  // [["βαδίζω", "I walk"]],
  [["βοῦς", "cow"]],
  [["βούτῡρος", "butter"]],
  [["γεωργός", "farmer"]],
  [["γράφω", "I write"]],
  // [["δρῡμός", "woods"]],
  [["διδάσκαλος", "teacher"]],
  [["διδάσκω", "I teach"]],
  [["διώκω", "I chase"]],
  // [["δίδωμι", "I give"]],
  [["ἐγώ", "I"]],
  // [["εἶς", "into"]],
  [
    ["εἰμί", "I am"],
    ["εἶ", "you are"],
    ["ἐστί(ν)", "he/she/it is", "he is", "she is", "it is"],
    ["ἐσμέν", "we are"],
    ["ἐστέ", "y'all are"],
    ["εἰσί(ν)", "they are"],
  ],
  [["ἐκ", "out of"], ["ἐξ", "out of"]],
  [["ἔμπορος", "merchant"]],
  [["ἐν", "in"]],
  [["ἐσθίω", "I eat"]],
  [["ἔχω", "I have"]],
  [["ἡμεῖς", "we"]],
  // [["θεῖος", "uncle"]],
  [["ῑ̓ᾱτρός", "doctor"]],
  [["ἵππος", "horse"]],
  [["καί", "and"]],
  [["καθ’ ἡμέρᾱν", "every day", "daily"]],
  [["καθεύδω", "I sleep"]],
  [["κάλαμος", "pen", "reed", "reed-pen"]],
  [["μάγειρος", "cook", "chef"]],
  [["νῦν", "now"]],
  [["ὁ", "the"], ["οἱ", "the"]],
  [["οἶκος", "house"]],
  [["ὅτι", "because"]],
  [["οὐ", "not"], ["οὐκ", "not"], ["οὐχ", "not"]],
  [["οὔποτε", "never"]],
  [["πολλάκις", "often"]],
  [["πάντοτε", "always"]],
  [["ποταμός", "river"]],
  [["πρός", "to/towards", "to", "towards"]],
  [["σπανίως", "seldom"]],
  [["στρατός", "army"]],
  [["στρατηγός", "general", "army-leader"]],
  [["σύ", "you"]],
  [["τρέχω", "I run"]],
  [["τῡρός", "cheese"]],
  [["υἱός", "son"]],
  [["ὑμεῖς", "y'all"]],
  [["φιλόσοφος", "philosopher"]],
  [["χοῖρος", "pig"]],
  // [["χόρτος", "fodder"]],
  [["χρῡσός", "gold"]],

  // C. W. E. Peckett and A. R. Murray, Thrasymachus.
  [["ἀκούω", "I hear"]],
  [["ἀστραπή", "lightning"]],
  [["βλέπω", "I see", "I look at"]],
  [["βροντὴ", "thunder"]],
  [["λέγω", "I speak", "I say", "I tell"]],
  [["παιδίον", "child"]],
  [["χαίρω", "I rejoice"]],

  // Personal list.
  [["ἄνθρωπος", "man", "human", "human being"]],
  [["ἐρίζω", "I quarrel"]],
  [["ἱμάτιον", "cloak", "garment"]],
  [["θάλαττα", "sea"]],
  [["θεός", "god"]],
  [["κρείσσων", "stronger", "mightier"]],
  [["ὁπότερος", "which"]],
  [["μάτην", "in vain"]],
  [["ποτέ", "once", "at some time"]],
]);


function random(array) {
  return array[Math.floor(array.length * Math.random())];
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const n = Math.min(QUESTIONS, VOCABULARY.length);
  const width = Math.floor(Math.log10(n)) + 1;
  let correct = 0;

  for(let i = 0; i < n; i++) {
    const [question, ...answers] = random(VOCABULARY[i]);
    console.log("%s. %s", (i + 1).toString().padStart(width), question);

    const test = await rl.question("> ".padStart(width + 2));
    if(answers.includes(test)) {
      correct++;
      console.log("%s\033[1;32m✓\033[0m\n", " ".repeat(width));
    }
    else {
      console.log("%s\033[1;31m✗\033[0m %s\n", " ".repeat(width), answers[0]);
    }
  }

  console.log("%d%%", Math.floor(correct * 100 / n));

  rl.close();
}

main();
