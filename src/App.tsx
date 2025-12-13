import React, { useState } from 'react';
import { RoleAssigner } from './components/RoleAssigner';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-white mb-2">FF14 ロール抽選ツール</h1>
            <p className="text-purple-200">8人パーティーのロールを自動抽選します</p>
          </header>
          <RoleAssigner />
        </div>
      </div>
    </div>
  );
}
