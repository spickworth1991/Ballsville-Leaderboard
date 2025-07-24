import axios from "axios";

const DIVISION_MAP = {
  "Division 1": ["1078876267329482752"],// Add more league IDs as needed
  "Division 2": ["1120744406925012992"]
};

export default async function handler(req, res) {
  const { division } = req.query;
  const leagueIds = division && DIVISION_MAP[division] ? DIVISION_MAP[division] : ["1078876267329482752"];
  
  let allOwners = {};
  let weeksSet = new Set();

  try {
    for (const leagueId of leagueIds) {
      const baseUrl = `https://api.sleeper.app/v1/league/${leagueId}`;
      const users = await axios.get(`${baseUrl}/users`).then(r => r.data);
      const rosters = await axios.get(`${baseUrl}/rosters`).then(r => r.data);

      const userMap = {};
      users.forEach(u => userMap[u.user_id] = u.display_name);

      const rosterMap = {};
      rosters.forEach(r => rosterMap[r.roster_id] = r.owner_id);

      let week = 1;
      while (true) {
        const matchups = await axios.get(`${baseUrl}/matchups/${week}`).then(r => r.data);
        if (!matchups.length) break;

        matchups.forEach(m => {
          const ownerId = rosterMap[m.roster_id];
          if (ownerId) {
            const name = userMap[ownerId];
            const pts = (m.starters_points || []).reduce((a, b) => a + b, 0);
            if (!allOwners[name]) {
              allOwners[name] = { weekly: {}, total: 0, leagues: [] };
            }
            allOwners[name].weekly[week] = (allOwners[name].weekly[week] || 0) + pts;
          }
        });
        weeksSet.add(week);
        week++;
      }

      rosters.forEach(r => {
        const ownerId = r.owner_id;
        const name = userMap[ownerId];
        const total = parseFloat(`${r.settings.fpts}.${String(r.settings.fpts_decimal).padStart(2, '0')}`);
        if (!allOwners[name]) {
          allOwners[name] = { weekly: {}, total: 0, leagues: [] };
        }
        allOwners[name].total += total;
        allOwners[name].leagues.push({ league_name: `League ${leagueId}`, points: total });
      });
    }

    res.status(200).json({ owners: allOwners, weeks: [...weeksSet].sort() });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
}