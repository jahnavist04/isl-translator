/**
 * Confidence smoothing algorithm for sign recognition:
 * - Maintains a rolling buffer of the last 10 frame predictions.
 * - Only counts frames with >75% confidence; others are treated as "no vote" (null).
 * - Displays and confirms a majority-voted label only if it secures >= 6 of the last 10 votes.
 */
export class ConfidenceSmoother {
  constructor(bufferSize = 10, confidenceThreshold = 0.75, majorityThreshold = 6) {
    this.bufferSize = bufferSize;
    this.confidenceThreshold = confidenceThreshold;
    this.majorityThreshold = majorityThreshold;
    this.buffer = [];
  }

  /**
   * Adds a new frame prediction to the rolling window.
   * @param {Object|null} prediction - { label: string, confidence: number } or null if no hand
   * @returns {Object} smoothed result { label: string|null, confidence: number, voteCount: number, isStable: boolean }
   */
  addPrediction(prediction) {
    // If prediction is valid and confidence >= threshold, vote for this label; otherwise null vote
    if (prediction && prediction.label && prediction.confidence >= this.confidenceThreshold) {
      this.buffer.push({
        label: String(prediction.label),
        confidence: prediction.confidence,
        timestamp: Date.now()
      });
    } else {
      this.buffer.push(null);
    }

    if (this.buffer.length > this.bufferSize) {
      this.buffer.shift();
    }

    return this.getSmoothedResult();
  }

  /**
   * Calculates the current majority vote in the buffer.
   */
  getSmoothedResult() {
    const voteCounts = {};
    const confidenceSums = {};

    for (const item of this.buffer) {
      if (item !== null) {
        voteCounts[item.label] = (voteCounts[item.label] || 0) + 1;
        confidenceSums[item.label] = (confidenceSums[item.label] || 0) + item.confidence;
      }
    }

    let topLabel = null;
    let maxVotes = 0;

    for (const [label, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        topLabel = label;
      }
    }

    const isStable = maxVotes >= this.majorityThreshold;
    const avgConfidence = isStable && maxVotes > 0 
      ? confidenceSums[topLabel] / maxVotes 
      : 0;

    return {
      label: isStable ? topLabel : null,
      rawLabel: topLabel,
      confidence: avgConfidence,
      voteCount: maxVotes,
      bufferLength: this.buffer.length,
      isStable,
      voteDistribution: voteCounts
    };
  }

  reset() {
    this.buffer = [];
  }
}
