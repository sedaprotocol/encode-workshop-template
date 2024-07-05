export function median(numbers: f64[]): f64 {
    const sorted: f64[] = numbers.sort();
    const middle = i32(Math.floor(sorted.length / 2));

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}