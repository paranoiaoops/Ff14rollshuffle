import React, { useState } from 'react';
import { Shuffle, Users, Shield, Heart, Swords, AlertCircle, CheckCircle2, Sparkles, Wand2, CrosshairIcon, Zap } from 'lucide-react';

type Role = 'MainTank' | 'SubTank' | 'PureHealer' | 'BarrierHealer' | 'Melee1' | 'Melee2' | 'Ranged' | 'Caster';

interface Player {
  id: number;
  name: string;
  preferredRoles: Role[];
  assignedRole: Role | null;
}

interface RoleConfig {
  MainTank: number;
  SubTank: number;
  PureHealer: number;
  BarrierHealer: number;
  Melee1: number;
  Melee2: number;
  Ranged: number;
  Caster: number;
}

const ROLE_ICONS = {
  MainTank: Shield,
  SubTank: Shield,
  PureHealer: Heart,
  BarrierHealer: Sparkles,
  Melee1: Swords,
  Melee2: Swords,
  Ranged: CrosshairIcon,
  Caster: Wand2,
};

const ROLE_COLORS = {
  MainTank: 'bg-blue-500',
  SubTank: 'bg-blue-500',
  PureHealer: 'bg-green-500',
  BarrierHealer: 'bg-emerald-500',
  Melee1: 'bg-red-500',
  Melee2: 'bg-red-500',
  Ranged: 'bg-orange-500',
  Caster: 'bg-purple-500',
};

const ROLE_TEXT_COLORS = {
  MainTank: 'text-blue-400',
  SubTank: 'text-blue-400',
  PureHealer: 'text-green-400',
  BarrierHealer: 'text-emerald-400',
  Melee1: 'text-red-400',
  Melee2: 'text-red-400',
  Ranged: 'text-orange-400',
  Caster: 'text-purple-400',
};

const ROLE_LABELS = {
  MainTank: 'メインタンク',
  SubTank: 'サブタンク',
  PureHealer: 'ピュアヒーラー',
  BarrierHealer: 'バリアヒーラー',
  Melee1: 'メレー1',
  Melee2: 'メレー2',
  Ranged: 'レンジ',
  Caster: 'キャス',
};

export function RoleAssigner() {
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: '',
      preferredRoles: ['MainTank', 'SubTank', 'PureHealer', 'BarrierHealer', 'Melee1', 'Melee2', 'Ranged', 'Caster'],
      assignedRole: null,
    }))
  );

  const [roleConfig, setRoleConfig] = useState<RoleConfig>({
    MainTank: 1,
    SubTank: 1,
    PureHealer: 1,
    BarrierHealer: 1,
    Melee1: 1,
    Melee2: 1,
    Ranged: 1,
    Caster: 1,
  });

  const [error, setError] = useState<string>('');

  const handleNameChange = (id: number, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const toggleRole = (playerId: number, role: Role) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        const preferredRoles = p.preferredRoles.includes(role)
          ? p.preferredRoles.filter(r => r !== role)
          : [...p.preferredRoles, role];
        return { ...p, preferredRoles };
      }
      return p;
    }));
    setError('');
  };

  const selectAllRoles = (playerId: number) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        return { ...p, preferredRoles: ['MainTank', 'SubTank', 'PureHealer', 'BarrierHealer', 'Melee1', 'Melee2', 'Ranged', 'Caster'] };
      }
      return p;
    }));
    setError('');
  };

  const clearAllRoles = (playerId: number) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        return { ...p, preferredRoles: [] };
      }
      return p;
    }));
    setError('');
  };

  const selectTankRoles = (playerId: number) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        const newRoles = new Set(p.preferredRoles);
        newRoles.add('MainTank');
        newRoles.add('SubTank');
        return { ...p, preferredRoles: Array.from(newRoles) };
      }
      return p;
    }));
    setError('');
  };

  const selectHealerRoles = (playerId: number) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        const newRoles = new Set(p.preferredRoles);
        newRoles.add('PureHealer');
        newRoles.add('BarrierHealer');
        return { ...p, preferredRoles: Array.from(newRoles) };
      }
      return p;
    }));
    setError('');
  };

  const selectDPSRoles = (playerId: number) => {
    setPlayers(players.map(p => {
      if (p.id === playerId) {
        const newRoles = new Set(p.preferredRoles);
        newRoles.add('Melee1');
        newRoles.add('Melee2');
        newRoles.add('Ranged');
        newRoles.add('Caster');
        return { ...p, preferredRoles: Array.from(newRoles) };
      }
      return p;
    }));
    setError('');
  };

  const assignRoles = () => {
    // バリデーション
    const playersWithRoles = players.filter(p => p.preferredRoles.length > 0);
    if (playersWithRoles.length !== 8) {
      setError('全てのプレイヤーが少なくとも1つのロールを選択してください');
      return;
    }

    const totalRoles = roleConfig.MainTank + roleConfig.SubTank + roleConfig.PureHealer + roleConfig.BarrierHealer + roleConfig.Melee1 + roleConfig.Melee2 + roleConfig.Ranged + roleConfig.Caster;
    if (totalRoles !== 8) {
      setError('ロール構成の合計は8人である必要があります');
      return;
    }

    // 抽選アルゴリズム
    const result = tryAssignRoles();
    if (!result.success) {
      setError('ロールの割り当てができませんでした。希望ロールを増やしてください');
      return;
    }

    // 名前が空のプレイヤーに番号を設定
    const playersWithNames = result.players.map(p => ({
      ...p,
      name: p.name.trim() === '' ? `${p.id}` : p.name
    }));

    setPlayers(playersWithNames);
    setError('');
  };

  const tryAssignRoles = (): { success: boolean; players: Player[] } => {
    const maxAttempts = 1000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const newPlayers = [...players].map(p => ({ ...p, assignedRole: null }));
      const shuffledPlayers = [...newPlayers].sort(() => Math.random() - 0.5);
      
      const remaining: RoleConfig = { ...roleConfig };
      let success = true;

      for (const player of shuffledPlayers) {
        const availableRoles = player.preferredRoles.filter(
          role => remaining[role] > 0
        );

        if (availableRoles.length === 0) {
          success = false;
          break;
        }

        // ランダムに選択
        const assignedRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
        const originalPlayer = newPlayers.find(p => p.id === player.id);
        if (originalPlayer) {
          originalPlayer.assignedRole = assignedRole;
          remaining[assignedRole]--;
        }
      }

      if (success) {
        return { success: true, players: newPlayers };
      }
    }

    return { success: false, players };
  };

  const resetAssignments = () => {
    setPlayers(players.map(p => ({ ...p, assignedRole: null })));
    setError('');
  };

  const hasAssignments = players.some(p => p.assignedRole !== null);

  const getRoleCounts = () => {
    const counts = { MainTank: 0, SubTank: 0, PureHealer: 0, BarrierHealer: 0, Melee1: 0, Melee2: 0, Ranged: 0, Caster: 0 };
    players.forEach(p => {
      if (p.assignedRole) {
        counts[p.assignedRole]++;
      }
    });
    return counts;
  };

  const currentCounts = getRoleCounts();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-purple-500/20">
      {/* プレイヤーリスト */}
      <div className="space-y-3 mb-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(player.id, e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none flex-1"
                placeholder="プレイヤー名"
              />
              {player.assignedRole && (
                <>
                  <div className={`${ROLE_COLORS[player.assignedRole]} text-white px-4 py-2 rounded-lg flex items-center gap-2`}>
                    {React.createElement(ROLE_ICONS[player.assignedRole], { className: 'w-4 h-4' })}
                    <span>{ROLE_LABELS[player.assignedRole]}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-600"></div>
                </>
              )}
              <button
                onClick={() => selectAllRoles(player.id)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                全選択
              </button>
              <button
                onClick={() => clearAllRoles(player.id)}
                className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                クリア
              </button>
              <button
                onClick={() => selectTankRoles(player.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                タンク選択
              </button>
              <button
                onClick={() => selectHealerRoles(player.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                ヒーラー選択
              </button>
              <button
                onClick={() => selectDPSRoles(player.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                DPS選択
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['MainTank', 'SubTank', 'PureHealer', 'BarrierHealer', 'Melee1', 'Melee2', 'Ranged', 'Caster'] as Role[]).map(role => {
                const Icon = ROLE_ICONS[role];
                const isSelected = player.preferredRoles.includes(role);
                return (
                  <button
                    key={role}
                    onClick={() => toggleRole(player.id, role)}
                    className={`py-2 px-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1 ${
                      isSelected
                        ? `${ROLE_COLORS[role]} border-transparent text-white`
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{ROLE_LABELS[role]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 成功メッセージ */}
      {hasAssignments && !error && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg flex items-center gap-2 text-green-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>ロールの割り当てが完了しました！</span>
        </div>
      )}

      {/* 抽選結果一覧 */}
      {hasAssignments && (
        <div className="mb-6 bg-slate-900/50 rounded-lg p-6 border border-purple-500/30">
          <h3 className="text-xl text-purple-300 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            抽選結果
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(['MainTank', 'SubTank', 'PureHealer', 'BarrierHealer', 'Melee1', 'Melee2', 'Ranged', 'Caster'] as Role[]).map(role => {
              const player = players.find(p => p.assignedRole === role);
              const Icon = ROLE_ICONS[role];
              return (
                <div
                  key={role}
                  className={`${ROLE_COLORS[role]} rounded-lg p-4 flex items-center gap-3`}
                >
                  <Icon className="w-6 h-6 text-white" />
                  <div className="flex-1">
                    <div className="text-white/80 text-sm">{ROLE_LABELS[role]}</div>
                    <div className="text-white">{player?.name || '未割当'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex gap-3">
        <button
          onClick={assignRoles}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Shuffle className="w-5 h-5" />
          ロールを抽選
        </button>
        {hasAssignments && (
          <button
            onClick={resetAssignments}
            className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors"
          >
            リセット
          </button>
        )}
      </div>
    </div>
  );
}