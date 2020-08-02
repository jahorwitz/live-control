const ffmpeg = require('fluent-ffmpeg');

const supportedSizes = [
    {
        height: 2160,
        name: "4k"
    },
    {
        height: 1080,
        name: "1080p"
    },
    {
        height: 480,
        name: "480p"
    },
    {
        height: 240,
        name: "240p"
    }
]

const resizeVideo = async (path, type) => {
    const metadata = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(path, (err, metadata) => {
            if (err) {
                reject(err);
            }
            resolve(metadata);
        })
    });
    const height = metadata.streams.find(stream => stream.height).height;
    const sizesToGenerate = supportedSizes.filter(size => size.height < height);

    const outputFilePromises = [];
    const outputFiles = [];

    // If the height matches one of the supported resolutions, don't resize the original
    const originalSize = supportedSizes.find(size => size.height === height);
    if(originalSize) {
        outputFiles.push({
            path,
            resolution: originalSize.name
        });
    }

    try {
        sizesToGenerate.forEach(outputSize => {
            const outputPath = `${path}-${outputSize.name}`;
            const promise = new Promise((resolve, reject) => {
                ffmpeg()
                    .input(path)
                    .format(type.ext)
                    .videoCodec('libx264')
                    .size(`?x${outputSize.height}`)
                    .on('end', resolve)
                    .on('error', reject)
                    .output(outputPath)
                    .run();
            });
            outputFiles.push({
                path: outputPath,
                resolution: outputSize.name
            });
            outputFilePromises.push(promise)
        });
        await Promise.all(outputFilePromises);
    } catch (err) {
        console.log(err);
        throw err;
    }
    return outputFiles;
};

module.exports = {
    resizeVideo
}