const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { changed: changedFiles, ignored: ignoredFiles } = require('./files-check-list.json');

const DIST_DIR = 'dist';
const HASH_FILE_PATH = `${DIST_DIR}/hashes.json`;

function log(msg) {
  // eslint-disable-next-line no-console
  console.log('\x1b[32m%s\x1b[0m', msg);
}

function normalizeSlashes(filePath) {
  return path.normalize(filePath).replace(/\\/g, '/');
}

/**
 * @param {string} filePath - file path, relative to the cwd
 * @return {Object.<string, string>}
 */
async function getHashFromFile(filePath) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const hash = crypto.createHash('sha1');
    const ct = await fs.promises.readFile(path.resolve(process.cwd(), filePath), { encoding: 'utf8' });
    const normalizedContent = ct.replace(/[\s]/g, '');
    hash.update(normalizedContent);
    const hexHash = hash.digest('hex');
    resolve({ filePath, hexHash });
  });
}

function shouldIgnoreFile(name) {
  return ignoredFiles.some((pattern) => {
    const normalizedPattern = normalizeSlashes(pattern);
    let shouldIgnore = false;
    if (normalizedPattern.startsWith('*')) {
      shouldIgnore = name.endsWith(normalizedPattern.slice(1));
    } else if (normalizedPattern.endsWith('*')) {
      shouldIgnore = name.startsWith(normalizedPattern.slice(0, -1));
    }
    return shouldIgnore;
  });
}

/**
 * @param {stats|dirent} files
 * @param {string} root
 * @returns {object.<string, string>[]}
 */
async function getHashesFromEntities(files, root) {
  const result = [];
  /* eslint-disable no-await-in-loop */
  for (let i = 0, l = files.length; i < l; i += 1) {
    const name = normalizeSlashes(path.join(root, files[i].name));
    if (files[i].isFile() && !shouldIgnoreFile(name)) {
      const hash = await getHashFromFile(name);
      result.push(hash);
    } else if (files[i].isDirectory()) {
      const dirFiles = await fs.promises.readdir(path.resolve(process.cwd(), name), {
        withFileTypes: true,
      });
      const dirFilesHashes = await getHashesFromEntities(dirFiles, name);
      result.push(...dirFilesHashes);
    }
  }
  return result;
}

async function isDirAbsent(dirPath) {
  return fs.promises.access(dirPath, fs.constants.F_OK)
    .then(() => false)
    .catch(() => true);
}

async function emitHashesFile(hashMap) {
  const data = new Uint8Array(Buffer.from(JSON.stringify(hashMap)));
  if (await isDirAbsent(DIST_DIR)) {
    await fs.promises.mkdir(DIST_DIR);
  }
  await fs.promises.writeFile(path.resolve(process.cwd(), HASH_FILE_PATH), data);
  log('[LOG:builder:FUSION] "dist/hashes.json" emitted');
}

async function getFilesStats(fileList) {
  return Promise.all(fileList.map((file) => fs.promises.stat(file).then((stats) => {
    stats.name = file;
    return stats;
  })));
}

function getHashMapFromHashes(hashes) {
  return hashes.reduce((acc, { filePath, hexHash }) => ({ ...acc, [filePath]: hexHash }), {});
}

async function main() {
  log('[LOG:builder:FUSION] Generating checksums...');
  const coreFilesStats = await getFilesStats(changedFiles);
  const hashes = await getHashesFromEntities(coreFilesStats, '');
  await emitHashesFile(getHashMapFromHashes(hashes));
}

main();
