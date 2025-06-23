export function calculateSimilarity(packageA, packageB) {
    // Combine the text fields of both packages
    const textA = `${packageA.name} ${packageA.description} ${packageA.includedServices?.join(' ')}`;
    const textB = `${packageB.name} ${packageB.description} ${packageB.includedServices?.join(' ')}`;

    // Tokenize and create word frequency vectors
    const wordsA = textA.toLowerCase().split(/\W+/);
    const wordsB = textB.toLowerCase().split(/\W+/);
    const wordSet = new Set([...wordsA, ...wordsB]);

    const freqA = {};
    const freqB = {};

    wordSet.forEach(word => {
        freqA[word] = wordsA.filter(w => w === word).length;
        freqB[word] = wordsB.filter(w => w === word).length;
    });

    // Calculate dot product and magnitudes
    const dotProduct = Array.from(wordSet).reduce((sum, word) => sum + (freqA[word] * freqB[word]), 0);
    const magnitudeA = Math.sqrt(Object.values(freqA).reduce((sum, val) => sum + (val * val), 0));
    const magnitudeB = Math.sqrt(Object.values(freqB).reduce((sum, val) => sum + (val * val), 0));

    // Calculate cosine similarity
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
}
