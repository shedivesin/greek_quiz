import readline from "node:readline/promises";

const LEXICON = [
  // Lexis Reading 1 (p. 74)
  ["ἀγ/", "lead", "drive"],
  ["ἀδελφεό/, ὁ", "brother"],
  ["ἀκοϝ/", "hear"],
  ["ἀληθεία/, ἡ", "truth"],
  ["ἀνά", "up"],
  ["ἀνδριάντ/, ὁ", "statue"],
  ["ἀνέρ/, ὁ", "man"],
  ["ἀπό", "from"],
  ["βασιλέϝ/, ὁ", "king"],
  ["γραφ/", "write"],
  ["δε/", "bind", "tie"],
  ["διώρυχ/, ἡ", "trench", "canal"],
  ["ἔκδυσι/, ἡ", "exit"],
  ["ἐς", "to", "into"],
  ["ἔσοδο/, ἡ", "entrance"],
  ["ἐχ/", "have", "hold"],
  ["ἡκ/", "arrive"],
  ["θησαυρό/, ὁ", "storehouse"],
  ["θυγάτερ/, ἡ", "daughter"],
  ["ἱρεϝ/, ὁ", "priest"],
  ["καί", "and"],
  ["καλε/", "call"],
  ["κατά", "down"],
  ["κεφαλά/, ἡ", "head"],
  ["λεγ/", "speak", "say"],
  ["λόγο/, ὁ", "statement", "argument"],
  ["λυ/", "loosen", "release"],
  ["λῦκο/, ὁ", "wolf"],
  ["μεθυ", "get drunk"],
  ["μήτερ/, ἡ", "mother"],
  ["νέκυ/, ὁ", "corpse"],
  ["ξυρε/", "shave"],
  ["οἴκο/, ὁ", "house"],
  ["οἰκοδομε/", "build", "construct"],
  ["οἴνο/, ὁ", "wine"],
  ["ὄνο/, ὁ", "donkey"],
  ["οὐ, οὐκ", "no", "not"],
  ["οὐτε ... οὐτε ...", "neither nor"],
  ["παίδ/, ἡ or ὁ", "child", "slave"],
  ["παρηΐδ/, ἡ", "cheek"],
  ["πατέρ/, ὁ", "father"],
  ["πλούτο/, ὁ", "wealth"],
  ["πρός", "to", "toward", "towards"],
  ["πυραμίδ/, ἡ", "cake", "pyramid"],
  ["ῥε/", "flow"],
  ["ταμία/, ὁ", "housekeeper"],
  ["ὑπέρ", "over"],
  ["ἐπι/τελε/", "complete", "finish"],
  ["φερ/", "bear", "carry"],
  ["φυλακό/, ὁ", "guard"],
  ["φώρ/, ὁ", "thief"],
  ["χειμών/, ὁ", "winter"],

  // Lexis Reading 2 (p. 84)
  ["ἄνθρωπο/, ἡ or ὁ", "person", "human"],
  ["βίο/, ὁ", "life", "way of life"],
  ["γά/, ἡ", "earth", "ground"],
  ["δέκα", "ten"],
  ["ἑλκ/", "pull", "drag"],
  ["ἕξ", "six"],
  ["ἐρδ/", "do"],
  ["εὑθηνε/", "make flourish"],
  ["κακότητ/, ἡ", "badness"],
  ["κελευ/", "command"],
  ["λίθο/, ὁ", "stone", "rock"],
  ["λιθοτομία/, ἡ", "quarry", "stone-quarry"],
  ["μηχανά/, ἡ", "device"],
  ["μυριάδ/, ἡ", "ten thousand"],
  ["νήσο/, ἡ", "island"],
  ["οἰκοδόμο/, ὁ", "builder"],
  ["δια/πεμπ/", "send far and wide"],
  ["περί", "around"],
  ["πόδ/, ὁ", "foot"],
  ["πόλι/, ἡ", "city", "city-state"],
  ["ποταμό/, ὁ", "river"],
  ["περι/ῥε/", "flow around"],
  ["στάδιο/, ὁ or τό", "stade"],
  ["τελευτά/, ἡ", "end", "completion"],
  ["ὑπό", "under"],
  ["μετα/φορε/", "carry across", "transfer"],
  ["χώρα/, ἡ", "space", "land"],
];

// Return a uniformly-distributed random number in [start, end)
function random(start, end) {
  return start + Math.floor((end - start) * Math.random());
}

// Knuth shuffle an iterable
function shuffle(list) {
  list = Array.from(list);

  for(let i = 0; i < list.length - 1; i++) {
    const j = random(i + 1, list.length);
    if(i === j) { continue; }

    const t = list[i];
    list[i] = list[j];
    list[j] = t;
  }

  return list;
}

async function quiz(questions) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // HACK: ^D mid-quiz should quit on a clean line
  rl.on("close", console.log);

  let right = 0;
  let wrong = 0;
  for(const [question, ...answers] of questions) {
    console.log("%s. %s", (right + wrong + 1).toString().padStart(2), question);

    let candidate;
    do { candidate = (await rl.question("  > ")).replace(/\s+/g, " ").trim(); }
    while(candidate === "");

    if(answers.includes(candidate)) {
      right++;
      console.log(
        "\x1B[1;32m  ✓ %s\x1B[0m\n",
        answers.join(", "),
      );
    }
    else {
      wrong++;
      console.log(
        "\x1B[1;31m  ✗ %s\x1B[0m\n",
        answers.join(", "),
      );
    }
  }

  const score = Math.round(right * 100 / (right + wrong));
  console.log("\x1B[1;%dm%d%%", (score >= 100)? 32: ((score >= 80)? 33: 31), score);

  // HACK: Remove ^D workaround noted above before closing the listener
  rl.removeAllListeners("close");

  rl.close();
}

quiz(shuffle(LEXICON).slice(0, 25));
