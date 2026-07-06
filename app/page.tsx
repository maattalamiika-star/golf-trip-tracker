'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
export default function GolfTripSidegamesTracker() {
  const players = ['Juho', 'Niko', 'Harri', 'Aleksi', 'Mäde'];
  const rounds = [1, 2, 3, 4];
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const holes = Array.from({ length: 18 }, (_, i) => i + 1);
  

  const STORAGE_KEY = 'golf-trip-sidegames-data';

  const [savedMessage, setSavedMessage] = useState('');
const [bunkerCounts, setBunkerCounts] = useState<
  Record<string, number>
>({});
const [fairwayHits, setFairwayHits] = useState<
  Record<string, boolean>
>({});
const [threePutts, setThreePutts] = useState<
  Record<string, boolean>
>({});
const [par3GirHits, setPar3GirHits] = useState<
  Record<string, boolean>
>({});
const [par3Holes, setPar3Holes] = useState<
  Record<string, boolean>
>({});
const [currentHoles, setCurrentHoles] = useState<
  Record<string, number>
>({});
const [selectedRound, setSelectedRound] = useState(1);
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          updated: new Date().toISOString(),
        })
      );
    }
  }, []);
useEffect(() => {
  const loadHoleData = async () => {
    const { data, error } = await supabase
      .from('hole_data')
      .select('*');

    if (error) {
      console.error('SUPABASE LOAD ERROR:', error);
      return;
    }

    const formattedData =
      data?.map((row) => ({
        player: row.player,
        round: row.round,
        hole: row.hole,
        par3Hole: row.par3_hole,
        fairwayHit: row.fairway_hit,
        bunkerShots: row.bunker_shots,
        threePlusPutts: row.three_plus_putts,
        par3Gir: row.par3_gir,
      })) ?? [];

    setHoleData(formattedData);

    console.log(
      'SUPABASE LOAD OK:',
      formattedData.length,
      'rows'
    );
  };

  loadHoleData();
}, []);
  const saveHoleData = (
  player: string,
  round: number,
  hole: number
) => {
  

  const newEntry = {
  player,
  round,
  hole,

  holeType: 'normal',

  par3Hole:
    par3Holes[
      `${player}-${round}-${hole}`
    ] ?? false,

  fairwayHit:
    fairwayHits[
      `${player}-${round}-${hole}`
    ] ?? false,

  bunkerShots:
    bunkerCounts[
      `${player}-${round}-${hole}`
    ] ?? 0,

  threePlusPutts:
    threePutts[
      `${player}-${round}-${hole}`
    ] || false,

  par3Gir:
    par3GirHits[
      `${player}-${round}-${hole}`
    ] || false,
};

  const filteredData = holeData.filter(
  (h) =>
    !(
      h.player === player &&
      h.round === round &&
      h.hole === hole
    )
);

const updatedData = [
  ...filteredData,
  newEntry,
];
const saveToSupabase = async () => {
  const { error } = await supabase
    .from('hole_data')
    .upsert({
      player: newEntry.player,
      round: newEntry.round,
      hole: newEntry.hole,
      par3_hole: newEntry.par3Hole,
      fairway_hit: newEntry.fairwayHit,
      bunker_shots: newEntry.bunkerShots,
      three_plus_putts: newEntry.threePlusPutts,
      par3_gir: newEntry.par3Gir,
    });

  if (error) {
    console.error('SUPABASE SAVE ERROR:', error);
  } else {
    console.log('SUPABASE SAVE OK');
  }
};

saveToSupabase();
  setHoleData(updatedData);
setCurrentHoles((prev) => ({
  ...prev,
  [`${player}-${round}`]: Math.min(hole + 1, 18),
}));
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedData)
  );

  setSavedMessage(
    `${player} - Round ${round} - Hole ${hole} saved ⛳`
  );

  setTimeout(() => {
    setSavedMessage('');
  }, 2000);
};

  const resetAllData = () => {
    if (selectedPlayer !== 'Mäde') {
  alert('Only Mäde can reset data');
  return;
}
  const confirmation = prompt(
    'Type RESET to delete all data'
  );

  if (confirmation !== 'RESET') {
    return;
  }
const clearSupabase = async () => {
  const { error } = await supabase
    .from('hole_data')
    .delete()
    .neq('id', 0);

  if (error) {
    console.error(
      'SUPABASE RESET ERROR:',
      error
    );
    return;
  }

  console.log('SUPABASE RESET OK');
};

clearSupabase();
  localStorage.removeItem(STORAGE_KEY);

  setHoleData([]);
  setBunkerCounts({});
  setFairwayHits({});
  setThreePutts({});
  setPar3GirHits({});
  setPar3Holes({});
  setCurrentHoles({});

  setSavedMessage('All round data reset');

  setTimeout(() => {
    setSavedMessage('');
  }, 2000);
};

  const [holeData, setHoleData] = useState<any[]>([]);

const calculateLeaderboard = () => {
  return players.map((player) => {
    const playerData = holeData.filter((h) => h.player === player);
const holesPlayed = playerData.length;
   const fairwayHoles = playerData.filter(
  (h) => !h.par3Hole
);

const fairwayHits = fairwayHoles.filter(
  (h) => h.fairwayHit
).length;

const fairwayPct =
  fairwayHoles.length > 0
    ? Math.round(
        (fairwayHits / fairwayHoles.length) * 100
      )
    : 0;

    const bunkerShots = playerData.reduce(
      (sum, h) => sum + (h.bunkerShots || 0),
      0
    );

    const threePutts = playerData.filter(
      (h) => h.threePlusPutts
    ).length;

    const par3HolesPlayed = playerData.filter(
  (h) => h.par3Hole
);

const par3GirHits = par3HolesPlayed.filter(
  (h) => h.par3Gir
).length;

const par3GirPct =
  par3HolesPlayed.length > 0
    ? Math.round(
        (par3GirHits / par3HolesPlayed.length) * 100
      )
    : 0;

return {
  player,
  holesPlayed,
  fairwayPct,
  bunkerShots,
  threePutts,
  par3GirPct,
};
  });
};

const leaderboard = calculateLeaderboard();

const getHoleEntry = (
  player: string,
  round: number,
  hole: number
) => {
  return holeData.find(
    (h) =>
      h.player === player &&
      h.round === round &&
      h.hole === hole
  );
};
  return (
    <div className="min-h-screen bg-zinc-100 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow">
  <label className="text-sm font-semibold block mb-2">
    Select Player
  </label>

  <select
    value={selectedPlayer}
    onChange={(e) => setSelectedPlayer(e.target.value)}
    className="w-full border rounded-xl p-3"
  >
    {players.map((player) => (
      <option key={player} value={player}>
        {player}
      </option>
    ))}
  </select>
</div>
        <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-2xl shadow p-4">
          <div>
            <h2 className="font-bold text-lg">Trip Controls</h2>
            <p className="text-sm text-zinc-500">
              Next.js + localStorage enabled
            </p>
          </div>

          <button
            onClick={resetAllData}
            className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm"
          >
            Reset Data
          </button>
        </div>

        {savedMessage && (
          <div className="bg-green-100 border border-green-300 text-green-800 rounded-2xl p-4">
            {savedMessage}
          </div>
        )}

        <div className="text-center">
  <Image
    src="/KS-golf.png"
    alt="KS Golf Championship"
    width={140}
    height={140}
    className="mx-auto mb-4 rounded-2xl"
    priority
  />

  <h1 className="text-3xl md:text-4xl font-bold">
    KS Golf Championship 2026
  </h1>

  <div className="mt-4 flex gap-2 flex-wrap justify-center">
  {rounds.map((round) => (
    <button
  key={round}
  onClick={() => setSelectedRound(round)}
  className={`px-4 py-2 rounded-xl text-sm font-semibold ${
    selectedRound === round
      ? 'bg-zinc-900 text-white'
      : 'bg-white border'
  }`}
>
  {(() => {
    const holesInRound = holeData.filter(
      (h) =>
        h.player === selectedPlayer &&
        h.round === round
    ).length;

    return holesInRound === 18
      ? `Kierros ${round} ✅`
      : holesInRound > 0
      ? `Kierros ${round} (${holesInRound}/18)`
      : `Kierros ${round}`;
  })()}
</button>
  ))}
</div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="bg-zinc-900 text-white text-xs px-3 py-1 rounded-full">
              PWA Ready
            </span>

            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
              Auto Save
            </span>

            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              Mobile Optimized
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-4 bg-white rounded-2xl shadow p-4">
            <h2 className="text-2xl font-bold mb-4">Tulostaulukko</h2>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="border rounded-2xl p-4">
                <h3 className="font-bold text-lg">🎯 Hit & Hope</h3>

                {[...leaderboard]
  .sort((a, b) => b.fairwayPct - a.fairwayPct)
  .map((p, index) => (
                    <div
                      key={p.player}
                      className="flex justify-between py-1 text-sm"
                    >
                       {['🏆', '😄', '🙂', '🙁', '🥲'][index]} {p.player} ({p.holesPlayed}/72)
                      <span>{p.fairwayPct}%</span>
                    </div>
                  ))}
              </div>

              <div className="border rounded-2xl p-4">
                <h3 className="font-bold text-lg">🏖️ Sand Escape Artist</h3>

                {[...leaderboard]
  .sort((a, b) => a.bunkerShots - b.bunkerShots)
  .map((p, index) => (
                    <div
                      key={p.player}
                      className="flex justify-between py-1 text-sm"
                    >
                      {['🏆', '😄', '🙂', '🙁', '🥲'][index]} {p.player} ({p.holesPlayed}/72)
                      <span>{p.bunkerShots}</span>
                    </div>
                  ))}
              </div>

              <div className="border rounded-2xl p-4">
                <h3 className="font-bold text-lg">👑 Smooth Roller</h3>

                {[...leaderboard]
  .sort((a, b) => a.threePutts - b.threePutts)
  .map((p, index) => (
                    <div
                      key={p.player}
                      className="flex justify-between py-1 text-sm"
                    >
                      {['🏆', '😄', '🙂', '🙁', '🥲'][index]} {p.player} ({p.holesPlayed}/72)
                      <span>{p.threePutts}</span>
                    </div>
                  ))}
              </div>

              <div className="border rounded-2xl p-4">
                <h3 className="font-bold text-lg">⛳ Pin Seeker</h3>

                {[...leaderboard]
  .sort((a, b) => b.par3GirPct - a.par3GirPct)
  .map((p, index) => (
                    <div
                      key={p.player}
                      className="flex justify-between py-1 text-sm"
                    >
                      {['🏆', '😄', '🙂', '🙁', '🥲'][index]} {p.player} ({p.holesPlayed}/72)
                      <span>{p.par3GirPct}%</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {rounds
  .filter((round) => round === selectedRound)
  .map((round) => (
          <div
            key={round}
            className="bg-white rounded-2xl shadow overflow-auto"
          >
            <div className="p-4 border-b">
  <h2 className="text-2xl font-bold">
    Kierros {round}
  </h2>
</div>

            <div className="md:hidden p-4 space-y-4">
              {players
  .filter((player) => player === selectedPlayer)
  .map((player) => (
                <div
                  key={player}
                  className="border rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{player}</h3>

                    <span className="text-xs bg-zinc-200 px-2 py-1 rounded-full">
                      Mobile Entry
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
  onClick={() => {
    const key = `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`;

    setFairwayHits((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }}
  className={`rounded-xl p-3 text-sm font-semibold ${
    (
  fairwayHits[
    `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`
  ] ??
  getHoleEntry(
    player,
    round,
    currentHoles[`${player}-${round}`] || 1
  )?.fairwayHit
)
      ? 'bg-green-600 text-white'
      : 'bg-zinc-300'
  }`}
>
  Fairway Finder
</button>
<button
  onClick={() => {
    const key = `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`;

    setPar3Holes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }}
  className={`rounded-xl p-3 text-sm font-semibold ${
    par3Holes[
      `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`
    ]
      ? 'bg-purple-700 text-white'
      : 'bg-purple-200'
  }`}
>
  Par 3 Hole
</button>

                    <div className="bg-yellow-200 rounded-xl p-3 text-sm space-y-2">
  <div className="font-semibold">Enter Sandman</div>

  <div className="flex items-center justify-between">
    <button
  className="bg-black text-white w-8 h-8 rounded-full"
  onClick={() => {
  const key = `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`;

  setBunkerCounts((prev) => ({
    ...prev,
    [key]: Math.max((prev[key] ?? 0) - 1, 0),
  }));
}}
>
  -
</button>

   <span className="text-lg font-bold">
  {
    bunkerCounts[
      `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`
    ] ??
      getHoleEntry(
        player,
        round,
        currentHoles[`${player}-${round}`] || 1
      )?.bunkerShots ??
      0
  }
</span>

    <button
  className="bg-black text-white w-8 h-8 rounded-full"
  onClick={() => {
  const key = `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`;

  setBunkerCounts((prev) => ({
    ...prev,
    [key]: (prev[key] ?? 0) + 1,
  }));
}}
>
  +
</button>
  </div>
</div>

                    <button
  onClick={() => {
    const key = `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`;

    setThreePutts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }}
  className={`rounded-xl p-3 text-sm font-semibold ${
  threePutts[
  `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`
] ??
getHoleEntry(
  player,
  round,
  currentHoles[`${player}-${round}`] || 1
)?.threePlusPutts
    ? 'bg-green-700 text-white'
    : 'bg-green-200'
}`}
>
  3+ Putts
</button>

                    <button
  onClick={() => {
    const key = `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`;

    setPar3GirHits((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }}
  className={`rounded-xl p-3 text-sm font-semibold ${
  par3GirHits[
  `${player}-${round}-${currentHoles[`${player}-${round}`] || 1}`
] ??
getHoleEntry(
  player,
  round,
  currentHoles[`${player}-${round}`] || 1
)?.par3Gir
    ? 'bg-blue-700 text-white'
    : 'bg-blue-200'
}`}
>
  Pin Seeker
</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="block mb-1">Hole</label>

                      <select
  className="w-full border rounded-xl p-2"
  value={
    currentHoles[`${player}-${round}`] || 1
  }
  onChange={(e) => {
    setCurrentHoles((prev) => ({
      ...prev,
      [`${player}-${round}`]: Number(e.target.value),
    }));
  }}
>
                        {holes.map((h) => (
                          <option key={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    
</div>

<div className="pt-2">
  <div className="flex justify-between text-sm mb-1">
    <span>Kierroksen edistyminen</span>

    <span>
  {holeData.filter(
    (h) =>
      h.player === player &&
      h.round === round
  ).length >= 18
    ? '✅ Kierros valmis'
    : `${
        holeData.filter(
          (h) =>
            h.player === player &&
            h.round === round
        ).length
      } / 18`}
</span>
  </div>

  <div className="w-full bg-zinc-200 rounded-full h-3 overflow-hidden">
    <div
      className="bg-green-600 h-full transition-all"
      style={{
        width: `${
  (
    holeData.filter(
      (h) =>
        h.player === player &&
        h.round === round
    ).length / 18
  ) * 100
}%`,
      }}
    ></div>
  </div>
</div>

<button
  onClick={() =>
    saveHoleData(
      player,
      round,
      currentHoles[`${player}-${round}`] || 1
    )
  }
  className="w-full bg-zinc-900 text-white rounded-2xl p-3 font-semibold"
>
  Save Hole
</button>
</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}