using MovieManager.ClassLibrary.RequestBody;
using Serilog;
using System;
using System.Collections.Concurrent;
using System.Configuration;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace MovieManager.BusinessLogic
{
    /// <summary>
    /// Copies source images into a local cache so the API can serve files from a stable path
    /// instead of reading directly from network or library folders on every request.
    /// </summary>
    public class ImageCacheService
    {
        private readonly string _cacheRoot;
        // Per-file locks prevent duplicate copies when concurrent requests miss the cache.
        private readonly ConcurrentDictionary<string, object> _locks = new ConcurrentDictionary<string, object>();

        public ImageCacheService()
        {
            // Keep cache next to the database when configured; otherwise fall back to temp storage.
            var dbPath = ConfigurationManager.AppSettings["DatabaseLocation"];
            if (string.IsNullOrEmpty(dbPath))
            {
                _cacheRoot = Path.Combine(Path.GetTempPath(), "MovieManager", "ImageCache");
            }
            else
            {
                _cacheRoot = Path.Combine(Path.GetDirectoryName(dbPath), "ImageCache");
            }
            Directory.CreateDirectory(_cacheRoot);
        }

        public string GetCachedImagePath(ImageRequest request, string sourcePath)
        {
            if (string.IsNullOrEmpty(sourcePath))
            {
                return sourcePath;
            }

            var cacheKey = $"{request.ImageType}_{request.Id}";
            return GetCachedImagePath(cacheKey, sourcePath);
        }

        public string GetCachedImagePath(string cacheKey, string sourcePath)
        {
            if (string.IsNullOrEmpty(sourcePath))
            {
                return sourcePath;
            }

            var ext = Path.GetExtension(sourcePath);
            if (string.IsNullOrEmpty(ext))
            {
                ext = ".jpg";
            }

            var fileName = ToCacheFileName(cacheKey) + ext;
            var cachedPath = Path.Combine(_cacheRoot, fileName);

            if (File.Exists(cachedPath))
            {
                return cachedPath;
            }

            // Double-checked locking: another thread may have populated the cache while we waited.
            var lockObj = _locks.GetOrAdd(fileName, _ => new object());
            lock (lockObj)
            {
                if (File.Exists(cachedPath))
                {
                    return cachedPath;
                }

                if (!File.Exists(sourcePath))
                {
                    return sourcePath;
                }

                try
                {
                    File.Copy(sourcePath, cachedPath, overwrite: true);
                    return cachedPath;
                }
                catch (Exception ex)
                {
                    Log.Warning(ex, "Failed to cache image from {SourcePath}, serving from source", sourcePath);
                    return sourcePath;
                }
            }
        }

        private static string ToCacheFileName(string key)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(key));
            return BitConverter.ToString(bytes).Replace("-", "");
        }
    }
}
