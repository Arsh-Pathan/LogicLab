import { useState } from 'react';
import { X, CloudUpload, SkipForward, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { migrateLocalStorageToSupabase, getLocalStorageStats } from '../../../lib/services/migrationService';
import type { MigrationResult } from '../../../types/circuit';

export default function MigrationPromptModal() {
  const { showMigrationPrompt, setShowMigrationPrompt } = useAuthStore();
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  if (!showMigrationPrompt) return null;

  const stats = getLocalStorageStats();

  const handleMigrate = async () => {
    setMigrating(true);
    const migrationResult = await migrateLocalStorageToSupabase();
    setResult(migrationResult);
    setMigrating(false);
  };

  const handleClose = () => {
    setShowMigrationPrompt(false);
    setResult(null);
  };

  const handleDontAsk = () => {
    localStorage.setItem('logiclab_migration_dismissed', 'true');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md relative"
        style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
          style={{ color: 'var(--text-dim)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={18} />
        </button>

        <div className="p-8">
          {result ? (
            /* Result view */
            <div className="text-center space-y-4">
              {result.success ? (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                    <CheckCircle size={28} style={{ color: '#22c55e' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                    Migration Complete
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                    Successfully synced {result.migratedCircuits} circuit{result.migratedCircuits !== 1 ? 's' : ''}
                    {result.migratedICs > 0 && ` and ${result.migratedICs} IC definition${result.migratedICs !== 1 ? 's' : ''}`} to your account.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                    <AlertCircle size={28} style={{ color: '#ef4444' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                    Partial Migration
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                    Migrated {result.migratedCircuits} circuit{result.migratedCircuits !== 1 ? 's' : ''}, but encountered {result.errors.length} error{result.errors.length !== 1 ? 's' : ''}.
                  </p>
                  <div className="text-left text-xs p-3 rounded-md max-h-32 overflow-y-auto" style={{ backgroundColor: 'var(--bg-hover)', color: '#ef4444' }}>
                    {result.errors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={handleClose}
                className="btn-primary px-8 py-2.5 text-sm font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            /* Prompt view */
            <div className="space-y-6">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                >
                  <CloudUpload size={28} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-main)' }}>
                  Sync Local Projects
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                  Found <strong>{stats.projectCount}</strong> project{stats.projectCount !== 1 ? 's' : ''}
                  {stats.icCount > 0 && <> and <strong>{stats.icCount}</strong> custom IC{stats.icCount !== 1 ? 's' : ''}</>}
                  {' '}saved locally. Sync them to your account?
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleMigrate}
                  disabled={migrating}
                  className="btn-primary w-full justify-center py-3 text-sm font-semibold flex items-center gap-2"
                >
                  {migrating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <CloudUpload size={16} />
                      Sync Now
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    disabled={migrating}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-dim)', border: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <SkipForward size={14} />
                    Skip
                  </button>
                  <button
                    onClick={handleDontAsk}
                    disabled={migrating}
                    className="flex-1 py-2.5 rounded-md text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Don't ask again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
