import readline from "node:readline/promises";

function deconjugate(conjugations) {
  const map = new Map();

  for(const conjugation of conjugations) {
    const [g, ...keys] = conjugation.split(" ", 9);

    for(let i = 0; i < 8; i++) {
      const key = keys[i];
      let value = map.get(key);
      if(value === undefined) {
        value = [];
        map.set(key, value);
      }

      const c = "nagd"[i & 3]; // case
      const n = "sp"[i >> 2]; // number
      value.push(g + c + n);
    }
  }

  return map;
}

// Return a uniformly-distributed random number in [start, end)
function random(start, end) {
  return start + Math.floor((end - start) * Math.random());
}

// Knuth shuffle a list (and, optionally, truncate it to length n)
function shuffle(list, n) {
  list = Array.from(list);
  if(n === undefined || n > list.length) { n = list.length; }

  for(let i = 0; i < n; i++) {
    const j = random(i + 1, list.length);
    if(i === j) { continue; }

    const t = list[i];
    list[i] = list[j];
    list[j] = t;
  }

  list.length = n;
  return list;
}

async function input(rl, str) {
  let q;

  do { q = (await rl.question(str)).trim(); }
  while(q === "");

  return q.split(/\s+/g);
}

async function quiz(list) {
  const rl = readline.
    createInterface({input: process.stdin, output: process.stdout}).
    // HACK: ^D mid-quiz should quit on a clean line
    on("close", console.log);

  const start = process.hrtime();
  let n = 0;
  let mistakes = 0;

  for(const [question, answers] of list) {
    ++n;
    console.log("%s. %s", n.toString().padStart(3), question);

    let wrong = false;
    for(const candidate of await input(rl, "   > ")) {
      const i = answers.indexOf(candidate);
      if(i >= 0) {
        answers[i] = "\x1B[1;32m" + answers[i] + "\x1B[0m";
      }
      else {
        answers.push("\x1B[1;31m" + candidate + "\x1B[0m");
        wrong = true;
      }
    }

    mistakes += wrong;
    console.log(
      "   %s %s\n",
      wrong? "\x1B[1;31m✗\x1B[0m": "\x1B[1;32m✓\x1B[0m",
      answers.join(" "),
    );
  }

  if(mistakes === 0) {
    console.log("\x1B[1;32m100%%\x1B[0m");
  }
  else {
    console.log("\x1B[1;31m%d%%", Math.round((n - mistakes) * 100 / n));
  }

  // HACK: Remove ^D workaround noted above before closing the listener
  rl.removeAllListeners("close").close();
}

quiz(
  shuffle(
    deconjugate([
      // Getting Started with Ancient Greek, ch. 136, p. 195
      "m γεωργός γεωργόν γεωργοῦ γεωργῷ γεωργοί γεωργούς γεωργῶν γεωργοῖς",

      // Thrasymachus, ch. I, p. 4
      "m καλός καλόν καλοῦ καλῷ καλοί καλούς καλῶν καλοῖς",
      "f καλή καλήν καλῆς καλῇ καλαί καλάς καλῶν καλαῖς",
      "n καλόν καλόν καλοῦ καλῷ καλά καλά καλῶν καλοῖς",
      "f φωνή φωνήν φωνῆς φωνῇ φωναί φωνάς φωνῶν φωναῖς",
      "f θάλαττα θάλατταν θαλάττης θαλάττῃ θάλατται θαλάττας θαλαττῶν θαλάτταισ",
      "f οἰκία οἰκίαν οἰκίας οἰκίᾳ οἰκίαι οἰκίας οἰκιῶν οἰκίαις",
      "m ἄνθρωπος ἄνθρωπον ἀνθρώπου ἀνθρώπῳ ἄνθρωποι ἀνθρώπους ἀνθρώπων ἀνθρώποις",
      "n παιδίον παιδίον παιδίου παιδίῷ παιδία παιδία παιδίων παιδίοις",

      // Ancient Greek with Thrasymachus, ch. I
      "m θεός θεόν θεοῦ θεῷ θεοί θεούς θεῶν θεοῖς",

      // Thrasymachus, ch. II, p. 8-9
      "m ἄναξ ἄνακτα ἄνακτος ἄνακτι ἄνακτες ἄνακτας ἀνάκτων ἄναξι(ν)",
      "m κύων κύνα κυνός κυνί κύνες κύνας κυνῶν κυσί(ν)", 
      "n σῶμα σῶμα σώματος σώματι σώματα σώματα σωμάτων σώμασι(ν)",
      "m τίς τίνα τίνος τίνι τίνες τίνας τίνων τίσι(ν)",
      "f τίς τίνα τίνος τίνι τίνες τίνας τίνων τίσι(ν)",
      "n τί τί τίνος τίνι τίνα τίνα τίνων τίσι(ν)",
      // FIXME: Add numbers? One, two, three, four?
    ]),
    25,
  ),
);
