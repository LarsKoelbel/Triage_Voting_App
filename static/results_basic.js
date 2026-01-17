async function init()
{
    setInterval(async () => {
        const result = await getResults();
        makeList(result);
    }, 1000);
}

async function getResults()
{
    try
    {
        const resp = await fetch("/api/get-results");

        if (resp.ok)
        {
            const json = await resp.json();
            console.log(json);
            return json;
        }
    } catch (e) {
    }
}

async function makeList(res)
{
    const list = document.getElementById("results-list");

    // Handle headder
    if (res.status === "open")
    {
        document.getElementById("header-blue").classList.add("invisible");
        document.getElementById("header-red").classList.remove("invisible");
        document.getElementById("header-green").classList.add("invisible");
    }
    if (res.status === "closed")
    {
        document.getElementById("header-blue").classList.remove("invisible");
        document.getElementById("header-red").classList.add("invisible");
        document.getElementById("header-green").classList.add("invisible");
    }
    if (res.status === "fin")
    {
        document.getElementById("header-blue").classList.add("invisible");
        document.getElementById("header-red").classList.add("invisible");
        document.getElementById("header-green").classList.remove("invisible");
    }

    // Handle results
    list.innerHTML = "";

    const final_result = res.result.sort((a,b) => b[1] - a[1]);

    final_result.forEach((item) => {
        const temp = document.createElement("li");
        temp.innerText = item[0] + " | " + item[1];
        list.appendChild(temp);
    })
}

window.addEventListener('load', init);