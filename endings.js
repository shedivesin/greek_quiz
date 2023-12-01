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

const ENDINGS = shuffle([
  // Second declension masculine nouns
  ["-ος", "nom", "sin"],
  ["-οι", "nom", "plu"],
  ["-ου", "gen", "sin"],
  ["-ων", "gen", "plu"],
  ["-ον", "acc", "sin"],
  ["-ους", "acc", "plu"],
]);

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const n = Math.min(QUESTIONS, ENDINGS.length);
  const width = Math.floor(Math.log10(n)) + 1;
  let correct = 0;

  for(let i = 0; i < n; i++) {
    const [question, answer_case, answer_number] = ENDINGS[i];
    console.log("%s. %s", (i + 1).toString().padStart(width), question);

    const [test_case, test_number] = (await rl.question("> ".padStart(width + 2))).split(/[\.,]?\s+/g, 2);
    if(test_case.startsWith(answer_case) && test_number.startsWith(answer_number)) {
      correct++;
      console.log("%s\033[1;32m✓\033[0m\n", " ".repeat(width));
    }
    else {
      console.log("%s\033[1;31m✗\033[0m %s %s\n", " ".repeat(width), answer_case, answer_number);
    }
  }

  console.log("%d%%", Math.floor(correct * 100 / n));

  rl.close();
}

main();
