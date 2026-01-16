
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
    try
    {
        const resp = await fetch("/api/cast-vote-once", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                key: target
            })
        })

        if (resp.ok) return true;
        return false;
    } catch (e) {
        return false;
    }

}

async function getVoteIfExists()
{
    try
    {
        const resp = await fetch("/api/get-vote-if-exists")

        if (resp.ok)
        {
            const data = await resp.json();
            if (data)
            {
                if (data.status === "ok") return data.key;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

window.addEventListener('load', init);