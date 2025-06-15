import { useState, useEffect } from "react";
import React from "react";

// Componente principal de la aplicación
export default function DuallockeApp() {
  // Estado para manejo de pestañas
  const [activeTab, setActiveTab] = useState("counters");

  // Estado para el jugador
  const [player, setPlayer] = useState({
    name: "Jugador",
    lives: 20,
    pokemon: [],
    deadPokemon: [],
  });

  // Estado para el nombre del jugador rival
  const [rivalName, setRivalName] = useState("Rival");
  const [rivalTeam, setRivalTeam] = useState(() => {
    // Recuperar equipo rival de localStorage al iniciar
    const savedRivalTeam = localStorage.getItem("rivalTeam");
    return savedRivalTeam ? JSON.parse(savedRivalTeam) : [];
  });
  // Función para resetear los datos del rival
  const resetRivalData = () => {
    setRivalTeam([]);
    setRivalName("Rival");
    localStorage.removeItem("rivalTeam");
    localStorage.removeItem("rivalName");
    alert("Datos del rival eliminados correctamente");
  };

  // Estado para las rutas capturadas y sus estados
  const [routeStatus, setRouteStatus] = useState({});

  // Estado para la creación de nuevos Pokémon
  const [newPokemon, setNewPokemon] = useState({
    name: "",
    ability: "",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
    route: "",
    types: [],
    sprite: "",
    item: "",
    stats: {},
  });
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Estado para los datos de la API
  const [pokemonList, setPokemonList] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [moves, setMoves] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // Estado para importación/exportación
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Cargar datos del localStorage al iniciar
  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem("duallockeData");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.player) {
            setPlayer(parsedData.player);
          }
          if (parsedData.routeStatus) {
            setRouteStatus(parsedData.routeStatus);
          }
          if (parsedData.rivalName) {
            setRivalName(parsedData.rivalName);
          }
        }
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    };

    // Pequeño retraso para asegurar que el componente esté completamente montado
    setTimeout(loadSavedData, 100);
  }, []);

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    const saveData = () => {
      try {
        const dataToSave = {
          player,
          routeStatus,
          rivalName,
        };
        localStorage.setItem("duallockeData", JSON.stringify(dataToSave));
        console.log("Datos guardados en localStorage:", dataToSave);
      } catch (e) {
        console.error("Error saving data to localStorage:", e);
      }
    };

    if (!loading) {
      saveData();
    }
  }, [player, routeStatus, rivalName, loading]);

  // Carga de datos iniciales de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener lista de Pokémon hasta la gen 4 (1-493)
        const pokemonData = await Promise.all(
          Array.from({ length: 493 }, (_, i) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`)
              .then((res) => res.json())
              .catch((err) => null)
          )
        );

        const filteredPokemonData = pokemonData.filter((p) => p !== null);
        setPokemonList(
          filteredPokemonData.map((p) => ({
            id: p.id,
            name: p.name,
            sprite: p.sprites.front_default,
            types: p.types.map((t) => t.type.name),
            stats: p.stats.reduce((acc, stat) => {
              acc[stat.stat.name] = stat.base_stat;
              return acc;
            }, {}),
          }))
        );

        // Obtener habilidades
        const abilitiesRes = await fetch(
          "https://pokeapi.co/api/v2/ability?limit=300"
        );
        const abilitiesData = await abilitiesRes.json();
        setAbilities(abilitiesData.results.map((a) => a.name));

        // Obtener movimientos
        const movesRes = await fetch(
          "https://pokeapi.co/api/v2/move?limit=500"
        );
        const movesData = await movesRes.json();
        setMoves(movesData.results.map((m) => m.name));
        // Obtener objetos
        const itemsRes = await fetch(
          "https://pokeapi.co/api/v2/item?limit=500"
        );
        const itemsData = await itemsRes.json();
        setItems(itemsData.results.map((i) => i.name));

        // Establecer rutas de HeartGold
        setRoutes([
          "New Bark Town",
          "Reward Battle Rival",
          "Reward Battle Rival",
          "Reward Battle Rival",
          "Reward Battle Rival",
          "Starter",
          "Egg Event",
          "Route 29",
          "Cherrygrove City",
          "Route 30",
          "Route 31",
          "Violet City",
          "Sprout Tower",
          "Route 32",
          "Union Cave",
          "Route 33",
          "Azalea Town",
          "Slowpoke Well",
          "Ilex Forest",
          "Route 34",
          "Goldenrod City",
          "Route 35",
          "National Park",
          "Route 36",
          "Route 37",
          "Ecruteak City",
          "Burned Tower",
          "Route 38",
          "Route 39",
          "Olivine City",
          "Route 40",
          "Route 41",
          "Cianwood City",
          "Route 42",
          "Mt. Mortar",
          "Route 43",
          "Lake of Rage",
          "Route 44",
          "Ice Path",
          "Blackthorn City",
          "Dragon's Den",
          "Route 45",
          "Route 46",
          "Dark Cave",
          "Route 47",
          "Route 48",
          "Safari Zone",
          "Ruins of Alph",
          "Whirl Islands",
          "Mt. Silver",
          "Route 26",
          "Route 27",
          "Route 28",
          "Tohjo Falls",
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejadores de eventos
  const handleLivesChange = (amount) => {
    setPlayer({ ...player, lives: Math.max(0, player.lives + amount) });
  };

  const handleNameChange = (event) => {
    const selectedPokemon = pokemonList.find(
      (p) => p.name === event.target.value
    );
    if (selectedPokemon) {
      setNewPokemon({
        ...newPokemon,
        name: selectedPokemon.name,
        types: selectedPokemon.types,
        sprite: selectedPokemon.sprite,
        stats: selectedPokemon.stats,
      });
    }
  };

  const handleFormChange = (field, value) => {
    setNewPokemon({
      ...newPokemon,
      [field]: value,
    });
  };

  const handleAddPokemon = () => {
    if (newPokemon.name && newPokemon.route) {
      // Añadir Pokémon al jugador
      setPlayer({
        ...player,
        pokemon: [...player.pokemon, { ...newPokemon, id: Date.now() }],
      });

      // Actualizar estado de la ruta
      setRouteStatus({
        ...routeStatus,
        [newPokemon.route]: {
          status: "captured",
          pokemon: newPokemon.name,
        },
      });

      // Resetear formulario
      setNewPokemon({
        name: "",
        ability: "",
        move1: "",
        move2: "",
        move3: "",
        move4: "",
        route: "",
        types: [],
        sprite: "",
        stats: {},
      });
    }
  };
  const handleEditPokemon = (pokemon) => {
    setEditingPokemon({ ...pokemon });
    setShowEditModal(true);
  };

  // Función para guardar los cambios de un Pokémon editado
  const handleSaveEditedPokemon = () => {
    if (editingPokemon) {
      // Actualizar el Pokémon en la lista de Pokémon activos
      setPlayer({
        ...player,
        pokemon: player.pokemon.map((p) =>
          p.id === editingPokemon.id ? editingPokemon : p
        ),
      });

      // Cerrar el modal y limpiar el estado de edición
      setShowEditModal(false);
      setEditingPokemon(null);
    }
  };

  const handleMarkAsDead = (pokemonId) => {
    const pokemon = player.pokemon.find((p) => p.id === pokemonId);
    if (pokemon) {
      // Eliminar de la lista de Pokémon vivos
      setPlayer({
        ...player,
        pokemon: player.pokemon.filter((p) => p.id !== pokemonId),
        deadPokemon: [...player.deadPokemon, pokemon],
      });
    }
  };

  const updateRouteStatus = (route, status) => {
    setRouteStatus({
      ...routeStatus,
      [route]: {
        ...routeStatus[route],
        status: status,
      },
    });
  };

  const handlePlayerNameChange = (e) => {
    setPlayer({
      ...player,
      name: e.target.value,
    });
  };

  const handleRivalNameChange = (e) => {
    setRivalName(e.target.value);
  };

  // Función para exportar datos del equipo
  const generateExportData = () => {
    const exportData = {
      player: {
        name: player.name,
        pokemon: player.pokemon,
        deadPokemon: player.deadPokemon,
      },
    };
    return JSON.stringify(exportData);
  };

  // Función para copiar los datos al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("¡Datos copiados al portapapeles!");
      },
      (err) => {
        console.error("Error al copiar: ", err);
      }
    );
  };

  const handleImportData = () => {
    try {
      const importedData = JSON.parse(importData);
      if (importedData && importedData.player) {
        // Actualizar los datos del rival
        setRivalName(importedData.player.name || "Rival");
        localStorage.setItem("rivalName", importedData.player.name || "Rival");

        // Guardar el equipo del rival si existe
        if (
          importedData.player.pokemon &&
          Array.isArray(importedData.player.pokemon)
        ) {
          setRivalTeam(importedData.player.pokemon);
          // Guardar en localStorage
          localStorage.setItem(
            "rivalTeam",
            JSON.stringify(importedData.player.pokemon)
          );
        }

        alert(
          `¡Datos del equipo de ${importedData.player.name} importados correctamente!`
        );
        setShowImportModal(false);
        setImportData("");
      } else {
        alert("El formato de los datos importados no es válido.");
      }
    } catch (e) {
      alert("Error al importar datos. Verifica el formato JSON.");
      console.error("Error importing data:", e);
    }
  };

  const capitalizeWords = (text) => {
    if (!text) return text;
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const generateShowdownText = () => {
    return player.pokemon
      .map((pokemon) => {
        const name =
          pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        // Formatear el nombre del objeto correctamente
        const itemText = pokemon.item
          ? ` @ ${capitalizeWords(pokemon.item.replace(/-/g, " "))}`
          : "";

        // Formatear los movimientos correctamente
        const formatMove = (move) => {
          if (!move) return "???";
          return capitalizeWords(move.replace(/-/g, " "));
        };

        return `${name}${itemText}  
Ability: ${
          pokemon.ability
            ? capitalizeWords(pokemon.ability.replace(/-/g, " "))
            : "???"
        }  
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe  
EVs: 0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe  
- ${formatMove(pokemon.move1)}
- ${formatMove(pokemon.move2)}
- ${formatMove(pokemon.move3)}
- ${formatMove(pokemon.move4)}
`;
      })
      .join("\n");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Cargando datos de Pokémon...</div>
      </div>
    );
  }

  // Renderizar el componente principal
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white p-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">Duallocke Pokémon</h1>
      </header>

      {/* Selector de pestañas */}
      <div className="bg-white border-b">
        <div className="container mx-auto flex flex-wrap justify-center">
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "counters"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("counters")}
          >
            Contador de Vidas
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "pokemon"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("pokemon")}
          >
            Pokémon Equipo
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "dead"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("dead")}
          >
            Caja de Caídos
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "routes"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("routes")}
          >
            Mapa de Rutas
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "rules"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("rules")}
          >
            Reglas
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "showdown"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("showdown")}
          >
            Combates Showdown
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "share"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("share")}
          >
            Compartir
          </button>
        </div>
      </div>

      {/* Configuración de nombres */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <label className="mr-2 font-medium">Tu nombre:</label>
            <input
              type="text"
              value={player.name}
              onChange={handlePlayerNameChange}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2 font-medium">Nombre del rival:</label>
            <input
              type="text"
              value={rivalName}
              onChange={handleRivalNameChange}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* Contenido de pestañas */}
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Contador de vidas */}
          {activeTab === "counters" && (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4 text-blue-600">
                {player.name}
              </h2>
              <div className="flex justify-center items-center">
                <button
                  className="bg-red-500 text-white w-12 h-12 rounded-full text-2xl"
                  onClick={() => handleLivesChange(-1)}
                  disabled={player.lives <= 0}
                >
                  -
                </button>
                <div className="text-5xl font-bold mx-8">{player.lives}</div>
                <button
                  className="bg-green-500 text-white w-12 h-12 rounded-full text-2xl"
                  onClick={() => handleLivesChange(1)}
                >
                  +
                </button>
              </div>
              <p className="mt-6 text-gray-600">
                Cada vez que un Pokémon se debilita, resta una vida.
              </p>
            </div>
          )}

          {/* Lista de Pokémon y formulario para añadir nuevos */}
          {activeTab === "pokemon" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Equipo de {player.name}
              </h2>

              {/* Formulario para añadir Pokémon */}
              <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Añadir nuevo Pokémon
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pokémon
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newPokemon.name}
                      onChange={handleNameChange}
                    >
                      <option value="">Selecciona un Pokémon</option>
                      {pokemonList.map((pokemon) => (
                        <option key={pokemon.id} value={pokemon.name}>
                          {pokemon.name.charAt(0).toUpperCase() +
                            pokemon.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Habilidad
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newPokemon.ability}
                      onChange={(e) =>
                        handleFormChange("ability", e.target.value)
                      }
                    >
                      <option value="">Selecciona una habilidad</option>
                      {abilities.map((ability) => (
                        <option key={ability} value={ability}>
                          {ability.charAt(0).toUpperCase() +
                            ability.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ruta de captura
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newPokemon.route}
                      onChange={(e) =>
                        handleFormChange("route", e.target.value)
                      }
                    >
                      <option value="">Selecciona una ruta</option>
                      {routes.map((route) => {
                        const routeData = routeStatus[route] || {};
                        const isDisabled =
                          routeData.status === "captured" ||
                          routeData.status === "missed";
                        return (
                          <option
                            key={route}
                            value={route}
                            disabled={isDisabled}
                          >
                            {route}
                            {routeData.status === "captured"
                              ? " (Ya capturado)"
                              : ""}
                            {routeData.status === "missed"
                              ? " (Oportunidad perdida)"
                              : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objeto
                    </label>
                    <select
                      className="w-full p-2 border rounded capitalize"
                      value={newPokemon.item}
                      onChange={(e) => handleFormChange("item", e.target.value)}
                    >
                      <option value="">Sin objeto</option>
                      {items.map((item) => (
                        <option key={item} value={item}>
                          {item.charAt(0).toUpperCase() +
                            item.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movimiento 1
                    </label>
                    <select
                      className="w-full p-2 border rounded capitalize"
                      value={newPokemon.move1}
                      onChange={(e) =>
                        handleFormChange("move1", e.target.value)
                      }
                    >
                      <option value="">Selecciona</option>
                      {moves.map((move) => (
                        <option key={move} value={move}>
                          {move.charAt(0).toUpperCase() +
                            move.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movimiento 2
                    </label>
                    <select
                      className="w-full p-2 border rounded capitalize"
                      value={newPokemon.move2}
                      onChange={(e) =>
                        handleFormChange("move2", e.target.value)
                      }
                    >
                      <option value="">Selecciona</option>
                      {moves.map((move) => (
                        <option key={move} value={move}>
                          {move.charAt(0).toUpperCase() +
                            move.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movimiento 3
                    </label>
                    <select
                      className="w-full p-2 border rounded capitalize"
                      value={newPokemon.move3}
                      onChange={(e) =>
                        handleFormChange("move3", e.target.value)
                      }
                    >
                      <option value="">Selecciona</option>
                      {moves.map((move) => (
                        <option key={move} value={move}>
                          {move.charAt(0).toUpperCase() +
                            move.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movimiento 4
                    </label>
                    <select
                      className="w-full p-2 border rounded capitalize"
                      value={newPokemon.move4}
                      onChange={(e) =>
                        handleFormChange("move4", e.target.value)
                      }
                    >
                      <option value="">Selecciona</option>
                      {moves.map((move) => (
                        <option key={move} value={move}>
                          {move.charAt(0).toUpperCase() +
                            move.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vista previa de estadísticas */}
                {newPokemon.name && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Estadísticas base de{" "}
                      {newPokemon.name.charAt(0).toUpperCase() +
                        newPokemon.name.slice(1)}
                      :
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                      {newPokemon.stats &&
                        Object.entries(newPokemon.stats).map(
                          ([stat, value]) => (
                            <div key={stat} className="text-sm">
                              <span className="font-medium capitalize">
                                {stat.replace("-", " ")}:
                              </span>{" "}
                              {value}
                            </div>
                          )
                        )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => {
                      if (newPokemon.route) {
                        updateRouteStatus(newPokemon.route, "missed");
                        setNewPokemon({ ...newPokemon, route: "" });
                      }
                    }}
                    disabled={!newPokemon.route}
                  >
                    Marcar ruta como perdida
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddPokemon}
                    disabled={!newPokemon.name || !newPokemon.route}
                  >
                    Añadir Pokémon
                  </button>
                </div>
              </div>

              {/* Lista de Pokémon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {player.pokemon.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold capitalize">
                            {pokemon.name}
                          </h3>
                          <div className="flex space-x-2 mt-1">
                            {pokemon.types.map((type) => (
                              <span
                                key={type}
                                className="px-2 py-1 rounded-full text-xs text-white capitalize"
                                style={{ background: getTypeColor(type) }}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        {pokemon.sprite && (
                          <img
                            src={pokemon.sprite}
                            alt={pokemon.name}
                            className="w-16 h-16"
                          />
                        )}
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Habilidad:</span>{" "}
                          <span className="capitalize">
                            {pokemon.ability || "No especificada"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Objeto:</span>{" "}
                          <span className="capitalize">
                            {pokemon.item
                              ? pokemon.item.replace("-", " ")
                              : "Ninguno"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Ruta:</span>{" "}
                          {pokemon.route}
                        </p>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm font-semibold">Movimientos:</p>
                        <ul className="text-sm text-gray-600">
                          {pokemon.move1 && (
                            <li className="capitalize">
                              {pokemon.move1.replace("-", " ")}
                            </li>
                          )}
                          {pokemon.move2 && (
                            <li className="capitalize">
                              {pokemon.move2.replace("-", " ")}
                            </li>
                          )}
                          {pokemon.move3 && (
                            <li className="capitalize">
                              {pokemon.move3.replace("-", " ")}
                            </li>
                          )}
                          {pokemon.move4 && (
                            <li className="capitalize">
                              {pokemon.move4.replace("-", " ")}
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Estadísticas base */}
                      <div className="mt-3 bg-gray-50 p-2 rounded-lg">
                        <p className="text-sm font-semibold mb-1">
                          Estadísticas base:
                        </p>
                        <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                          {pokemon.stats &&
                            Object.entries(pokemon.stats).map(
                              ([stat, value]) => (
                                <div key={stat} className="text-xs">
                                  <span className="font-medium capitalize">
                                    {stat.replace("-", " ")}:
                                  </span>{" "}
                                  {value}
                                </div>
                              )
                            )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          className="flex-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                          onClick={() => handleEditPokemon(pokemon)}
                        >
                          Editar Pokémon
                        </button>
                        <button
                          className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                          onClick={() => handleMarkAsDead(pokemon.id)}
                        >
                          Marcar como caído
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {showEditModal && editingPokemon && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <h2 className="text-xl font-bold mb-4">Editar Pokémon</h2>

                      <div className="flex items-start mb-4">
                        <div className="mr-4">
                          {editingPokemon.sprite && (
                            <img
                              src={editingPokemon.sprite}
                              alt={editingPokemon.name}
                              className="w-20 h-20"
                            />
                          )}
                        </div>

                        <div className="flex flex-col">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pokémon
                            </label>
                            <select
                              className="w-full p-2 border rounded"
                              value={editingPokemon.name}
                              onChange={(e) => {
                                const selectedPokemon = pokemonList.find(
                                  (p) => p.name === e.target.value
                                );
                                if (selectedPokemon) {
                                  setEditingPokemon({
                                    ...editingPokemon,
                                    name: selectedPokemon.name,
                                    types: selectedPokemon.types,
                                    sprite: selectedPokemon.sprite,
                                    stats: selectedPokemon.stats,
                                  });
                                }
                              }}
                            >
                              {pokemonList.map((pokemon) => (
                                <option key={pokemon.id} value={pokemon.name}>
                                  {pokemon.name.charAt(0).toUpperCase() +
                                    pokemon.name.slice(1)}
                                </option>
                              ))}
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                              Usa esto para evolucionar a tu Pokémon
                            </p>
                          </div>

                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Ruta de captura
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded bg-gray-100"
                              value={editingPokemon.route}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Habilidad
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={editingPokemon.ability}
                            onChange={(e) =>
                              setEditingPokemon({
                                ...editingPokemon,
                                ability: e.target.value,
                              })
                            }
                          >
                            <option value="">Selecciona una habilidad</option>
                            {abilities.map((ability) => (
                              <option key={ability} value={ability}>
                                {ability.charAt(0).toUpperCase() +
                                  ability.slice(1).replace("-", " ")}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col">
                          {/* Vista previa de estadísticas */}
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estadísticas base
                          </label>
                          <div className="bg-blue-50 p-2 rounded-lg flex-grow">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {editingPokemon.stats &&
                                Object.entries(editingPokemon.stats).map(
                                  ([stat, value]) => (
                                    <div key={stat} className="text-sm">
                                      <span className="font-medium capitalize">
                                        {stat.replace("-", " ")}:
                                      </span>{" "}
                                      {value}
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Objeto
                        </label>
                        <select
                          className="w-full p-2 border rounded capitalize"
                          value={editingPokemon.item || ""}
                          onChange={(e) =>
                            setEditingPokemon({
                              ...editingPokemon,
                              item: e.target.value,
                            })
                          }
                        >
                          <option value="">Sin objeto</option>
                          {items.map((item) => (
                            <option key={item} value={item}>
                              {item.charAt(0).toUpperCase() +
                                item.slice(1).replace("-", " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Movimiento 1
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={editingPokemon.move1 || ""}
                            onChange={(e) =>
                              setEditingPokemon({
                                ...editingPokemon,
                                move1: e.target.value,
                              })
                            }
                          >
                            <option value="">Selecciona un movimiento</option>
                            {moves.map((move) => (
                              <option key={move} value={move}>
                                {move.charAt(0).toUpperCase() +
                                  move.slice(1).replace("-", " ")}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Movimiento 2
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={editingPokemon.move2 || ""}
                            onChange={(e) =>
                              setEditingPokemon({
                                ...editingPokemon,
                                move2: e.target.value,
                              })
                            }
                          >
                            <option value="">Selecciona un movimiento</option>
                            {moves.map((move) => (
                              <option key={move} value={move}>
                                {move.charAt(0).toUpperCase() +
                                  move.slice(1).replace("-", " ")}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Movimiento 3
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={editingPokemon.move3 || ""}
                            onChange={(e) =>
                              setEditingPokemon({
                                ...editingPokemon,
                                move3: e.target.value,
                              })
                            }
                          >
                            <option value="">Selecciona un movimiento</option>
                            {moves.map((move) => (
                              <option key={move} value={move}>
                                {move.charAt(0).toUpperCase() +
                                  move.slice(1).replace("-", " ")}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Movimiento 4
                          </label>
                          <select
                            className="w-full p-2 border rounded"
                            value={editingPokemon.move4 || ""}
                            onChange={(e) =>
                              setEditingPokemon({
                                ...editingPokemon,
                                move4: e.target.value,
                              })
                            }
                          >
                            <option value="">Selecciona un movimiento</option>
                            {moves.map((move) => (
                              <option key={move} value={move}>
                                {move.charAt(0).toUpperCase() +
                                  move.slice(1).replace("-", " ")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <button
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingPokemon(null);
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          onClick={handleSaveEditedPokemon}
                        >
                          Guardar cambios
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {player.pokemon.length === 0 && (
                <div className="text-center text-gray-500 my-8">
                  No hay Pokémon registrados. ¡Añade uno nuevo!
                </div>
              )}
            </div>
          )}

          {/* Caja de caídos */}
          {activeTab === "dead" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Caja de Caídos de {player.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {player.deadPokemon.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="bg-gray-100 border rounded-lg shadow-md overflow-hidden opacity-75"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold capitalize text-gray-700">
                            {pokemon.name}
                          </h3>
                          <div className="flex space-x-2 mt-1">
                            {pokemon.types.map((type) => (
                              <span
                                key={type}
                                className="px-2 py-1 rounded-full text-xs text-white capitalize"
                                style={{ background: getTypeColor(type) }}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        {pokemon.sprite && (
                          <img
                            src={pokemon.sprite}
                            alt={pokemon.name}
                            className="w-16 h-16 grayscale"
                          />
                        )}
                      </div>

                      <div className="mt-2 text-gray-600">
                        <p className="text-sm">
                          <span className="font-semibold">Habilidad:</span>{" "}
                          {pokemon.ability || "No especificada"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Objeto:</span>{" "}
                          <span className="capitalize">
                            {pokemon.item
                              ? pokemon.item.replace("-", " ")
                              : "Ninguno"}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Ruta:</span>{" "}
                          {pokemon.route}
                        </p>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm font-semibold text-gray-600">
                          Movimientos:
                        </p>
                        <ul className="text-sm text-gray-600">
                          {pokemon.move1 && (
                            <li className="capitalize">
                              {pokemon.move1.replace("-", " ")}
                            </li>
                          )}
                          {pokemon.move2 && (
                            <li className="capitalize">
                              {pokemon.move2.replace("-", " ")}
                            </li>
                          )}
                          {pokemon.move3 && (
                            <li className="capitalize">
                              {pokemon.move3.replace("-", " ")}
                            </li>
                          )}
                          {pokemon.move4 && (
                            <li className="capitalize">
                              {pokemon.move4.replace("-", " ")}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {player.deadPokemon.length === 0 && (
                <div className="text-center text-gray-500 my-8">
                  No hay Pokémon caídos. ¡Mantén así!
                </div>
              )}
            </div>
          )}

          {/* Mapa de rutas */}
          {activeTab === "routes" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Mapa de Rutas</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {routes.map((route) => {
                  const status = routeStatus[route] || {};
                  let statusColor = "bg-gray-100";
                  let statusIcon = null;
                  let statusText = "Disponible";

                  // Encontrar datos del Pokémon capturado
                  let capturedPokemonData = null;
                  if (status.status === "captured" && status.pokemon) {
                    capturedPokemonData =
                      player.pokemon.find((p) => p.name === status.pokemon) ||
                      player.deadPokemon.find((p) => p.name === status.pokemon);
                  }

                  if (status.status === "captured") {
                    statusColor = "bg-green-100";
                    statusText = "Capturado";
                    if (capturedPokemonData?.sprite) {
                      statusIcon = (
                        <img
                          src={capturedPokemonData.sprite}
                          alt={capturedPokemonData.name}
                          className={`w-12 h-12 ${
                            player.deadPokemon.find(
                              (p) => p.name === status.pokemon
                            )
                              ? "grayscale"
                              : ""
                          }`}
                        />
                      );
                    }
                  } else if (status.status === "missed") {
                    statusColor = "bg-red-100";
                    statusText = "Perdida";
                  }

                  return (
                    <div
                      key={route}
                      className={`${statusColor} p-3 rounded-lg border shadow-sm`}
                    >
                      <h3 className="font-medium">{route}</h3>
                      <div className="flex items-center mt-1">
                        {statusIcon && <div className="mr-2">{statusIcon}</div>}
                        <div>
                          <p className="text-sm text-gray-600">{statusText}</p>
                          {status.status === "captured" && status.pokemon && (
                            <p className="text-sm font-medium capitalize">
                              {status.pokemon}
                              {player.deadPokemon.find(
                                (p) => p.name === status.pokemon
                              ) && " (Caído)"}
                            </p>
                          )}
                        </div>
                      </div>

                      {!status.status && (
                        <div className="mt-2 flex space-x-2">
                          <button
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                            onClick={() => updateRouteStatus(route, "missed")}
                          >
                            Marcar perdida
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reglas */}
          {activeTab === "rules" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reglas del Duallocke</h2>

              <div className="prose prose-sm max-w-none">
                <h3 className="text-xl font-semibold mt-4">Reglas básicas</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Solo puedes capturar el primer Pokémon que encuentres en
                    cada ruta/zona.
                  </li>
                  <li>
                    Si un Pokémon se debilita, se considera muerto y debes
                    guardarlo en la "Caja de Caídos".
                  </li>
                  <li>
                    Debes ponerle mote a todos tus Pokémon para crear un
                    vínculo.
                  </li>
                  <li>
                    Si todos tus Pokémon son derrotados, se considera Game Over.
                  </li>
                  <li>
                    Las apariciones duplicadas pueden ignorarse (Cláusula
                    Dupes).
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mt-6">
                  Reglas del Duallocke
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Dos jugadores juegan simultáneamente en dos juegos
                    compatibles.
                  </li>
                  <li>
                    Ambos jugadores deben usar el mismo equipo de 6 Pokémon.
                  </li>
                  <li>
                    Cuando un Pokémon se debilita, ambos jugadores deben perder
                    ese Pokémon.
                  </li>
                  <li>Cada jugador tiene 20 vidas al inicio.</li>
                  <li>Cuando un Pokémon se debilita, se pierde una vida.</li>
                  <li>
                    Si un jugador se queda sin vidas, el otro debe continuar
                    solo.
                  </li>
                  <li>
                    Intercambios solo están permitidos entre los dos jugadores.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold mt-6">
                  Opciones personalizables
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Número inicial de vidas (recomendado: 20).</li>
                  <li>Permitir Pokémon Legendarios o no.</li>
                  <li>Uso de elementos curativos en batalla.</li>
                  <li>
                    Nivel máximo para gimnasios (para evitar sobre-nivelación).
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Combates Showdown */}
          {activeTab === "showdown" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Formato para Pokémon Showdown
              </h2>

              <p className="mb-4 text-gray-600">
                Copia y pega este código en Pokémon Showdown para importar tu
                equipo actual:
              </p>

              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {generateShowdownText()}
                </pre>
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => copyToClipboard(generateShowdownText())}
              >
                Copiar al portapapeles
              </button>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Instrucciones para Pokémon Showdown
                </h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Ve a{" "}
                    <a
                      href="https://play.pokemonshowdown.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Pokémon Showdown
                    </a>
                  </li>
                  <li>Haz clic en "Teambuilder" en la pantalla principal</li>
                  <li>Haz clic en "Import from text"</li>
                  <li>Pega el código generado arriba</li>
                  <li>Guarda el equipo</li>
                  <li>
                    Puedes usar este equipo para batallas contra tu rival del
                    Duallocke
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Compartir */}
          {activeTab === "share" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Compartir tu Equipo</h2>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">
                    Exportar tu equipo
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Comparte estos datos con tu compañero de Duallocke para que
                    pueda ver tu progreso.
                  </p>

                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                      setExportData(generateExportData());
                      setShowExportModal(true);
                    }}
                  >
                    Generar código para compartir
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4">
                    Importar equipo rival
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Importa los datos de tu compañero para ver su progreso.
                  </p>

                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => setShowImportModal(true)}
                  >
                    Importar datos de equipo
                  </button>
                </div>
              </div>
              {rivalTeam.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">Equipo de {rivalName}</h3>
                    <button
                      onClick={resetRivalData}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                    >
                      Borrar datos
                    </button>
                  </div>
                  <div className="flex flex-nowrap overflow-x-auto pb-4 gap-4">
                    {rivalTeam.map((pokemon, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg shadow"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold capitalize text-gray-700">
                                {pokemon.name}
                              </h3>
                              {pokemon.types && pokemon.types.length > 0 && (
                                <div className="flex space-x-2 mt-1">
                                  {pokemon.types.map((type, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 rounded-full text-xs text-white capitalize"
                                      style={{
                                        background: getTypeColor
                                          ? getTypeColor(type)
                                          : "#6B7280",
                                      }}
                                    >
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {pokemon.sprite && (
                              <img
                                src={pokemon.sprite}
                                alt={pokemon.name}
                                className="w-16 h-16"
                              />
                            )}
                          </div>

                          <div className="mt-2 text-gray-600">
                            <p className="text-sm">
                              <span className="font-semibold">Habilidad:</span>{" "}
                              {pokemon.ability
                                ? capitalizeWords(
                                    pokemon.ability.replace(/-/g, " ")
                                  )
                                : "No especificada"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Objeto:</span>{" "}
                              <span className="capitalize">
                                {pokemon.item
                                  ? capitalizeWords(
                                      pokemon.item.replace(/-/g, " ")
                                    )
                                  : "Ninguno"}
                              </span>
                            </p>
                            {pokemon.route && (
                              <p className="text-sm">
                                <span className="font-semibold">Ruta:</span>{" "}
                                {pokemon.route}
                              </p>
                            )}
                          </div>

                          <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-600">
                              Movimientos:
                            </p>
                            <ul className="text-sm text-gray-600">
                              {pokemon.move1 && (
                                <li className="capitalize">
                                  •{" "}
                                  {capitalizeWords(
                                    pokemon.move1.replace(/-/g, " ")
                                  )}
                                </li>
                              )}
                              {pokemon.move2 && (
                                <li className="capitalize">
                                  •{" "}
                                  {capitalizeWords(
                                    pokemon.move2.replace(/-/g, " ")
                                  )}
                                </li>
                              )}
                              {pokemon.move3 && (
                                <li className="capitalize">
                                  •{" "}
                                  {capitalizeWords(
                                    pokemon.move3.replace(/-/g, " ")
                                  )}
                                </li>
                              )}
                              {pokemon.move4 && (
                                <li className="capitalize">
                                  •{" "}
                                  {capitalizeWords(
                                    pokemon.move4.replace(/-/g, " ")
                                  )}
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal de exportación */}
              {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
                    <h2 className="text-xl font-bold mb-4">
                      Datos para compartir
                    </h2>
                    <p className="mb-4 text-gray-600">
                      Copia este código y compártelo con tu compañero de
                      Duallocke:
                    </p>

                    <textarea
                      className="w-full h-48 p-2 border rounded font-mono text-sm"
                      value={exportData}
                      readOnly
                    />

                    <div className="flex justify-between mt-4">
                      <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => setShowExportModal(false)}
                      >
                        Cerrar
                      </button>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => copyToClipboard(exportData)}
                      >
                        Copiar al portapapeles
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal de importación */}
              {showImportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
                    <h2 className="text-xl font-bold mb-4">
                      Importar datos del equipo rival
                    </h2>
                    <p className="mb-4 text-gray-600">
                      Pega el código que te ha compartido tu compañero de
                      Duallocke:
                    </p>

                    <textarea
                      className="w-full h-48 p-2 border rounded font-mono text-sm"
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Pega aquí el código..."
                    />

                    <div className="flex justify-between mt-4">
                      <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => setShowImportModal(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={handleImportData}
                      >
                        Importar datos
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Función auxiliar para obtener colores basados en tipo de Pokémon
function getTypeColor(type) {
  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  return typeColors[type] || "#888888";
}
