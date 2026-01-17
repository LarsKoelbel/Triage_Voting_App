
let DONE = false;

async function init()
{
    await setUpList();
    showList()
}

async function setUpList()
{
    const kapitaen = document.getElementById("kap");
    const schlager = document.getElementById("sing");
    const masseur = document.getElementById("mas");
    const none = document.getElementById("none");

    kapitaen.addEventListener("click", async (e) => {
        if (DONE) return;
        if (await notifyServerVoteCast("kap"))
        {
            kapitaen.classList.add("selected");
            schlager.classList.add("out");
            masseur.classList.add("out");
            none.classList.add("out");
            DONE = true;
        }else
        {
            alert("Der Server ist momentan nicht erreichbar. Bitte versuchen sie es später erneut");
        }
    });

    schlager.addEventListener("click", async (e) => {
        if (DONE) return;
        if (await notifyServerVoteCast("sch"))
        {
            kapitaen.classList.add("out");
            schlager.classList.add("selected");
            masseur.classList.add("out");
            none.classList.add("out");
            DONE = true;
        }else
        {
            alert("Der Server ist momentan nicht erreichbar. Bitte versuchen sie es später erneut");
        }
    });

    masseur.addEventListener("click", async (e) => {
        if (DONE) return;
        if (await notifyServerVoteCast("mas"))
        {
            kapitaen.classList.add("out");
            schlager.classList.add("out");
            masseur.classList.add("selected");
            none.classList.add("out");
            DONE = true;
        }else
        {
            alert("Der Server ist momentan nicht erreichbar. Bitte versuchen sie es später erneut");
        }
    });

    none.addEventListener("click", async (e) => {
        if (DONE) return;
        if (await notifyServerVoteCast("none"))
        {
            kapitaen.classList.add("out");
            schlager.classList.add("out");
            masseur.classList.add("out");
            none.classList.add("selected");
            DONE = true;
        }else
        {
            alert("Der Server ist momentan nicht erreichbar. Bitte versuchen sie es später erneut");
        }
    });

    document.getElementById("button").addEventListener("click", async (e) => {
        await getOrCreateVoterID(true);
        window.location.href = window.location.href;
    })
}

async function showList()
{

    const kapitaen = document.getElementById("kap");
    const schlager = document.getElementById("sing");
    const masseur = document.getElementById("mas");
    const none = document.getElementById("none");

    const list = document.getElementById("vote-list");

    key = await getVoteIfExists();
    switch (key)
    {
        case "kap":
        {
            kapitaen.classList.add("selected");
            schlager.classList.add("out");
            masseur.classList.add("out");
            none.classList.add("out");
            DONE = true;
            break;
        }
        case "sch":
        {
            kapitaen.classList.add("out");
            schlager.classList.add("selected");
            masseur.classList.add("out");
            none.classList.add("out");
            DONE = true;
            break;
        }
        case "mas":
        {
            kapitaen.classList.add("out");
            schlager.classList.add("out");
            masseur.classList.add("selected");
            none.classList.add("out");
            DONE = true;
            break;
        }
        case "none":
        {
            kapitaen.classList.add("out");
            schlager.classList.add("out");
            masseur.classList.add("out");
            none.classList.add("selected");
            DONE = true;
            break;
        }
    }

    list.style.display = "block";
    const trober = document.getElementById("trober");
    trober.remove()
}

async function notifyServerVoteCast(target)
{
    const id = await getOrCreateVoterID();
    try
    {
        const resp = await fetch("/api/cast-vote-once", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                key: target,
                id: id
            })
        })

        if (resp.ok) {
            setTimeout(async () => {
                document.getElementById("headliner").style.display = "flex";
            }, 0);
            return true;
        };
        return false;
    } catch (e) {
        return false;
    }

}

async function getVoteIfExists() {
    try {
        const voterId = await getOrCreateVoterID(); // load or create voter ID

        const resp = await fetch("/api/get-vote-if-exists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: voterId })
        });

        if (resp.ok) {
            const data = await resp.json();
            if (data && data.status === "ok") {
                setTimeout(async () => {
                    document.getElementById("headliner").style.display = "flex";
                }, 1000);
                return data.key; // return the voted key
            }
        }

        return null;
    } catch (e) {
        console.error("Error fetching vote:", e);
        return null;
    }
}


async function getOrCreateVoterID(regenerate = false) {
    // Try to load existing ID
    let voterId = null;
    if (!regenerate)
    {
        voterId = localStorage.getItem("voterId");
    }

    if (!voterId) {
        // Create a new 30-digit random numeric ID
        voterId = "";
        for (let i = 0; i < 30; i++) {
            voterId += Math.floor(Math.random() * 10);
        }
        localStorage.setItem("voterId", voterId);
    }

    return voterId;
}


window.addEventListener('load', init);