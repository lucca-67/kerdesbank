
const kerdeslista = document.getElementById("kerdeslista");
const kereso = document.getElementById("kereso");
const darabszam = document.getElementById("darabszam");

let osszesKerdes = [];

async function kerdesekBetoltese() {
    try {
        const valasz = await fetch("kerdesek.json");

        if (!valasz.ok) {
            throw new Error("Nem sikerült betölteni a kérdéseket.");
        }

        osszesKerdes = await valasz.json();
        megjelenites(osszesKerdes);

    } catch (hiba) {
        darabszam.textContent = "Hiba történt a betöltés során.";
        kerdeslista.textContent =
            "Ellenőrizd a kerdesek.json fájlt és a Live Server működését.";
        console.error(hiba);
    }
}

function valaszMegjelenitese(elem, szoveg) {
    const minta = /\[KÉP:\s*([^\]]+)\]/g;

    let elozo = 0;
    let talalat;

    while ((talalat = minta.exec(szoveg)) !== null) {
        elem.appendChild(
            document.createTextNode(
                szoveg.slice(elozo, talalat.index)
            )
        );

        const kep = document.createElement("img");

        kep.src = "kepek/ellenorzes/" +
            talalat[1].trim();

        kep.alt = "A válaszhoz tartozó ábra";
        kep.loading = "lazy";

        elem.appendChild(kep);

        elozo = minta.lastIndex;
    }

    elem.appendChild(
        document.createTextNode(szoveg.slice(elozo))
    );
}

function megjelenites(lista) {
    kerdeslista.replaceChildren();

    darabszam.textContent =
        "Megjelenített kérdések: " + lista.length +
        " / " + osszesKerdes.length;

    if (lista.length === 0) {
        kerdeslista.textContent = "Nincs találat.";
        return;
    }

    lista.forEach(adat => {
        const kartya = document.createElement("div");
        kartya.className = "kerdes";

        const cim = document.createElement("h3");
        cim.textContent = adat.sorszam + ". " + adat.kerdes;

        const valasz = document.createElement("div");
        valasz.className = "valasz";

        valaszMegjelenitese(valasz, adat.valasz);

        kartya.appendChild(cim);
        kartya.appendChild(valasz);

        kartya.addEventListener("click", () => {
            valasz.classList.toggle("lathato");
        });

        kerdeslista.appendChild(kartya);
    });
}

kereso.addEventListener("input", () => {
    const keresett = kereso.value.toLowerCase().trim();

    const talalatok = osszesKerdes.filter(adat =>
        adat.kerdes.toLowerCase().includes(keresett) ||
        adat.sorszam.toString().includes(keresett)
    );

    megjelenites(talalatok);
});

kerdesekBetoltese();
