import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { TYPE_COLORS } from "../utils/constants";
import { usePokemonStore } from "../store/pokemonStore";

const { width } = Dimensions.get("window");
const cardWidth = (width - 2 * 12 - 2 * 8) / 2;

const PokemonCard = ({ pokemon, onPress }) => {
  const { toggleFavorite, isFavorite } = usePokemonStore();
  const favorite = isFavorite(pokemon.id);

  const handleFavoritePress = (e) => {
    e.stopPropagation();
    toggleFavorite(pokemon);
  };

  const getTypeColor = (types) => {
    return TYPE_COLORS[types[0]] || "#68A090";
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: getTypeColor(pokemon.types) }]}
      onPress={() => onPress(pokemon)}
      activeOpacity={0.8}
    >
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
      >
        <Ionicons
          name={favorite ? "star" : "star-outline"}
          size={22}
          color={favorite ? "#FFd700" : "#FFF"}
        />
      </TouchableOpacity>

      <Text style={styles.pokemonId}>
        #{pokemon.id.toString().padStart(3, "0")}
      </Text>

      <Image
        source={{ uri: pokemon.image }}
        style={styles.pokemonImage}
        contentFit="contain"
        transition={200}
      />

      <View style={styles.pokemonInfo}>
        <Text style={styles.pokemonName}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>

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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 2,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 15,
    padding: 5,
  },
  pokemonId: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 5,
  },
  pokemonImage: {
    width: "100%",
    height: 80,
    marginBottom: 10,
  },
  pokemonInfo: {
    alignItems: "flex-start",
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  typeTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 11,
    color: "#FFF",
    fontWeight: "500",
  },
});

export default PokemonCard;
