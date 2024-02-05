const fs = require('fs').promises;
const path = require('path');

async function copyFile(sourcePath, targetPath, logger) {
    const data = await fs.readFile(sourcePath);
    await fs.writeFile(targetPath, data);
    logger.info(`Скопійовано файл з ${sourcePath} до ${targetPath}`);

}

async function syncDirectory(sourceDir, targetDir, logger) {
    const sourceFiles = await fs.readdir(sourceDir);

    for (const file of sourceFiles) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        const stats = await fs.stat(sourcePath);
        if (stats.isDirectory()) {
            await fs.mkdir(targetPath, { recursive: true });
            await syncDirectory(sourcePath, targetPath, logger);
        } else {
            const targetFileExists = await fs.access(targetPath)
                .then(() => true)
                .catch(() => false);

            if (!targetFileExists) {
                await copyFile(sourcePath, targetPath, logger);
            } else {
                logger.warn(`Файл ${file} вже існує в ${targetDir}`);
            }
        }
    }
}

async function start(logger) {
    const sourceDir = path.join(__dirname, 'source');
    const targetDir = path.join(__dirname, 'target');
    await fs.mkdir(targetDir, { recursive: true });
    await syncDirectory(sourceDir, targetDir, logger);

}

module.exports = { start };

