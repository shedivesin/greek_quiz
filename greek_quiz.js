const readline = require("node:readline/promises");


const QUESTIONS = 10;
const NUMBER_WIDTH = Math.floor(Math.log10(QUESTIONS)) + 1;


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

// FIXME: Add various noun forms.
const VOCABULARY = shuffle([
  // [["αἰγιαλός", "beach"]],
  [["αἴλουρος", "cat"]],
  [
    ["ἀγοράζω", "I buy"],
    ["ἀγοράζεις", "you buy"],
    ["ἀγοράζει", "he/she/it buys", "he buys", "she buys", "it buys"],
    ["ἀγοράζομεν", "we buy"],
    ["ἀγοράζετε", "y'all buy"],
    ["ἀγοράζουσι(ν)", "they buy"],
  ],
  // [["ἀγρός", "field"]],
  // [["ἀδελφός", "brother"]],
  [
    ["ἀναγιγνώσκω", "I read"],
    ["ἀναγιγνώσκεις", "you read"],
    ["ἀναγιγνώσκει", "he/she/it reads", "he reads", "she reads", "it reads"],
    ["ἀναγιγνώσκομεν", "we read"],
    ["ἀναγιγνώσκετε", "y'all read"],
    ["ἀναγιγνώσκουσι(ν)", "they read"],
  ],
  // [["ἀπό", "from"]],
  // [["ἄργυρος", "silver"]],
  [["ἄρτος", "bread"]],
  // [["βαδίζω", "I walk"]],
  [["βούτῡρος", "butter"]],
  [["γεωργός", "farmer"]],
  [
    ["γράφω", "I write"],
    ["γράφεις", "you write"],
    ["γράφει", "he/she/it writes", "he writes", "she writes", "it writes"],
    ["γράφομεν", "we write"],
    ["γράφετε", "y'all write"],
    ["γράφουσι(ν)", "they write"],
  ],
  // [["δρῡμός", "woods"]],
  [["διδάσκαλος", "teacher"]],
  [
    ["διδάσκω", "I teach"],
    ["διδάσκεις", "you teach"],
    ["διδάσκει", "he/she/it teaches", "he teaches", "she teaches", "it teaches"],
    ["διδάσκομεν", "we teach"],
    ["διδάσκετε", "y'all teach"],
    ["διδάσκουσι(ν)", "they teach"],
  ],
  [
    ["διώκω", "I chase"],
    ["διώκεις", "you chase"],
    ["διώκει", "he/she/it chases", "he chases", "she chases", "it chases"],
    ["διώκομεν", "we chase"],
    ["διώκετε", "y'all chase"],
    ["διώκουσι(ν)", "they chase"],
  ],
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
  [
    ["ἐσθίω", "I eat"],
    ["ἐσθίεις", "you eat"],
    ["ἐσθίει", "he/she/it eats", "he eats", "she eats", "it eats"],
    ["ἐσθίομεν", "we eat"],
    ["ἐσθίετε", "y'all eat"],
    ["ἐσθίουσι(ν)", "they eat"],
  ],
  [
    ["ἔχω", "I have"],
    ["ἔχεις", "you have"],
    ["ἔχει", "he/she/it has", "he has", "she has", "it has"],
    ["ἔχομεν", "we have"],
    ["ἔχετε", "y'all have"],
    ["ἔχουσι(ν)", "they have"],
  ],
  [["ἡμεῖς", "we"]],
  // [["θεῖος", "uncle"]],
  [["ῑ̓ᾱτρός", "doctor"]],
  [["ἵππος", "horse"]],
  [["καί", "and"]],
  [["καθ’ ἡμέρᾱν", "every day", "daily"]],
  [
    ["καθεύδω", "I sleep"],
    ["καθεύδεις", "you sleep"],
    ["καθεύδει", "he/she/it sleeps", "he sleeps", "she sleeps", "it sleeps"],
    ["καθεύδομεν", "we sleep"],
    ["καθεύδετε", "y'all sleep"],
    ["καθεύδουσι(ν)", "they sleep"],
  ],
  [["κάλαμος", "pen", "reed", "reed-pen"]],
  [["μάγειρος", "cook", "chef"]],
  [["νῦν", "now"]],
  [["ὁ", "the"]],
  [["οἶκος", "house"]],
  [["ὅτι", "because"]],
  [["οὐ", "not"], ["οὐκ", "not"], ["οὐχ", "not"]],
  [["οὔποτε", "never"]],
  [["πολλάκις", "often"]],
  [["πάντοτε", "always"]],
  [["ποταμός", "river"]],
  [["πρός", "to/towards", "to", "towards"]],
  [["σπανίως", "seldom"]],
  [["στρατηγός", "general"]],
  [["σύ", "you"]],
  [
    ["τρέχω", "I run"],
    ["τρέχεις", "you run"],
    ["τρέχει", "he/she/it runs", "he runs", "she runs", "it runs"],
    ["τρέχομεν", "I run"],
    ["τρέχετε", "I run"],
    ["τρέχουσι(ν)", "I run"],
  ],
  [["τῡρός", "cheese"]],
  [["υἱός", "son"]],
  [["ὑμεῖς", "y'all"]],
  [["φιλόσοφος", "philosopher"]],
  [["χοῖρος", "pig"]],
  // [["χόρτος", "fodder"]],
  [["χρῡσός", "gold"]],
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
  let correct = 0;

  for(let i = 0; i < n; i++) {
    const [question, ...answers] = random(VOCABULARY[i]);
    console.log("%s. %s", (i + 1).toString().padStart(NUMBER_WIDTH), question);

    const test = await rl.question("> ".padStart(NUMBER_WIDTH + 2));
    if(answers.includes(test)) {
      correct++;
      console.log("%s\n", "✓".padStart(NUMBER_WIDTH + 1));
    }
    else {
      console.log("%s %s\n", "✗".padStart(NUMBER_WIDTH + 1), answers[0]);
    }
  }

  console.log("%d%%", Math.floor(correct * 100 / n));

  rl.close();
}

main();
