async function init()
{
    document.getElementById("button").addEventListener("click", send);
    document.getElementById("none").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            send();
        }
    });
}

async function send()
{
    const kap = document.getElementById("kap").value;
    const sch = document.getElementById("sch").value;
    const mas = document.getElementById("mas").value;
    const none = document.getElementById("none").value;

    const result = {
        kap: kap !== null && kap !== '' ? kap : 0,
        sch: sch !== null && sch !== '' ? sch : 0,
        mas: mas !== null && mas !== '' ? mas : 0,
        none: none !== null && none !== '' ? none : 0,
    }

    try
    {
        const resp = await fetch("/api/manual-set", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result)
        });

        if (resp.ok) window.location.href = "/results";
    }catch (e)
    {
        console.error(e);
    }



}

window.addEventListener('load', init);