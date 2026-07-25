---
title: "Roman to Integer"
slug: "roman-to-integer"
source: "leetcode"
difficulty: "easy"
datePublished: "2026-03-11"
timeComplexity: "O(n)"
spaceComplexity: "O(1)"
excerpt: "Scan the Roman numeral string and subtract a symbol's value when it precedes a larger one, otherwise add it."
---

# Problem

Given a Roman numeral string `s`, convert it to an integer.

Roman numerals use seven symbols:

| Symbol | Value |
| ------ | ----- |
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

Numerals are normally written largest to smallest from left to right. Six subtraction cases exist where a smaller symbol precedes a larger one:

- `IV` = 4, `IX` = 9
- `XL` = 40, `XC` = 90
- `CD` = 400, `CM` = 900

## Constraints

- `1 <= s.length <= 15`
- `s` contains only `'I'`, `'V'`, `'X'`, `'L'`, `'C'`, `'D'`, `'M'`
- `s` is guaranteed to be a valid Roman numeral in the range `[1, 3999]`

## Examples

**Example 1**

```
Input:  s = "III"
Output: 3
```

**Example 2**

```
Input:  s = "LVIII"
Output: 58
Explanation: L = 50, V = 5, III = 3
```

**Example 3**

```
Input:  s = "MCMXCIV"
Output: 1994
Explanation: M = 1000, CM = 900, XC = 90, IV = 4
```

## Edge Case Checklist

- Single character (`"I"` = 1, `"M"` = 1000)
- All additive, no subtraction (`"III"`, `"MDCLXVI"`)
- All six subtraction pairs in one string (`"MCMXCIV"`)
- Maximum valid value (`"MMMCMXCIX"` = 3999)
- Minimum valid value (`"I"` = 1)
- Subtraction pair at the very start (`"IV"`, `"IX"`)
- Subtraction pair at the very end (`"XIV"`, `"XIX"`)

## Approach

Build a map of the seven Roman symbols to their integer values. Then scan the string once from left to right.

At each position, look one character ahead. If the current symbol's value is less than the next symbol's value, you are in a subtraction pair. Add the difference of the two to the result, then skip the next character since both have been consumed. Otherwise, just add the current symbol's value and move on.

```
MCMXCIV

M  = 1000  → next is C (100), M > C, so add 1000. total = 1000
C  = 100   → next is M (1000), C < M, subtraction pair CM = 900. total = 1900
X  = 10    → next is C (100), X < C, subtraction pair XC = 90. total = 1990
I  = 1     → next is V (5), I < V, subtraction pair IV = 4. total = 1994
```

The key insight is that you do not need special map entries for the six subtraction pairs. A single lookahead comparison on the seven-symbol map detects every case.

One boundary detail: when `i` is the last index, `s[i + 1]` is `undefined`. The fallback to `''` maps to `undefined ?? 0` in the lookup, so the comparison returns `false` at the end of the string without any extra guard needed.

## Implementation

```typescript
export function romanToInt(s: string): number {
    const romanMap = new Map<string, number>([
        ["I", 1],
        ["V", 5],
        ["X", 10],
        ["L", 50],
        ["C", 100],
        ["D", 500],
        ["M", 1000],
    ]);

    let result = 0;

    for (let i = 0; i < s.length; i++) {
        const currCharInt = romanMap.get(s.charAt(i)) ?? 0;
        const nextCharInt = romanMap.get(s.charAt(i + 1)) ?? 0;

        if (currCharInt < nextCharInt) {
            result += nextCharInt - currCharInt;
            i++; // consume both characters of the subtraction pair
        } else {
            result += currCharInt;
        }
    }

    return result;
}
```

## Complexity

- **Time O(n):** one pass over the string, with O(1) map lookups at each step.
- **Space O(1):** the map holds exactly seven entries regardless of input size.

## Test Coverage

The test suite covers:

- LeetCode baseline examples (III, LVIII, MCMXCIV)
- Single character inputs for all seven symbols
- All six subtraction pairs in isolation (IV, IX, XL, XC, CD, CM)
- Composite cases including a string with every subtraction type present
- Subtraction pair at the start and at the end of a numeral
- Maximum valid value 3999
- Minimum valid value 1
- Defensive contract check that the input string is not mutated
