// verify_counts.js
// Run: node verify_counts.js --year 2025 [--verbose]

import axios from "axios";
import pLimit from "p-limit";
import fs from "fs";
import path from "path";

// ---------- CONFIG ----------
const CONCURRENCY = 5;
const RETRIES = 3;
const SLEEPER = "https://api.sleeper.app/v1";
const limit = pLimit(CONCURRENCY);

// ---------- CLI ARGS ----------
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const YEAR = args.year || "2025"; // default can be latest in map if you prefer
const VERBOSE = Boolean(args.verbose);
const CSV_OUT = args.csv || path.resolve(process.cwd(), `owners_${YEAR}.csv`);

// ---------- LOG UTILS ----------
const ts = () => new Date().toISOString().split("T")[1].replace("Z", "");
const log = (...m) => console.log(`[${ts()}]`, ...m);
const vlog = (...m) => VERBOSE && log(...m);
const hr = () => console.log("-".repeat(80));
// ---------- PASTE YOUR MAP HERE ----------
const LEAGUE_MAP = {
  "2025": {
    big_game: {
      name: "2025 Big Game",
      divisions: {
        "The Boys": [
          "1253784223572054016",
          "1253784097361248256",
          "1253783958911467520",
          "1253783829345210368",
          "1253783490437066753",
          "1253783230419582976",
          "1253783033773838336",
          "1253782672942043136"
        ],
        "Character Unlocks": [
          "1248759493509001216",
          "1248759399116185600",
          "1248759321198604288",
          "1248759237685825536",
          "1248759094936870912",
          "1248758997247332352",
          "1248758889822814208",
          "1248758806159052800"
        ],
        "Transformers": [
          "1245939198322544640",
          "1245939058090192896",
          "1245938950132998144",
          "1245938807111426048",
          "1245938520757915648",
          "1245938351500963841",
          "1245938209041416192",
          "1245938023556730880"
        ],
        "Pokemon": [
          "1241186240582131712",
          "1241186167072763904",
          "1241186039402332160",
          "1241185929842937856",
          "1241185833717878784",
          "1241185729577484288",
          "1241185496642637824",
          "1241185404669927424"
        ],
        "The ALL-STARS": [
          "1240082544733470720",
          "1240082455893901312",
          "1240082381742813184",
          "1240082270786695168",
          "1240082146673049600",
          "1240082057686683648",
          "1240081924945346560",
          "1236751178050568192"
        ],
        "Wizards and Warriors": [
          "1237598618643337216",
          "1237598399469977600",
          "1237598175703867393",
          "1237598033231757312",
          "1237597756629987328",
          "1237597551729848321",
          "1237597386453295104",
          "1237596915722354688"
        ],
        "The Heroes": [
          "1235975021411704832",
          "1235974950532161536",
          "1235974863114469376",
          "1235974768860082176",
          "1235974680179908608",
          "1235974574781235200",
          "1235974467520303104",
          "1235974358736838656"
        ],
        "The Villains": [
          "1233583711300104192",
          "1233583574993608704",
          "1233583369338486784",
          "1233583172818583552",
          "1233582893779914752",
          "1233582758832386048",
          "1233582625105383424",
          "1233582422252081152"
        ],
        "Gamer Realms": [
          "1231279725565972480",
          "1231279535404613632",
          "1231279411060289536",
          "1231279270848901120",
          "1231278695730130944",
          "1231278520894763008",
          "1231278376124157952",
          "1231278150952960000"
        ],
        "The Avengers": [
          "1229235507087556608",
          "1229235325600026624",
          "1229235149107904512",
          "1229234920463802368",
          "1229234429591818240",
          "1229234146241429504",
          "1229234040515596288",
          "1229234687747051521"
        ],
        "Star Wars": [
          "1226611943922466816",
          "1226611763462549504",
          "1226611529588150272",
          "1226611356535365632",
          "1226610902124482560",
          "1226610663971885056",
          "1226610355413729280",
          "1226608580069687296"
        ],
        "Game of Thrones": [
          "1223841783251738624",
          "1223841691383902208",
          "1223841609146175488",
          "1223841523267801088",
          "1223841415503544320",
          "1223841322201255936",
          "1223841175513874432",
          "1223841048342564864"
        ]
      }
    },

    mini_game: {
      name: "2025 Mini Game",
      divisions: {
        "Division 400s": [
          "1211877557809463296",
          "1211877422299873280",
          "1211877319031926784",
          "1211877193861308416",
          "1211877061417775105",
          "1211876924498919424",
          "1211876342157557760",
          "1211876246275768320",
          "1211876146774290432",
          "1211876028306182144"
        ],
        "Division 300s": [
          "1203413320967667712",
          "1203413200247205888",
          "1203413085184860160",
          "1203412975302479872",
          "1203412646611660800",
          "1203412353681477632",
          "1203412222689157120",
          "1203412032636850176",
          "1203411785261006848",
          "1203411633628528640"
        ],
        "Division 200s": [
          "1197791545584001024",
          "1197791409764048896",
          "1197791127445446656",
          "1197790908414689280",
          "1197790768404643854",
          "1197790562833420288",
          "1197790405148557312",
          "1197790201145987072",
          "1197789969783980032",
          "1197395516766289920"
        ],
        "Division 100s": [
          "1193787275249246208",
          "1193787064344080384",
          "1193786911548526592",
          "1193786714844381184",
          "1193786499282890752",
          "1193786240147550208",
          "1193785541374545920",
          "1193785376887574528",
          "1193784925865218048",
          "1193784514820370432"
        ]
      }
    },

    redraft_2025: {
        name: "2025 Redraft",
        divisions: {
        "All": [
          "1255288335568490496",
          "1255288192051990528",
          "1255287978423504896",
          "1255287803600715776",
          "1255287431989575680",
          "1255287171217113089",
          "1255286216937459712",
          "1255285810786209792",
          "1255285320170090496",
          "1255285048068812802"
        ]
      }
    },
    triathlon: {
      name: "2025 Triathlon",
      divisions: {
        "Romans": [
          "1248763372128706560",
          "1248762972466073600",
          "1231418044421521408",
          "1231417737801105408",
          "1218702306590072832",
          "1218702136909512705",
          "1212974613181513728",
          "1212974482948378624"
        ],
        "Greeks": [
          "1248762436618567680",
          "1248761188276240384",
          "1231417454689779712",
          "1231417314214154240",
          "1218701899885191168",
          "1218701807333675008",
          "1212974238936350721",
          "1212974099479941120"
        ],
        "Egyptians": [
          "1248760700227047424",
          "1248759939321577472",
          "1231417137134841856",
          "1231416906401984512",
          "1218701651540459520",
          "1218701332836265984",
          "1212973917774290944",
          "1212967422475112448"
        ]
      }
    },

    dynasty: {
      name: "2025 Dynasty",
      divisions: {
        "Dragons of Dynasty": [
          "1211843117481730048",
          "1211843011340668928",
          "1211842907326136320",
          "1208194980154200081",
          "1201362833741185024",
          "1201362405729251328",
          "1195877478497783808",
          "1195877324013191168",
          "1193232605812826112",
          "1193089764030472192",
          "1189763370874486784",
          "1189763229441921024",
          "1189763145483796480",
          "1189762980392165376",
          "1189426381956354048",
          ],

        "Heroes of Dynasty": [
          "1183218710324412416",
          "1183216824196034560",
          "1183215347088457728",
          "1183212007243186176",
          "1183209678813143040",
          "1183207209777987584",
          "1183205535590719488",
          "1183192311432261632",
          "1183190574903320576",
          "1183188650580836352",
          "1183184007500521472",
          "1183181430795624448",
          "1183178974482612224",
          "1183165958661529600",
          "1183163017793847296",
          "1183160615865257984"
        ]
      }
    }
  },

  "2024": {
    dynasty: {
      name: "2024 Dynasty",
      divisions: {
        "Dynasty Leagues": [
          "1048724101956759552",
          "1048816365022470144",
          "1049013976874565632",
          "1049167929297723392",
          "1056426042719637504",
          "1056674173751250944",
          "1057068627473616896",
          "1058622402705436672",
          "1059232900375216128",
          "1059369854685294592",
          "1101337091729977344",
          "1101337456936439808",
          "1103879314824585216",
          "1104456170539982848",
          "1104474138405683200",
          "1126351293326544896"
        ]
      }
    },

    big_game: {
      name: "2024 Big Game",
      divisions: {
        "The Boys": [
          "1123827987570470912",
          "1123827803780186112",
          "1123827724960866304",
          "1123827660926406656",
          "1123827573617790976",
          "1123827490755031040",
          "1123827419460358144",
          "1123826825777467392"
        ],
        "Character Unlocks": [
          "1120745038469898240",
          "1120744950632632320",
          "1120744871058325504",
          "1120744703345000448",
          "1120744628711464960",
          "1120744525225459712",
          "1120744406925012992",
          "1120744290046541824"
        ],
        "Transformers": [
          "1109161129844101120",
          "1109161054732509184",
          "1109160979520184320",
          "1109160915569790976",
          "1109160492251127808",
          "1109160423368114176",
          "1109160351624515584",
          "1109160258435620864"
        ],
        "Pokemon": [
          "1106606152273727488",
          "1106606009629392896",
          "1106605854230482944",
          "1106605702665302016",
          "1106604722338979840",
          "1106604579740983296",
          "1106604289545482240",
          "1106604184754995200"
        ],
        "The ALL-STARS": [
          "1102374857863458816",
          "1102374736048275456",
          "1102374644071370752",
          "1102374549376720896",
          "1102374448537141248",
          "1102374353548828672",
          "1088645433498439680",
          "1081753145581162496"
        ],
        "Wizards and Warriors": [
          "1100462770123812864",
          "1100462557040660480",
          "1100462473905364992",
          "1100462329713479680",
          "1100462231411724288",
          "1100462153955418112",
          "1100462033612464128",
          "1100461937919348736"
        ],
        "The Heroes": [
          "1097054393586876416",
          "1097054293028331520",
          "1097054186648264704",
          "1097054091819319296",
          "1097053931659767808",
          "1097053837711527936",
          "1097053733990666240",
          "1097053655536066560"
        ],
        "The Villains": [
          "1094775022285107200",
          "1094774938206117888",
          "1094774852499759104",
          "1094774756039106560",
          "1094774685465763840",
          "1094774609586569216",
          "1094774520990277632",
          "1094774407458836480"
        ],
        "Gamer Realms": [
          "1092893132527665152",
          "1092893037111468032",
          "1092892947454087168",
          "1092892689089093632",
          "1092892599247081472",
          "1092892469240352768",
          "1092892287249661952",
          "1092892096933076992"
        ],
        "The Avengers": [
          "1090889545148665856",
          "1090889465624707072",
          "1090889386742325248",
          "1090889279007440896",
          "1090889181473189888",
          "1090889076716158976",
          "1090888946046820352",
          "1090888770674688000"
        ],
        "Star Wars": [
          "1087967573192347648",
          "1087967532830502912",
          "1087967486353502208",
          "1087967410218520576",
          "1087966732775428096",
          "1087965448508989440",
          "1087965394754793472",
          "1087965328610586624"
        ],
        "Game of Thrones": [
          "1078876267329482752",
          "1078876226141376512",
          "1078876173062586368",
          "1078876134856581120",
          "1078875929419698176",
          "1078875880124039168",
          "1078875816169324544",
          "1078875756106878976"
        ]
      }
    },

    mini_game: {
      name: "2024 Mini Game",
      divisions: {
        "Division 400s": [
          "1073400683329626112",
          "1073400568598634496",
          "1073400452538105856",
          "1073043826694119424",
          "1073043745089724416",
          "1073043643453284352",
          "1072399897200009216",
          "1072398487989485568",
          "1072398277724721152",
          "1072398149798490112"
        ],
        "Division 300s": [
          "1070581685659582464",
          "1070581544504426496",
          "1070581446688997376",
          "1070581270146621440",
          "1070522179030323200",
          "1069726832582291456",
          "1069726503388139520",
          "1069726435675426816",
          "1069725978546528256",
          "1069725905272111104"
        ],
        "Division 200s": [
          "1068037348614598656",
          "1068037270491484160",
          "1068037204884267008",
          "1068037126656184320",
          "1067531836819107840",
          "1066628223301251072",
          "1066627744857022464",
          "1066553981574496256",
          "1066552445989371904",
          "1065786845549748224"
        ],
        "Division 100s": [
          "1065347348668203008",
          "1065346719510142976",
          "1065325446180548608",
          "1064463087685799936",
          "1063182022790819840",
          "1063169253563625472",
          "1062933033910689792",
          "1062197844603387904",
          "1062181042263511040",
          "1061534392134344704"
        ]
      }
    },

    redraft: {
      name: "2024 Redraft",
      divisions: {
        "High Tier": [
          "1118637578028285952",
          "1118637496344186880",
          "1118325660805705728",
          "1049771874726744064",
          "1049771551287676928",
          "1049768407602036736",
          "1049768201309167616",
          "1049767991623626752",
          "1049766980884590592",
          "1049766361402511360"
        ],
        "Mid Tier": [
          "1118637390748303360",
          "1049774069039955968",
          "1049774029626195968",
          "1049773996243689472",
          "1049773289264480256",
          "1049773246419480576",
          "1049773189305692160",
          "1049773145559482368",
          "1049773102924410880",
          "1049772301636067328"
        ],
        "Low Tier": [
          "1118571787685613568",
          "1118326982288277504",
          "1049776813788291072",
          "1049776758406848512",
          "1049776727305830400",
          "1049776337101291520",
          "1049776280344514560",
          "1049776237184716800",
          "1049776188291534848",
          "1049774988112576512"
        ]
      }
    }
  }
};
// ---------- HTTP (with retry) ----------
const http = axios.create({ timeout: 20_000 });

async function getWithRetry(url, label = url, retries = RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const { data } = await http.get(url);
      return data;
    } catch (err) {
      const code = err.code || err.response?.status || "ERR";
      if (i === retries - 1) {
        log(`❌ [${label}] failed after ${retries} attempts (${code})`);
        throw err;
      }
      const delay = 500 * (i + 1);
      vlog(`… retrying [${label}] in ${delay}ms (${code})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// ---------- SLEEPER HELPERS ----------
async function fetchLeagueBundle(leagueId) {
  const base = `${SLEEPER}/league/${leagueId}`;
  const [info, rosters, users] = await Promise.all([
    getWithRetry(base, `league:${leagueId}`),
    getWithRetry(`${base}/rosters`, `rosters:${leagueId}`),
    getWithRetry(`${base}/users`, `users:${leagueId}`),
  ]);

  // Build owner map
  const userNameById = {};
  for (const u of users || []) userNameById[u.user_id] = u.display_name;

  const ownedRosters = (rosters || []).filter((r) => !!r.owner_id);
  const total = info.total_rosters ?? rosters?.length ?? 0;
  const owned = ownedRosters.length;
  const isFull = owned === total && total > 0;

  // Collect owner ids for unique counting
  const ownerIds = ownedRosters.map((r) => r.owner_id);

  return {
    leagueId,
    leagueName: info.name || `League ${leagueId}`,
    totalRosters: total,
    ownedRosters: owned,
    isFull,
    ownerIds,
    userNameById,
  };
}

// ---------- RUN ----------
async function main() {
  if (!LEAGUE_MAP[YEAR]) {
    log(`❌ Year "${YEAR}" not found in LEAGUE_MAP`);
    process.exit(1);
  }

  hr();
  log(`🔎 Verifying counts for YEAR=${YEAR}`);
  hr();

  const categories = Object.entries(LEAGUE_MAP[YEAR]); // [categoryKey, details]

  // Global accumulators
  let globalTotals = {
    leaguesTotal: 0,
    leaguesFull: 0,
    teamsTotalFullLeagues: 0,
    uniqueOwnerIds: new Set(),
  };

  // For CSV: ownerId -> display_name (take first non-empty we see)
  const ownerNameMap = new Map();

  for (const [categoryKey, details] of categories) {
    log(`📂 Category: ${categoryKey} — ${details.name}`);
    const divisions = details.divisions || {};
    const divisionNames = Object.keys(divisions);
    if (divisionNames.length === 0) {
      log(`  (no divisions)`);
      continue;
    }

    let catLeaguesTotal = 0;
    let catLeaguesFull = 0;
    let catTeamsFull = 0;
    const catOwnerIds = new Set();

    for (const divName of divisionNames) {
      const leagueIds = divisions[divName] || [];
      if (leagueIds.length === 0) continue;

      log(`  ▶ Division: ${divName} — ${leagueIds.length} leagues`);

      const bundles = await Promise.all(
        leagueIds.map((leagueId) =>
          limit(async () => {
            try {
              const b = await fetchLeagueBundle(leagueId);
              return b;
            } catch (e) {
              return { leagueId, error: true, err: e };
            }
          })
        )
      );

      for (const b of bundles) {
        catLeaguesTotal++;
        globalTotals.leaguesTotal++;

        if (b.error) {
          log(`     • (${divName}) League ${b.leagueId}: ❌ fetch failed`);
          continue;
        }

        const infoStr = `${b.leagueName} (${b.leagueId})`;
        if (b.isFull) {
          catLeaguesFull++;
          globalTotals.leaguesFull++;
          catTeamsFull += b.totalRosters;
          globalTotals.teamsTotalFullLeagues += b.totalRosters;

          // record owner ids + names (full leagues only)
          for (const id of b.ownerIds) {
            if (!id) continue;
            catOwnerIds.add(id);
            globalTotals.uniqueOwnerIds.add(id);
            const name = b.userNameById[id];
            if (name && !ownerNameMap.has(id)) ownerNameMap.set(id, name);
          }

          vlog(`     • (${divName}) ${infoStr}: ✅ FULL (${b.ownedRosters}/${b.totalRosters})`);
        } else {
          log(
            `     • (${divName}) ${infoStr}: ⛔ NOT FULL (${b.ownedRosters}/${b.totalRosters}) — skipped from totals`
          );
        }
      }
    }

    log(
      `  = ${details.name} | Full: ${catLeaguesFull}/${catLeaguesTotal} leagues | Teams (full only): ${catTeamsFull} | Unique owners (full only): ${catOwnerIds.size}`
    );
    hr();
  }

  // FINAL summary
  log(`✅ YEAR ${YEAR} SUMMARY`);
  log(`   • Full leagues: ${globalTotals.leaguesFull}/${globalTotals.leaguesTotal}`);
  log(`   • Total Teams drafted (full leagues only): ${globalTotals.teamsTotalFullLeagues}`);
  log(`   • Unique Owners in ${YEAR} (full leagues only): ${globalTotals.uniqueOwnerIds.size}`);
  hr();

  // ---------- WRITE CSV ----------
  const ownerCounts = {}; // user_id -> # of teams
  for (const id of globalTotals.uniqueOwnerIds) {
    ownerCounts[id] = 0;
  }

  for (const [id, name] of ownerNameMap.entries()) {
    ownerCounts[id] = 0; // ensure key exists
  }

  // Recount team ownership from the global full-league pass
  for (const [categoryKey, details] of categories) {
    const divisions = details.divisions || {};
    for (const leagueIds of Object.values(divisions)) {
      for (const leagueId of leagueIds) {
        try {
          const b = await fetchLeagueBundle(leagueId);
          if (b.isFull) {
            for (const oid of b.ownerIds) {
              if (globalTotals.uniqueOwnerIds.has(oid)) {
                ownerCounts[oid] = (ownerCounts[oid] || 0) + 1;
              }
            }
          }
        } catch (e) {
          // skip
        }
      }
    }
  }

  // Sort owners by name
  const ids = Array.from(globalTotals.uniqueOwnerIds);
  ids.sort((a, b) => {
    const na = (ownerNameMap.get(a) || "").toLowerCase();
    const nb = (ownerNameMap.get(b) || "").toLowerCase();
    if (na && nb) return na.localeCompare(nb);
    if (na) return -1;
    if (nb) return 1;
    return String(a).localeCompare(String(b));
  });

  // Build CSV lines
  const lines = ["No.,user_id,display_name,team_count"];
  ids.forEach((id, i) => {
    const name = (ownerNameMap.get(id) || "").replaceAll('"', '""');
    const count = ownerCounts[id] || 0;
    lines.push(`${i + 1},"${id}","${name}",${count}`);
  });

  fs.writeFileSync(CSV_OUT, lines.join("\n"), "utf8");
  log(`📝 CSV written: ${CSV_OUT} (${ids.length} unique owners)`);
  hr();

}

main().catch((e) => {
  log("Fatal error:", e?.message || e);
  process.exit(1);
});