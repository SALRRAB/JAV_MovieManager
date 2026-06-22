using Serilog;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MovieManager.BusinessLogic
{
    /// <summary>
    /// Builds an in-memory index of actor portrait files so image lookups avoid repeated
    /// directory scans across large actor figure libraries.
    /// </summary>
    public class ActorImageIndexService
    {
        // DMM figure files use this prefix before the actor name.
        private const string DmmPrefix = "AI-Fix-";
        private readonly UserSettingsService _config;
        private readonly object _buildLock = new object();

        private ConcurrentDictionary<string, string> _smallByActor = new ConcurrentDictionary<string, string>();
        private ConcurrentDictionary<string, string> _largeByActor = new ConcurrentDictionary<string, string>();
        private string _indexedDmmDir;
        private string _indexedAllDir;
        private volatile bool _isBuilt;

        public ActorImageIndexService(UserSettingsService config)
        {
            _config = config;
        }

        /// <summary>Clear the index when actor figure directories change in user settings.</summary>
        public void Invalidate()
        {
            lock (_buildLock)
            {
                _smallByActor = new ConcurrentDictionary<string, string>();
                _largeByActor = new ConcurrentDictionary<string, string>();
                _indexedDmmDir = null;
                _indexedAllDir = null;
                _isBuilt = false;
            }
        }

        public string GetSmallPath(string actorName)
        {
            EnsureIndex();
            return _smallByActor.TryGetValue(actorName, out var path) ? path : null;
        }

        public string GetLargePath(string actorName)
        {
            EnsureIndex();
            return _largeByActor.TryGetValue(actorName, out var path) ? path : null;
        }

        private void EnsureIndex()
        {
            var settings = _config.GetUserSettings();
            if (_isBuilt
                && _indexedDmmDir == settings.ActorFiguresDMMDirectory
                && _indexedAllDir == settings.ActorFiguresAllDirectory)
            {
                return;
            }

            lock (_buildLock)
            {
                settings = _config.GetUserSettings();
                if (_isBuilt
                    && _indexedDmmDir == settings.ActorFiguresDMMDirectory
                    && _indexedAllDir == settings.ActorFiguresAllDirectory)
                {
                    return;
                }

                Log.Information("Building actor image index...");
                var small = new ConcurrentDictionary<string, string>();
                var large = new ConcurrentDictionary<string, string>();

                try
                {
                    BuildDmmIndex(settings.ActorFiguresDMMDirectory, small);
                    BuildAllDirectoryIndex(settings.ActorFiguresAllDirectory, small, large);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Failed to build actor image index");
                }

                _smallByActor = small;
                _largeByActor = large;
                _indexedDmmDir = settings.ActorFiguresDMMDirectory;
                _indexedAllDir = settings.ActorFiguresAllDirectory;
                _isBuilt = true;
                Log.Information("Actor image index built: {SmallCount} small, {LargeCount} large", small.Count, large.Count);
            }
        }

        private static void BuildDmmIndex(string dmmDirectory, ConcurrentDictionary<string, string> small)
        {
            if (string.IsNullOrEmpty(dmmDirectory) || !Directory.Exists(dmmDirectory))
            {
                return;
            }

            foreach (var file in Directory.EnumerateFiles(dmmDirectory, $"{DmmPrefix}*.jpg", SearchOption.AllDirectories))
            {
                var baseName = Path.GetFileNameWithoutExtension(file);
                if (!baseName.StartsWith(DmmPrefix, StringComparison.Ordinal))
                {
                    continue;
                }

                var actorName = baseName.Substring(DmmPrefix.Length);
                small.TryAdd(actorName, file);
            }
        }

        private static void BuildAllDirectoryIndex(
            string allDirectory,
            ConcurrentDictionary<string, string> small,
            ConcurrentDictionary<string, string> large)
        {
            if (string.IsNullOrEmpty(allDirectory) || !Directory.Exists(allDirectory))
            {
                return;
            }

            var byActor = new Dictionary<string, List<string>>();
            foreach (var file in Directory.EnumerateFiles(allDirectory, "*.jpg", SearchOption.AllDirectories))
            {
                var actorName = Path.GetFileNameWithoutExtension(file);
                if (!byActor.TryGetValue(actorName, out var files))
                {
                    files = new List<string>();
                    byActor[actorName] = files;
                }
                files.Add(file);
            }

            foreach (var entry in byActor)
            {
                // DMM portraits take priority for thumbnails; otherwise use the first match.
                if (!small.ContainsKey(entry.Key))
                {
                    small[entry.Key] = entry.Value[0];
                }

                // Use the largest file as the high-resolution portrait.
                large[entry.Key] = entry.Value
                    .OrderByDescending(f => new FileInfo(f).Length)
                    .First();
            }
        }
    }
}
