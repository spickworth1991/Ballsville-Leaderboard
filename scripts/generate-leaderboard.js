import fs from "fs";
import axios from "axios";

const DIVISION_MAP = {
  "Division 1": [
    "1078876267329482752",
    "1123827660926406656",
    
  ],
  "Division 2": [
    "1120744406925012992",
  ],
  "Division 3": [
    "1123826825777467392"
  ],
  "Division 4": [
    "1090889386742325248"
  ],
  "Division 5": [
    "1102374736048275456",
  ]
};

async function fetchLeaderboard() {
  let owners = [];
  let weeksSet = new Set();
  const leagueNamesByDivision = {};

  for (const [division, leagues] of Object.entries(DIVISION_MAP)) {
    leagueNamesByDivision[division] = [];

    for (const leagueId of leagues) {
      const baseUrl = `https://api.sleeper.app/v1/league/${leagueId}`;
      const leagueInfo = (await axios.get(baseUrl)).data;
      const leagueName = leagueInfo.name;
      leagueNamesByDivision[division].push(leagueName);

      const users = (await axios.get(`${baseUrl}/users`)).data;
      const rosters = (await axios.get(`${baseUrl}/rosters`)).data;
      const userMap = {};
      users.forEach(u => (userMap[u.user_id] = u.display_name));
      const rosterMap = {};
      rosters.forEach(r => (rosterMap[r.roster_id] = r.owner_id));

      let week = 1;
      while (true) {
        const matchups = (await axios.get(`${baseUrl}/matchups/${week}`)).data;
        if (!matchups.length) break;

        matchups.forEach(m => {
          const ownerId = rosterMap[m.roster_id];
          if (ownerId) {
            const name = userMap[ownerId];
            const pts = (m.starters_points || []).reduce((a, b) => a + b, 0);
            let existing = owners.find(
              o => o.ownerName === name && o.leagueName === leagueName
            );
            if (!existing) {
              existing = {
                ownerName: name,
                leagueName,
                division,
                weekly: {},
                total: 0
              };
              owners.push(existing);
            }
            existing.weekly[week] = Number(pts.toFixed(2)); // ✅ Round to 2 decimals
          }
        });

        weeksSet.add(week);
        week++;
      }

      rosters.forEach(r => {
        const ownerId = r.owner_id;
        const name = userMap[ownerId];
        let existing = owners.find(
          o => o.ownerName === name && o.leagueName === leagueName
        );
        if (!existing) {
          existing = {
            ownerName: name,
            leagueName,
            division,
            weekly: {},
            total: 0
          };
          owners.push(existing);
        }
        // Combine official points and decimal for accuracy
        const total = parseFloat(
          `${r.settings.fpts}.${String(r.settings.fpts_decimal).padStart(2, "0")}`
        );
        existing.total = total; // ✅ Keep full precision
      });

    }
  }

  const json = {
    weeks: [...weeksSet].sort((a, b) => a - b),
    owners,
    divisions: Object.keys(DIVISION_MAP),
    leaguesByDivision: leagueNamesByDivision
  };

  fs.writeFileSync("public/data/leaderboard.json", JSON.stringify(json, null, 2));
  console.log("✅ leaderboard.json generated!");
}

fetchLeaderboard().catch(console.error);
