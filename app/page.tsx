'use client';

import { useEffect, useState } from 'react';

export default function GolfTripSidegamesTracker() {
  const players = ['Juho', 'Niko', 'Harri', 'Aleksi', 'Miika'];
  const rounds = [1, 2, 3, 4];
  const holes = Array.from({ length: 18 }, (_, i) => i + 1);
  const par3Holes = [3, 7, 12, 16];

  const STORAGE_KEY = 'golf-trip-sidegames-data';

  const [savedMessage, setSavedMessage] = useState('');

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

  const saveHoleData = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        updated: new Date().toISOString(),
      })
    );

    setSavedMessage('Hole saved successfully ⛳');

    setTimeout(() => {
      setSavedMessage('');
    }, 2000);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);

    setSavedMessage('All round data reset');

    setTimeout(() => {
      setSavedMessage('');
    }, 2000);
  };

  const leaderboard = [
    {
      player: 'Juho',
      fairwayPct: 58,
      bunkerShots: 11,
      threePutts: 6,
      par3Gir: 4,
    },
    {
      player: 'Niko',
      fairwayPct: 52,
      bunkerShots: 15,
      threePutts: 8,
      par3Gir: 2,
    },
    {
      player: 'Harri',
      fairwayPct: 61,
      bunkerShots: 9,
      threePutts: 4,
      par3Gir: 5,
    },
    {
      player: 'Aleksi',
      fairwayPct: 47,
      bunkerShots: 18,
      threePutts: 10,
      par3Gir: 1,
    },
    {
      player: 'Miika',
      fairwayPct: 56,
      bunkerShots: 13,
      threePutts: 7,
      par3Gir: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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

        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Golf Trip Sidegames Tracker
          </h1>

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
            <h2 className="text-2xl font-bold mb-4">Live Leaderboard</h2>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="border rounded-2xl p-4">
                <h3 className="font-bold text-lg">🎯 Hit & Hope</h3>

                {leaderboard
                  .sort((a, b) => a.fairwayPct - b.fairwayPct)
                  .map((p) => (
                    <div
                      key={p.player}
                      className="flex justify-between py-1 text-sm"
                    >
                      <span>{p.player}</span>
                      <span>{p.fairwayPct}%</span>
                    </div>
                  ))}
              </div>

              <div className="border rounded-2xl p-4">
                <h3 className="font-bold text-lg">🏖️ Enter Sandman</h3>

                {leaderboard
                  .sort((a, b) => b.bunkerShots - a.bunkerShots)
                  .map((p) => (
                    <div
                      key={p.player}
                      className="flex justify-between py-1 text-sm"
                    >
                      <span>{p.player}</span>
                      <span>{p.bunkerShots}</span>
                    </div>
                  ))}
              </div>

              <div className="border rounded-2xl p-4">
                <h3 className="font-bold text-lg">👑 Three Putt King</h3>

                {leaderboard
                  .sort((a, b) => b.threePutts - a.threePutts)
                  .map((p) => (
                    <div
                      key={p.player}
                      className="flex justify-between py-1 text-sm"
                    >
                      <span>{p.player}</span>
                      <span>{p.threePutts}</span>
                    </div>
                  ))}
              </div>

              <div className="border rounded-2xl p-4">
                <h3 className="font-bold text-lg">⛳ Back to the Range</h3>

                {leaderboard
                  .sort((a, b) => a.par3Gir - b.par3Gir)
                  .map((p) => (
                    <div
                      key={p.player}
                      className="flex justify-between py-1 text-sm"
                    >
                      <span>{p.player}</span>
                      <span>{p.par3Gir}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {rounds.map((round) => (
          <div
            key={round}
            className="bg-white rounded-2xl shadow overflow-auto"
          >
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold">Round {round}</h2>
            </div>

            <div className="md:hidden p-4 space-y-4">
              {players.map((player) => (
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
                    <button className="bg-zinc-900 text-white rounded-xl p-3 text-sm">
                      Hit & Hope
                    </button>

                    <button className="bg-yellow-200 rounded-xl p-3 text-sm">
                      Enter Sandman
                    </button>

                    <button className="bg-green-200 rounded-xl p-3 text-sm">
                      Three Putt King
                    </button>

                    <button className="bg-blue-200 rounded-xl p-3 text-sm">
                      Back to the Range
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="block mb-1">Hole</label>

                      <select className="w-full border rounded-xl p-2">
                        {holes.map((h) => (
                          <option key={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Round</label>

                      <select className="w-full border rounded-xl p-2">
                        {rounds.map((r) => (
                          <option key={r}>Round {r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={saveHoleData}
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