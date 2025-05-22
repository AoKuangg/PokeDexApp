import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { usePokemonStore } from "../store/pokemonStore";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  TYPE_COLORS,
  STAT_NAMES,
  STAT_COLORS,
  TEXTS,
} from "../utils/constants";

const { width } = Dimensions.get("window");

const PokemonDetailScreen = ({ route, navigation }) => {
  const { pokemonId, pokemonName } = route.params;
  const { fetchPokemonWithEvolutions, toggleFavorite, isFavorite, loading } =
    usePokemonStore();

  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemon) return;
    navigation.setOptions({
      title: pokemonName
        ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
        : "Pokémon",
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.favoriteHeaderButton}
        >
          <Ionicons
            name={isFavorite(pokemon.id) ? "star" : "star-outline"}
            size={28}
            color={isFavorite(pokemon.id) ? "#FFD700" : "#AAA"}
          />
        </TouchableOpacity>
      ),
    });
  }, [pokemon, isFavorite(pokemon?.id)]);

  useEffect(() => {
    loadPokemonDetails();
  }, [pokemonId]);

  const loadPokemonDetails = async () => {
    try {
      setError(null);
      const pokemonData = await fetchPokemonWithEvolutions(pokemonId);
      setPokemon(pokemonData);
    } catch (err) {
      setError(err.message);
      Alert.alert("Error", err.message);
    }
  };

  const handleToggleFavorite = () => {
    if (pokemon) {
      toggleFavorite(pokemon);
    }
  };

  const getTypeColor = (types) => {
    return TYPE_COLORS[types[0]] || "#68A090";
  };

  const StatBar = ({ stat }) => {
    const maxStat = 200;
    const percentage = Math.min((stat.value / maxStat) * 100, 100);

    return (
      <View style={styles.statContainer}>
        <Text style={styles.statName}>
          {STAT_NAMES[stat.name] || stat.name}
        </Text>
        <View style={styles.statBarContainer}>
          <View
            style={[
              styles.statBar,
              {
                width: `${percentage}%`,
                backgroundColor: STAT_COLORS[stat.name] || "#68A090",
              },
            ]}
          />
        </View>
        <Text style={styles.statValue}>{stat.value}</Text>
      </View>
    );
  };

  const EvolutionCard = ({ evolution }) => (
    <TouchableOpacity
      style={styles.evolutionCard}
      onPress={() => {
        navigation.push("PokemonDetail", {
          pokemonId: evolution.id,
          pokemonName: evolution.name,
        });
      }}
    >
      <Image
        source={{ uri: evolution.image }}
        style={styles.evolutionImage}
        contentFit="contain"
      />
      <Text style={styles.evolutionName}>
        {evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "No se pudo cargar el Pokémon"}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadPokemonDetails}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={getTypeColor(pokemon.types)}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con imagen y info básica */}
        <View
          style={[
            styles.header,
            { backgroundColor: getTypeColor(pokemon.types) },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.pokemonId}>
              #{pokemon.id.toString().padStart(3, "0")}
            </Text>

            <Image
              source={{ uri: pokemon.image }}
              style={styles.pokemonImage}
              contentFit="contain"
            />

            <View style={styles.typesContainer}>
              {pokemon.types.map((type, index) => (
                <View key={index} style={styles.typeTag}>
                  <Text style={styles.typeText}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Información detallada */}
        <View style={styles.detailsContainer}>
          <View style={styles.basicInfoContainer}>
            <View style={styles.basicInfoItem}>
              <Text style={styles.basicInfoLabel}>{TEXTS.height}</Text>
              <Text style={styles.basicInfoValue}>
                {(pokemon.height / 10).toFixed(1)} m
              </Text>
            </View>
            <View style={styles.basicInfoItem}>
              <Text style={styles.basicInfoLabel}>{TEXTS.weight}</Text>
              <Text style={styles.basicInfoValue}>
                {(pokemon.weight / 10).toFixed(1)} kg
              </Text>
            </View>
          </View>

          {/* Habilidades */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{TEXTS.abilities}</Text>
            <View style={styles.abilitiesContainer}>
              {pokemon.abilities.map((ability, index) => (
                <View key={index} style={styles.abilityTag}>
                  <Text style={styles.abilityText}>
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Estadísticas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{TEXTS.stats}</Text>
            <View style={styles.statsContainer}>
              {pokemon.stats.map((stat, index) => (
                <StatBar key={index} stat={stat} />
              ))}
            </View>
          </View>

          {/* Evoluciones */}
          {pokemon.evolutions && pokemon.evolutions.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{TEXTS.evolutions}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.evolutionsContainer}
              >
                {pokemon.evolutions.map((evolution, index) => (
                  <React.Fragment key={evolution.id}>
                    <EvolutionCard evolution={evolution} />
                    {index < pokemon.evolutions.length - 1 && (
                      <View style={styles.evolutionArrowContainer}>
                        <Ionicons name="arrow-forward" size={24} color="#AAA" />
                        {pokemon.evolutions[index + 1].min_level && (
                          <Text style={styles.evolutionLevel}>
                            Nivel {pokemon.evolutions[index + 1].min_level}
                          </Text>
                        )}
                      </View>
                    )}
                  </React.Fragment>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    flex: 1,
  },
  favoriteHeaderButton: {
    marginRight: 15,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
  },
  pokemonId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
  },
  pokemonImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 10,
  },
  typeTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  basicInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  basicInfoItem: {
    alignItems: "center",
  },
  basicInfoLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  basicInfoValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  abilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  abilityTag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  abilityText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  statsContainer: {
    gap: 12,
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    width: 100,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    borderRadius: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    width: 40,
    textAlign: "right",
  },
  evolutionsContainer: {
    gap: 15,
    paddingHorizontal: 5,
  },
  evolutionCard: {
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 15,
    width: 100,
  },
  evolutionImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  evolutionName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  evolutionArrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  evolutionLevel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    textAlign: "center",
  },
});

export default PokemonDetailScreen;
