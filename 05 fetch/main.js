async function getPokemonById(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            return { "error": response.status }
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
        return { "error": error.message }
    }
}


getPokemonById(1).then(data => {
    console.log(data)
    data.abilities.forEach(a => {
        console.log(a.ability.name);
    });
}
)


// console.log(await getPokemonById(2));
