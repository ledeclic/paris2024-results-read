// Raw data
const DATA_URL = "https://sph-c-api.olympics.com/summer/competition/api/FRA/medals";
const dataRaw = await fetch(DATA_URL).then((x) => x.json());
const useData = dataRaw.medalStandings.medalsTable;

// Data we collect
const NOCs = {};
const Medals = { 
    all: { gold: 0, silver: 0, bronze: 0, sum: 0 }, 
    men: { gold: 0, silver: 0, bronze: 0, sum: 0 }, 
    women: { gold: 0, silver: 0, bronze: 0, sum: 0 }, 
    other: { gold: 0, silver: 0, bronze: 0, sum: 0 } 
};

// ComputeMedalRecord
function ComputeMedalRecord (mn, mt) {
    // array ?
    if (Array.isArray(mt)) {
        let values = mt.map(x => ComputeMedalRecord(mn, x));
        return values.reduce((p, c) => ({ gold: p.gold + c.gold, silver: p.silver + c.silver, bronze: p.bronze + c.bronze, sum: p.sum + c.sum }));
    }
    // return single
    const record = mn.find(x => x.type == mt);
    if (!record) return { gold: 0, silver: 0, bronze: 0, sum: 0 };
    const { total: sum, gold, silver, bronze } = record;
    return { gold, silver, bronze, sum };
}

// Compute data
for (let noc of useData) {
    // Get NOC data
    NOCs[noc.organisation] = { 
        all: ComputeMedalRecord(noc.medalsNumber, "Total"),
        men: ComputeMedalRecord(noc.medalsNumber, "Men"),
        women: ComputeMedalRecord(noc.medalsNumber, "Women"),
        other: ComputeMedalRecord(noc.medalsNumber, ["Open", "Mixed"])
    };
    // Add to globals
    for (let cat in NOCs[noc.organisation]) {
        for (let val in NOCs[noc.organisation][cat]) {
            Medals[cat][val] += NOCs[noc.organisation][cat][val];
        }
    }
}

// Return
console.log(Medals);