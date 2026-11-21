import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Save, 
  Check, 
  Zap, 
  Sun, 
  Moon, 
  Shield, 
  Flame, 
  Users, 
  Clock, 
  CloudRain, 
  Compass, 
  Sparkles,
  Info,
  Bot,
  Plane,
  Database,
  HeartPulse,
  Activity,
  Wind
} from 'lucide-react';
import { rconService } from '../services/rconService';

interface ConvarState {
  decayScale: number;
  decayUpkeep: boolean;
  serverStability: boolean;
  serverRadiation: boolean;
  serverPve: boolean;
  teamSize: number;
  dayLength: number;
  bradleyEnabled: boolean;
  aiMove: boolean;
  aiThink: boolean;
  aiIgnorePlayers: boolean;
  // Card 5: Patrol Heli & World Events
  heliLifetime: number;
  heliGuns: boolean;
  cargoDuration: number;
  // Card 6: Weather & Atmosphere
  envTime: number;
  weatherRain: number;
  weatherFog: number;
  weatherWind: number;
  // Card 7: World Persistence & Cleanup
  saveInterval: number;
  itemDespawn: number;
  corpseDespawn: number;
  npcCorpseDespawn: number;
  // Card 8: Player Recovery & Mechanics
  crawlingEnabled: boolean;
  woundedRecoverChance: number;
  respawnBagAddition: number;
}

const DEFAULT_CONVARS: ConvarState = {
  decayScale: 1.0,
  decayUpkeep: true,
  serverStability: true,
  serverRadiation: true,
  serverPve: false,
  teamSize: 8,
  dayLength: 45,
  bradleyEnabled: true,
  aiMove: true,
  aiThink: true,
  aiIgnorePlayers: false,
  heliLifetime: 30,
  heliGuns: true,
  cargoDuration: 50,
  envTime: 12.0,
  weatherRain: -1,
  weatherFog: -1,
  weatherWind: -1,
  saveInterval: 600,
  itemDespawn: 300,
  corpseDespawn: 300,
  npcCorpseDespawn: 600,
  crawlingEnabled: true,
  woundedRecoverChance: 0.2,
  respawnBagAddition: 0
};

export const ConvarsTab: React.FC = () => {
  const [convars, setConvars] = useState<ConvarState>(DEFAULT_CONVARS);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsub = rconService.onStateChange((state) => {
      if (state === 'connected') {
        fetchCurrentConvars();
      }
    });
    return unsub;
  }, []);

  const safeQuery = async (cmd: string): Promise<string | undefined> => {
    try {
      const res = await Promise.race([
        rconService.sendCommand(cmd, true),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ]);
      return res?.Message;
    } catch {
      return undefined;
    }
  };

  const parseNumber = (text?: string, fallback: number = 0): number => {
    if (!text) return fallback;
    const match = text.match(/:\s*"?(-?[0-9.]+)"?/);
    return match ? parseFloat(match[1]) : fallback;
  };

  const parseBool = (text?: string, fallback: boolean = true): boolean => {
    if (!text) return fallback;
    const lower = text.toLowerCase();
    if (lower.includes('true') || lower.includes('"true"')) return true;
    if (lower.includes('false') || lower.includes('"false"')) return false;
    return fallback;
  };

  const fetchCurrentConvars = async () => {
    setIsLoading(true);
    try {
      const [
        decayMsg,
        stabilityMsg,
        radMsg,
        teamMsg,
        dayMsg,
        pveMsg,
        bradleyMsg,
        aiMoveMsg,
        aiThinkMsg,
        aiIgnoreMsg,
        heliLifeMsg,
        heliGunsMsg,
        cargoDurMsg,
        envTimeMsg,
        rainMsg,
        fogMsg,
        windMsg,
        saveIntMsg,
        itemDespawnMsg,
        corpseDespawnMsg,
        npcCorpseMsg,
        crawlingMsg,
        recoverChanceMsg,
        respawnBagMsg
      ] = await Promise.all([
        safeQuery('decay.scale'),
        safeQuery('server.stability'),
        safeQuery('server.radiation'),
        safeQuery('relationshipmanager.maxteamsize'),
        safeQuery('env.daylength'),
        safeQuery('server.pve'),
        safeQuery('bradley.enabled'),
        safeQuery('ai.move'),
        safeQuery('ai.think'),
        safeQuery('ai.ignoreplayers'),
        safeQuery('heli.lifetimeminutes'),
        safeQuery('heli.guns'),
        safeQuery('cargoship.event_duration_minutes'),
        safeQuery('env.time'),
        safeQuery('weather.rain'),
        safeQuery('weather.fog'),
        safeQuery('weather.wind'),
        safeQuery('server.saveinterval'),
        safeQuery('server.itemdespawn'),
        safeQuery('server.corpsedespawn'),
        safeQuery('server.npccorpsedespawn'),
        safeQuery('server.crawlingenabled'),
        safeQuery('server.woundedrecoverchance'),
        safeQuery('server.respawntimeadditionbag')
      ]);

      setConvars((prev) => ({
        ...prev,
        decayScale: parseNumber(decayMsg, prev.decayScale),
        serverStability: parseBool(stabilityMsg, prev.serverStability),
        serverRadiation: parseBool(radMsg, prev.serverRadiation),
        serverPve: parseBool(pveMsg, prev.serverPve),
        bradleyEnabled: parseBool(bradleyMsg, prev.bradleyEnabled),
        teamSize: parseNumber(teamMsg, prev.teamSize),
        dayLength: parseNumber(dayMsg, prev.dayLength),
        aiMove: parseBool(aiMoveMsg, prev.aiMove),
        aiThink: parseBool(aiThinkMsg, prev.aiThink),
        aiIgnorePlayers: parseBool(aiIgnoreMsg, prev.aiIgnorePlayers),
        heliLifetime: parseNumber(heliLifeMsg, prev.heliLifetime),
        heliGuns: heliGunsMsg ? parseNumber(heliGunsMsg, 1) > 0 : prev.heliGuns,
        cargoDuration: parseNumber(cargoDurMsg, prev.cargoDuration),
        envTime: parseNumber(envTimeMsg, prev.envTime),
        weatherRain: parseNumber(rainMsg, prev.weatherRain),
        weatherFog: parseNumber(fogMsg, prev.weatherFog),
        weatherWind: parseNumber(windMsg, prev.weatherWind),
        saveInterval: parseNumber(saveIntMsg, prev.saveInterval),
        itemDespawn: parseNumber(itemDespawnMsg, prev.itemDespawn),
        corpseDespawn: parseNumber(corpseDespawnMsg, prev.corpseDespawn),
        npcCorpseDespawn: parseNumber(npcCorpseMsg, prev.npcCorpseDespawn),
        crawlingEnabled: parseBool(crawlingMsg, prev.crawlingEnabled),
        woundedRecoverChance: parseNumber(recoverChanceMsg, prev.woundedRecoverChance),
        respawnBagAddition: parseNumber(respawnBagMsg, prev.respawnBagAddition)
      }));
    } catch (err) {
      console.error('fetchCurrentConvars error:', err);
    }
    setIsLoading(false);
  };

  const applyConvar = async (command: string, label: string) => {
    try {
      await rconService.sendCommand(command);
      setToast(`Applied: ${label}`);
      setTimeout(() => setToast(null), 2500);
    } catch (err: any) {
      setToast(`Failed: ${err.message}`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const applyPreset = async (preset: 'vanilla' | 'creative' | 'hardcore') => {
    if (preset === 'vanilla') {
      await rconService.sendCommand('decay.scale 1.0');
      await rconService.sendCommand('decay.upkeep true');
      await rconService.sendCommand('server.stability true');
      await rconService.sendCommand('server.radiation true');
      await rconService.sendCommand('server.pve false');
      await rconService.sendCommand('relationshipmanager.maxteamsize 8');
      await rconService.sendCommand('ai.move true');
      await rconService.sendCommand('ai.think true');
      await rconService.sendCommand('ai.ignoreplayers false');
      await rconService.sendCommand('heli.lifetimeminutes 30');
      await rconService.sendCommand('heli.guns 1');
      await rconService.sendCommand('cargoship.event_duration_minutes 50');
      await rconService.sendCommand('server.saveinterval 600');
      await rconService.sendCommand('server.itemdespawn 300');
      await rconService.sendCommand('server.corpsedespawn 300');
      await rconService.sendCommand('server.crawlingenabled true');
      await rconService.sendCommand('server.woundedrecoverchance 0.2');
      await rconService.sendCommand('server.respawntimeadditionbag 0');
      setConvars((prev) => ({ 
        ...prev, 
        decayScale: 1.0, 
        decayUpkeep: true, 
        serverStability: true, 
        serverRadiation: true, 
        serverPve: false, 
        teamSize: 8,
        aiMove: true,
        aiThink: true,
        aiIgnorePlayers: false,
        heliLifetime: 30,
        heliGuns: true,
        cargoDuration: 50,
        saveInterval: 600,
        itemDespawn: 300,
        corpseDespawn: 300,
        crawlingEnabled: true,
        woundedRecoverChance: 0.2,
        respawnBagAddition: 0
      }));
      setToast('Applied "Vanilla Competitive" Ruleset');
    } else if (preset === 'creative') {
      await rconService.sendCommand('decay.scale 0.0');
      await rconService.sendCommand('decay.upkeep false');
      await rconService.sendCommand('server.stability false');
      await rconService.sendCommand('server.radiation false');
      await rconService.sendCommand('server.pve true');
      await rconService.sendCommand('env.daylength 120');
      await rconService.sendCommand('ai.move false');
      await rconService.sendCommand('ai.think false');
      await rconService.sendCommand('ai.ignoreplayers true');
      await rconService.sendCommand('heli.lifetimeminutes 0');
      await rconService.sendCommand('heli.guns 0');
      await rconService.sendCommand('weather.reset');
      await rconService.sendCommand('server.saveinterval 300');
      await rconService.sendCommand('server.crawlingenabled true');
      await rconService.sendCommand('server.woundedrecoverchance 1.0');
      setConvars((prev) => ({ 
        ...prev, 
        decayScale: 0.0, 
        decayUpkeep: false, 
        serverStability: false, 
        serverRadiation: false, 
        serverPve: true, 
        dayLength: 120, 
        aiMove: false,
        aiThink: false,
        aiIgnorePlayers: true,
        heliLifetime: 0,
        heliGuns: false,
        weatherRain: -1,
        weatherFog: -1,
        weatherWind: -1,
        saveInterval: 300,
        crawlingEnabled: true,
        woundedRecoverChance: 1.0
      }));
      setToast('Applied "Build & Creative Sandbox" Ruleset');
    } else if (preset === 'hardcore') {
      await rconService.sendCommand('decay.scale 1.5');
      await rconService.sendCommand('relationshipmanager.maxteamsize 1');
      await rconService.sendCommand('server.stability true');
      await rconService.sendCommand('server.radiation true');
      await rconService.sendCommand('ai.move true');
      await rconService.sendCommand('ai.think true');
      await rconService.sendCommand('ai.ignoreplayers false');
      await rconService.sendCommand('heli.lifetimeminutes 45');
      await rconService.sendCommand('heli.guns 1');
      await rconService.sendCommand('server.crawlingenabled false');
      await rconService.sendCommand('server.woundedrecoverchance 0.05');
      await rconService.sendCommand('server.respawntimeadditionbag 15');
      setConvars((prev) => ({ 
        ...prev, 
        decayScale: 1.5, 
        teamSize: 1,
        aiMove: true,
        aiThink: true,
        aiIgnorePlayers: false,
        heliLifetime: 45,
        heliGuns: true,
        crawlingEnabled: false,
        woundedRecoverChance: 0.05,
        respawnBagAddition: 15
      }));
      setToast('Applied "Solo Hardcore" Ruleset');
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      {/* Toast Alert: Fixed and independent of document layout flow to prevent tile shifting */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-800 border border-rust-500/50 text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center space-x-2 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Zap className="w-4 h-4 text-rust-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Header and Preset Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <Sliders className="w-5 h-5 text-rust-500 shrink-0" />
          <div>
            <h2 className="text-base font-bold text-zinc-100">Server Rules & Convar Manager</h2>
            <p className="text-xs text-zinc-400">Live gameplay mechanics, decay scaling, team sizes, and environmental physics</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Presets:</span>
          <button
            onClick={() => applyPreset('vanilla')}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors"
          >
            Vanilla
          </button>
          <button
            onClick={() => applyPreset('creative')}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 rounded text-xs font-medium transition-colors"
          >
            Build / Creative
          </button>
          <button
            onClick={() => applyPreset('hardcore')}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-rose-400 rounded text-xs font-medium transition-colors"
          >
            Solo Hardcore
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Building & Decay */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-rust-400" />
              <h3 className="font-bold text-sm text-zinc-100">Building & Upkeep</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">decay.*</span>
          </div>

          {/* Decay Scale */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-300 font-medium">Decay Scale (Multiplier)</span>
              <span className="font-mono text-rust-400 font-bold">{convars.decayScale}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={convars.decayScale}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setConvars((p) => ({ ...p, decayScale: val }));
                applyConvar(`decay.scale ${val}`, `Decay Scale ${val}x`);
              }}
              className="w-full accent-rust-500 cursor-pointer"
            />
            <span className="text-[11px] text-zinc-500 block mt-0.5">
              {convars.decayScale === 0 ? 'No Decay (Infinite base life)' : convars.decayScale === 1 ? 'Vanilla Standard' : 'Accelerated Decay'}
            </span>
          </div>

          {/* Upkeep Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-zinc-300 font-medium block">Tool Cupboard Upkeep</span>
              <span className="text-[11px] text-zinc-500">decay.upkeep</span>
            </div>
            <button
              onClick={() => {
                const next = !convars.decayUpkeep;
                setConvars((p) => ({ ...p, decayUpkeep: next }));
                applyConvar(`decay.upkeep ${next}`, `Upkeep ${next ? 'Enabled' : 'Disabled'}`);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                convars.decayUpkeep
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {convars.decayUpkeep ? 'Active' : 'Disabled'}
            </button>
          </div>

          {/* Structural Stability Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-zinc-300 font-medium block">Building Stability</span>
              <span className="text-[11px] text-zinc-500">server.stability</span>
            </div>
            <button
              onClick={() => {
                const next = !convars.serverStability;
                setConvars((p) => ({ ...p, serverStability: next }));
                applyConvar(`server.stability ${next}`, `Stability ${next ? 'Active' : 'Disabled'}`);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                convars.serverStability
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-rose-950 text-rose-400 border border-rose-800/60'
              }`}
            >
              {convars.serverStability ? 'Enabled' : 'Off (Skybases Allowed)'}
            </button>
          </div>
        </div>

        {/* Card 2: Environment & Time Cycles */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-zinc-100">Day & Night Cycles</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">env.*</span>
          </div>

          {/* Daytime Duration */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-300 font-medium">Day Cycle Length</span>
              <span className="font-mono text-amber-400 font-bold">{convars.dayLength} mins</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={convars.dayLength}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setConvars((p) => ({ ...p, dayLength: val }));
                applyConvar(`env.daylength ${val}`, `Day length ${val}m`);
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <button
                type="button"
                onClick={() => {
                  setConvars((p) => ({ ...p, dayLength: 15 }));
                  applyConvar('env.daylength 15', 'Fast Day (15m)');
                }}
                className="hover:text-amber-400 transition-colors"
              >
                Fast (15m)
              </button>
              <button
                type="button"
                onClick={() => {
                  setConvars((p) => ({ ...p, dayLength: 45 }));
                  applyConvar('env.daylength 45', 'Standard (45m)');
                }}
                className="hover:text-amber-400 transition-colors"
              >
                Standard (45m)
              </button>
              <button
                type="button"
                onClick={() => {
                  setConvars((p) => ({ ...p, dayLength: 120 }));
                  applyConvar('env.daylength 120', 'Long Day (120m)');
                }}
                className="hover:text-amber-400 transition-colors"
              >
                Long (120m)
              </button>
            </div>
          </div>

          {/* Radiation Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-zinc-300 font-medium block">Monument Radiation</span>
              <span className="text-[11px] text-zinc-500">server.radiation</span>
            </div>
            <button
              onClick={() => {
                const next = !convars.serverRadiation;
                setConvars((p) => ({ ...p, serverRadiation: next }));
                applyConvar(`server.radiation ${next}`, `Radiation ${next ? 'Enabled' : 'Disabled'}`);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                convars.serverRadiation
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {convars.serverRadiation ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Card 3: Teams & Combat Rules */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-rust-400" />
              <h3 className="font-bold text-sm text-zinc-100">Teams & Game Mode</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">server.*</span>
          </div>

          {/* Team Size Limit */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-300 font-medium">Max Team Size Limit</span>
              <span className="font-mono text-rust-400 font-bold">{convars.teamSize} Players</span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="1"
              value={convars.teamSize}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setConvars((p) => ({ ...p, teamSize: val }));
                applyConvar(`relationshipmanager.maxteamsize ${val}`, `Max Team Size ${val}`);
              }}
              className="w-full accent-rust-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
              <span>Solo (1)</span>
              <span>Duo (2)</span>
              <span>Trio (3)</span>
              <span>Squad (4)</span>
              <span>Standard (8)</span>
            </div>
          </div>

          {/* PvE Mode Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-zinc-300 font-medium block">PvE Only Mode</span>
              <span className="text-[11px] text-zinc-500">server.pve (Blocks player damage)</span>
            </div>
            <button
              onClick={() => {
                const next = !convars.serverPve;
                setConvars((p) => ({ ...p, serverPve: next }));
                applyConvar(`server.pve ${next}`, `PvE Mode ${next ? 'Enabled' : 'Disabled'}`);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                convars.serverPve
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {convars.serverPve ? 'PvE Active' : 'PvP Normal'}
            </button>
          </div>

          {/* Bradley APC Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-zinc-300 font-medium block">Bradley APC Spawning</span>
              <span className="text-[11px] text-zinc-500">bradley.enabled</span>
            </div>
            <button
              onClick={() => {
                const next = !convars.bradleyEnabled;
                setConvars((p) => ({ ...p, bradleyEnabled: next }));
                applyConvar(`bradley.enabled ${next}`, `Bradley ${next ? 'Enabled' : 'Disabled'}`);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                convars.bradleyEnabled
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {convars.bradleyEnabled ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Card 4: AI & NPC Behavior */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-zinc-100">AI & NPC Behavior</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">ai.*</span>
            </div>

            {/* AI Movement Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-300 font-medium block">AI Movement</span>
                <span className="text-[11px] text-zinc-500">ai.move (Pathfinding on NavMesh)</span>
              </div>
              <button
                onClick={() => {
                  const next = !convars.aiMove;
                  setConvars((p) => ({ ...p, aiMove: next }));
                  applyConvar(`ai.move ${next}`, `AI Movement ${next ? 'Active' : 'Frozen'}`);
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  convars.aiMove
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {convars.aiMove ? 'Moving' : 'Frozen'}
              </button>
            </div>

            {/* AI Think Logic Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-zinc-300 font-medium block">AI Decision Logic</span>
                <span className="text-[11px] text-zinc-500">ai.think (Brain routines & attacks)</span>
              </div>
              <button
                onClick={() => {
                  const next = !convars.aiThink;
                  setConvars((p) => ({ ...p, aiThink: next }));
                  applyConvar(`ai.think ${next}`, `AI Thinking ${next ? 'Active' : 'Disabled'}`);
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  convars.aiThink
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {convars.aiThink ? 'Active' : 'Disabled'}
              </button>
            </div>

            {/* Ignore Players Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-zinc-300 font-medium block">Ignore Players</span>
                <span className="text-[11px] text-zinc-500">ai.ignoreplayers (Pacify NPCs)</span>
              </div>
              <button
                onClick={() => {
                  const next = !convars.aiIgnorePlayers;
                  setConvars((p) => ({ ...p, aiIgnorePlayers: next }));
                  applyConvar(`ai.ignoreplayers ${next}`, `AI Ignore Players ${next ? 'Enabled' : 'Disabled'}`);
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  convars.aiIgnorePlayers
                    ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {convars.aiIgnorePlayers ? 'Ignoring' : 'Targeting'}
              </button>
            </div>
          </div>

          {/* Quick AI Sync Helper Buttons */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
            <button
              onClick={async () => {
                await rconService.sendCommand('ai.move false');
                await rconService.sendCommand('ai.think false');
                await rconService.sendCommand('ai.ignoreplayers true');
                setConvars((p) => ({ ...p, aiMove: false, aiThink: false, aiIgnorePlayers: true }));
                setToast('Applied RustServer.sh AI: Frozen & Peaceful');
                setTimeout(() => setToast(null), 2500);
              }}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Sets ai.move false, ai.think false, ai.ignoreplayers true (from RustServer.sh)"
            >
              Freeze & Pacify
            </button>
            <button
              onClick={async () => {
                await rconService.sendCommand('ai.move true');
                await rconService.sendCommand('ai.think true');
                await rconService.sendCommand('ai.ignoreplayers false');
                setConvars((p) => ({ ...p, aiMove: true, aiThink: true, aiIgnorePlayers: false }));
                setToast('Restored Normal AI: Active & Hostile');
                setTimeout(() => setToast(null), 2500);
              }}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Sets ai.move true, ai.think true, ai.ignoreplayers false"
            >
              Normal AI
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: World Events, Weather, Persistence & Player Recovery */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 5: Patrol Heli & World Events */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Plane className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-zinc-100">Heli & World Events</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">heli.* / cargoship.*</span>
            </div>

            {/* Heli Lifetime */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Patrol Heli Lifetime</span>
                <span className="font-mono text-amber-400 font-bold">
                  {convars.heliLifetime === 0 ? 'Disabled (0m)' : `${convars.heliLifetime} mins`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={convars.heliLifetime}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setConvars((p) => ({ ...p, heliLifetime: val }));
                  applyConvar(`heli.lifetimeminutes ${val}`, `Heli lifetime ${val}m`);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-500 block mt-0.5">
                {convars.heliLifetime === 0 ? 'Matches RustServer.sh (+heli.lifetimeminutes 0).' : 'Duration patrol heli stays airborne.'}
              </span>
            </div>

            {/* Heli Weapons Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs text-zinc-300 font-medium block">Heli Weapons</span>
                <span className="text-[11px] text-zinc-500">heli.guns (Disarm hardpoints)</span>
              </div>
              <button
                onClick={() => {
                  const next = !convars.heliGuns;
                  setConvars((p) => ({ ...p, heliGuns: next }));
                  applyConvar(`heli.guns ${next ? 1 : 0}`, `Heli Guns ${next ? 'Armed' : 'Disarmed'}`);
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  convars.heliGuns
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {convars.heliGuns ? 'Armed' : 'Disarmed'}
              </button>
            </div>

            {/* Cargo Ship Event Duration */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Cargo Ship Duration</span>
                <span className="font-mono text-rust-400 font-bold">{convars.cargoDuration} mins</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="10"
                value={convars.cargoDuration}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setConvars((p) => ({ ...p, cargoDuration: val }));
                  applyConvar(`cargoship.event_duration_minutes ${val}`, `Cargo duration ${val}m`);
                }}
                className="w-full accent-rust-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Heli Actions */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
            <button
              onClick={() => applyConvar('heli.call', 'Called Patrol Helicopter')}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Executes heli.call to immediately spawn a patrol helicopter"
            >
              Call Heli
            </button>
            <button
              onClick={() => applyConvar('heli.strafe', 'Patrol Helicopter sent away')}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Executes heli.strafe to redirect/retreat helicopter"
            >
              Send Away
            </button>
          </div>
        </div>

        {/* Card 6: Live Weather & Time */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <CloudRain className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm text-zinc-100">Weather & Atmosphere</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">weather.* / env.*</span>
            </div>

            {/* Time of Day */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Time of Day (Hour)</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.floor(convars.envTime).toString().padStart(2, '0')}:
                  {Math.round((convars.envTime % 1) * 60).toString().padStart(2, '0')}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={convars.envTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setConvars((p) => ({ ...p, envTime: val }));
                  applyConvar(`env.time ${val}`, `Time set to ${val}h`);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setConvars((p) => ({ ...p, envTime: 7 }));
                    applyConvar('env.time 7', 'Dawn (07:00)');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Dawn (7)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConvars((p) => ({ ...p, envTime: 12 }));
                    applyConvar('env.time 12', 'Noon (12:00)');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Noon (12)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConvars((p) => ({ ...p, envTime: 19 }));
                    applyConvar('env.time 19', 'Dusk (19:00)');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Dusk (19)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConvars((p) => ({ ...p, envTime: 0 }));
                    applyConvar('env.time 0', 'Night (00:00)');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Night (0)
                </button>
              </div>
            </div>

            {/* Rain Intensity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Rain Storms</span>
                <span className="font-mono text-sky-400 font-bold">
                  {convars.weatherRain < 0 ? 'Dynamic' : `${Math.round(convars.weatherRain * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={convars.weatherRain < 0 ? 0 : convars.weatherRain}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setConvars((p) => ({ ...p, weatherRain: val }));
                  applyConvar(`weather.rain ${val}`, `Rain ${Math.round(val * 100)}%`);
                }}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* Fog Density */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Fog Density</span>
                <span className="font-mono text-zinc-300 font-bold">
                  {convars.weatherFog < 0 ? 'Dynamic' : `${Math.round(convars.weatherFog * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={convars.weatherFog < 0 ? 0 : convars.weatherFog}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setConvars((p) => ({ ...p, weatherFog: val }));
                  applyConvar(`weather.fog ${val}`, `Fog ${Math.round(val * 100)}%`);
                }}
                className="w-full accent-zinc-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Weather Actions */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
            <button
              onClick={async () => {
                await rconService.sendCommand('weather.reset');
                setConvars((p) => ({ ...p, weatherRain: -1, weatherFog: -1, weatherWind: -1 }));
                setToast('Weather Reset: Dynamic Atmospheric Cycles');
                setTimeout(() => setToast(null), 2500);
              }}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Resets weather overrides to dynamic weather system"
            >
              Clear / Reset
            </button>
            <button
              onClick={async () => {
                await rconService.sendCommand('weather.rain 1.0');
                await rconService.sendCommand('weather.fog 0.4');
                await rconService.sendCommand('weather.wind 0.7');
                setConvars((p) => ({ ...p, weatherRain: 1.0, weatherFog: 0.4, weatherWind: 0.7 }));
                setToast('Applied Heavy Rainstorm Weather');
                setTimeout(() => setToast(null), 2500);
              }}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Forces maximum rain with dense fog and high wind"
            >
              Heavy Storm
            </button>
          </div>
        </div>

        {/* Card 7: World Persistence & Cleanup */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-zinc-100">World Cleanup & Saves</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">server.*</span>
            </div>

            {/* Auto-Save Interval */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">World Auto-Save</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {Math.round(convars.saveInterval / 60)} mins ({convars.saveInterval}s)
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="1800"
                step="60"
                value={convars.saveInterval}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setConvars((p) => ({ ...p, saveInterval: val }));
                  applyConvar(`server.saveinterval ${val}`, `Save interval ${val}s`);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-500 block mt-0.5">
                Matches RustServer.sh (+server.saveinterval 600).
              </span>
            </div>

            {/* Dropped Item Despawn */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Dropped Item Despawn</span>
                <span className="font-mono text-zinc-300 font-bold">
                  {Math.round(convars.itemDespawn / 60)} mins ({convars.itemDespawn}s)
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="1800"
                step="60"
                value={convars.itemDespawn}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setConvars((p) => ({ ...p, itemDespawn: val }));
                  applyConvar(`server.itemdespawn ${val}`, `Item despawn ${val}s`);
                }}
                className="w-full accent-zinc-400 cursor-pointer"
              />
            </div>

            {/* Player Corpse Despawn */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Player Corpse Despawn</span>
                <span className="font-mono text-zinc-300 font-bold">
                  {Math.round(convars.corpseDespawn / 60)} mins ({convars.corpseDespawn}s)
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="1800"
                step="60"
                value={convars.corpseDespawn}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setConvars((p) => ({ ...p, corpseDespawn: val }));
                  applyConvar(`server.corpsedespawn ${val}`, `Corpse despawn ${val}s`);
                }}
                className="w-full accent-zinc-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Save Actions */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
            <button
              onClick={() => applyConvar('server.save', 'World Map Saved to Disk')}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Forces an immediate server.save command to write the map file"
            >
              Save Now
            </button>
            <button
              onClick={async () => {
                await rconService.sendCommand('server.saveinterval 600');
                await rconService.sendCommand('server.itemdespawn 300');
                await rconService.sendCommand('server.corpsedespawn 300');
                setConvars((p) => ({ ...p, saveInterval: 600, itemDespawn: 300, corpseDespawn: 300 }));
                setToast('Restored Default Cleanup Timers');
                setTimeout(() => setToast(null), 2500);
              }}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Restores standard 10m save, 5m item despawn, 5m corpse despawn"
            >
              Reset Timers
            </button>
          </div>
        </div>

        {/* Card 8: Player Downed & Recovery */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-zinc-100">Downed & Recovery</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">server.*</span>
            </div>

            {/* Crawling Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-300 font-medium block">Downed Crawling</span>
                <span className="text-[11px] text-zinc-500">server.crawlingenabled</span>
              </div>
              <button
                onClick={() => {
                  const next = !convars.crawlingEnabled;
                  setConvars((p) => ({ ...p, crawlingEnabled: next }));
                  applyConvar(`server.crawlingenabled ${next}`, `Crawling ${next ? 'Enabled' : 'Disabled'}`);
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  convars.crawlingEnabled
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {convars.crawlingEnabled ? 'Active' : 'Incapacitated'}
              </button>
            </div>

            {/* Self-Revive Recovery Chance */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Self-Revive Chance</span>
                <span className="font-mono text-rose-400 font-bold">
                  {Math.round(convars.woundedRecoverChance * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={convars.woundedRecoverChance}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setConvars((p) => ({ ...p, woundedRecoverChance: val }));
                  applyConvar(`server.woundedrecoverchance ${val}`, `Revive chance ${Math.round(val * 100)}%`);
                }}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-500 block mt-0.5">
                Chance to stand back up on own when wounded.
              </span>
            </div>

            {/* Sleeping Bag Cooldown Addition */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 font-medium">Bag Cooldown Penalty</span>
                <span className="font-mono text-zinc-300 font-bold">+{convars.respawnBagAddition}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={convars.respawnBagAddition}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setConvars((p) => ({ ...p, respawnBagAddition: val }));
                  applyConvar(`server.respawntimeadditionbag ${val}`, `Bag delay +${val}s`);
                }}
                className="w-full accent-zinc-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Player Mechanics Actions */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
            <button
              onClick={async () => {
                await rconService.sendCommand('server.crawlingenabled true');
                await rconService.sendCommand('server.woundedrecoverchance 0.2');
                await rconService.sendCommand('server.respawntimeadditionbag 0');
                setConvars((p) => ({ ...p, crawlingEnabled: true, woundedRecoverChance: 0.2, respawnBagAddition: 0 }));
                setToast('Applied Standard Casual Rules');
                setTimeout(() => setToast(null), 2500);
              }}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Enables crawling, 20% recovery chance, no respawn penalty"
            >
              Standard Rules
            </button>
            <button
              onClick={async () => {
                await rconService.sendCommand('server.crawlingenabled false');
                await rconService.sendCommand('server.woundedrecoverchance 0.0');
                await rconService.sendCommand('server.respawntimeadditionbag 15');
                setConvars((p) => ({ ...p, crawlingEnabled: false, woundedRecoverChance: 0.0, respawnBagAddition: 15 }));
                setToast('Applied Strict Hardcore Rules');
                setTimeout(() => setToast(null), 2500);
              }}
              className="flex-1 py-1 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors text-center"
              title="Disables crawling, zero self-revive chance, +15s bag penalty"
            >
              Strict Hardcore
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
