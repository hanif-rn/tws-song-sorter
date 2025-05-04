let songs = [];
let mergeQueue = [];
let resultsDiv = document.getElementById("results");
let leftBtn = document.getElementById("left-btn");
let rightBtn = document.getElementById("right-btn");
let likeBoth = document.getElementById("like-both");
let noOpinion = document.getElementById("no-op");

fetch("tws-songs.json")
  .then((res) => res.json())
  .then((data) => {
    songs = data;
    mergeQueue = songs.map((s) => [[s]]);
    step();
  });

function step() {
  // function to progress the sorter
  if (mergeQueue.length === 1) {
    // when all are sorted (i.e all contained in one array))
    showResults();
    return;
  }
  // otherwise makes the comparisons
  let a = mergeQueue.shift();
  let b = mergeQueue.shift();
  mergePairs(a, b, [], 0, 0);
}

function mergePairs(a, b, merged, i, j) {
  // function to facilitate comparisons
  if (i >= a.length && j >= b.length) {
    // base case - when all comparisons have been made
    mergeQueue.push(merged);
    step();
    return;
  }
  if (i >= a.length) {
    // when all items in a have been exhausted
    merged.push(...b.slice(j));
    mergeQueue.push(merged);
    step();
    return;
  }
  if (j >= b.length) {
    // when all items in b have been exhausted
    merged.push(...a.slice(i));
    mergeQueue.push(merged);
    step();
    return;
  }

  let leftGroup = a[i];
  let rightGroup = b[j];
  leftBtn.textContent = leftGroup[0];
  rightBtn.textContent = rightGroup[0];

  leftBtn.onclick = () => {
    merged.push(leftGroup);
    mergePairs(a, b, merged, ++i, j);
  };

  rightBtn.onclick = () => {
    merged.push(rightGroup);
    mergePairs(a, b, merged, i, ++j);
  };

  likeBoth.onclick = () => {
    merged.push([...leftGroup, ...rightGroup]);
    mergePairs(a, b, merged, ++i, ++j);
  };

  noOpinion.onclick = () => {
    merged.push([...leftGroup, ...rightGroup]);
    mergePairs(a, b, merged, ++i, ++j);
  };
}

function showResults() {
  let final = mergeQueue[0];
  let html = "<h2>Results:</h2><ul class='results-list'>";
  let rank = 1;
  for (let group of final) {
    for (let song of group) {
      html += `<li class="r${rank}"><span class='rank'>${rank}.</span> ${song}</li>`;
    }
    rank++;
  }
  html += "</ul>";
  resultsDiv.innerHTML = html;
  document.getElementById("comparison-container").style.display = "none";
  document.getElementById("extra-options").style.display = "none";
}
