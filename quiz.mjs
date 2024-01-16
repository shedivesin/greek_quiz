import readline from "node:readline/promises";

const ANSWERS = {
  1: "person, case, number|1ns|1as|1gs|1ds|1np|1ap|1gp|1dp".split("|"),
  2: "person, case, number|2ns|2as|2gs|2ds|2np|2ap|2gp|2dp".split("|"),
  f: "gender, case, number|fns|fas|fgs|fds|fnp|fap|fgp|fdp".split("|"),
  m: "gender, case, number|mns|mas|mgs|mds|mnp|map|mgp|mdp".split("|"),
  n: "gender, case, number|nns|nas|ngs|nds|nnp|nap|ngp|ndp".split("|"),
  v: "person, number|1s|2s|3s|1p|2p|3p".split("|"),
};

function questions(tables) {
  const questions = new Map();

  for(const table of tables) {
    const words = table.split(" ");
    const answers = ANSWERS[words[0]];
    if(answers === undefined) {
      throw new Error("Invalid table type " + words[0]);
    }

    // NB: Words and answers both have an extra value at the beginning, but
    // should match from the second item on.
    const n = words.length;
    if(n !== answers.length) {
      throw new Error("Invalid table " + table);
    }

    const hint = answers[0];
    for(let i = 1; i < n; i++) {
      const word = words[i] + " (" + hint + ")";
      const answer = answers[i];

      let list = questions.get(word);
      if(list === undefined) {
        list = [];
        questions.set(word, list);
      }

      list.push(answer);
    }
  }

  return questions;
}

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

  let ok = 0;
  let fail = 0;
  for(const [question, answers] of questions) {
    console.log("%s. %s", (ok + fail + 1).toString().padStart(3), question);

    // FIXME: Make a copy of answers because we will be modifying it.
    let correct = true;

    for(;;) {
      const candidates = (await rl.question("   > ")).trim().split(/\s+/g);
      if(candidates.length === 0) { continue; }

      for(const candidate of candidates) {
        const i = answers.indexOf(candidate);
        if(i >= 0) {
          answers[i] = "\x1B[1;32m" + answers[i] + "\x1B[0m";
        }
        else {
          answers.push("\x1B[1;31m" + candidate + "\x1B[0m");
          correct = false;
        }
      }

      break;
    }

    console.log(
      "   %s %s\n",
      correct? "\x1B[1;32m✓\x1B[0m": "\x1B[1;31m✗\x1B[0m",
      answers.join(" "),
    );

    if(correct) { ok++; }
    else { fail++; }
  }

  if(fail === 0) {
    console.log("\x1B[1;32m100%%\x1B[0m");
  }
  else {
    console.log("\x1B[1;31m%d%%", Math.round(ok * 100 / (ok + fail)));
  }

  // HACK: Remove ^D workaround noted above before closing the listener
  rl.removeAllListeners("close");

  rl.close();
}

quiz(shuffle(questions([
  // Thrasymachus I
  "m ὁ τόν τοῦ τῷ οἱ τούς τῶν τοῖς",
  "f ἡ τήν τῆς τῇ αἱ τάς τῶν ταῖς",
  "n τό τό τοῦ τῷ τά τά τῶν τοῖς",
  "m καλός καλόν καλοῦ καλῷ καλοί καλούς καλῶν καλοῖς",
  "f καλή καλήν καλῆς καλῇ καλαί καλάς καλῶν καλαῖς",
  "n καλόν καλόν καλοῦ καλῷ καλά καλά καλῶν καλοῖς",
  "f φωνή φωνήν φωνῆς φωνῇ φωναί φωνάς φωνῶν φωναῖς",
  "f θάλαττα θάλατταν θαλάττης θαλάττῃ θάλατται θαλάττας θαλαττῶν θαλάτταισ",
  "f οἰκία οἰκίαν οἰκίας οἰκίᾳ οἰκίαι οἰκίας οἰκιῶν οἰκίαις",
  "m ἄνθρωπος ἄνθρωπον ἀνθρώπου ἀνθρώπῳ ἄνθρωποι ἀνθρώπους ἀνθρώπων ἀνθρώποις",
  "n παιδίον παιδίον παιδίου παιδίῷ παιδία παιδία παιδίων παιδίοις",
  "v λύω λύεις λύει λύομεν λύετε λύουσι(ν)",
  "v εἰμί εἶ ἐστί(ν) ἐσμέν ἐστέ εἰσί(ν)",

  // Thrasymachus II
  "m ἄναξ ἄνακτα ἄνακτος ἄνακτι ἄνακτες ἄνακτας ἀνάκτων ἄναξι(ν)",
  "m κύων κύνα κυνός κυνί κύνες κύνας κυνῶν κυσί(ν)",
  "n σῶμα σῶμα σώματος σώματι σώματα σώματα σωμάτων σώμασι(ν)",
  "m τίς τίνα τίνος τίνι τίνες τίνας τίνων τίσι(ν)",
  "f τίς τίνα τίνος τίνι τίνες τίνας τίνων τίσι(ν)",
  "n τί τί τίνος τίνι τίνα τίνα τίνων τίσι(ν)",
  // FIXME: Numbers
  // "mn εἷς ἕνα ἑνός ἑνί",
  // "fn μία μίαν μιᾶς μιᾷ",
  // "nn ἑν ἑν ἑνός ἑνί",
  // "mn δύο δύο δυοῖν δυοῖν",
  // "fn δύο ύο δυοῖν δυοῖν",
  // "nn δύο δύο δυοῖν δυοῖν",
  // "mn τρεῖς τρεῖς τριῶν τρισί(ν)",
  // "fn τρεῖς τρεῖς τριῶν τρισί(ν)",
  // "nn τρία τρία τριῶν τρισί(ν)",
  // "mn τέτταρες τέτταρας τεττάρων τέτταρσι(ν)",
  // "fn τέτταρες τέτταρας τεττάρων τέτταρσι(ν)",
  // "nn τέτταρα τέτταρα τεττάρων τέτταρσι(ν)",
  "1 ἐγώ ἐμέ ἐμοῦ ἐμοί ἡμεῖς ἡμᾶς ἡμῶν ἡμῖν",
  "2 σύ σέ σοῦ σοί ὑμεῖς ὑμᾶς ὑμῶν ὑμῖν",
])).slice(0, 25));
