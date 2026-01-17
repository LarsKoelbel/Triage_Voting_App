let bars = {};

async function init() {
    await updateResults();
    setInterval(updateResults, 1000);
}

async function updateResults() {
    try {
        const resp = await fetch("/api/get-results");
        if (!resp.ok) return;

        const res = await resp.json();
        if (!res || !res.result) return;

        updateChart(res.result);
    } catch (e) {
        console.error(e);
    }
}

function updateChart(results) {
    const chart = document.getElementById("chart");
    if (!chart) return;

    const totalVotes = results.reduce((s, r) => s + r[1], 0);

    results
        .sort((a, b) => b[1] - a[1])
        .forEach(([name, votes]) => {

            const percent = totalVotes > 0
                ? (votes / totalVotes) * 100
                : 0;

            // Create bar once
            if (!bars[name]) {
                const col = document.createElement("div");
                col.className = "bar-column";

                const percentEl = document.createElement("div");
                percentEl.className = "bar-percent";

                const barBg = document.createElement("div");
                barBg.className = "bar-bg";

                const barFill = document.createElement("div");
                barFill.className = "bar-fill";

                const votesEl = document.createElement("div");
                votesEl.className = "bar-votes";

                const nameEl = document.createElement("div");
                nameEl.className = "bar-name";
                nameEl.textContent = name;

                barBg.appendChild(barFill);
                col.append(percentEl, barBg, votesEl, nameEl);
                chart.appendChild(col);

                bars[name] = { col, barFill, percentEl, votesEl };
            }

            // Update existing bar
            bars[name].barFill.style.height = percent + "%";
            bars[name].percentEl.textContent = percent.toFixed(1) + "%";
            bars[name].votesEl.textContent = votes + " Stimmen";
        });
}

window.addEventListener("load", init);